using Microsoft.AspNetCore.Mvc;
using Social_network.Server.Data;
using Social_network.Server.Models;
using Microsoft.EntityFrameworkCore;
using Social_network.Server.Interfaces;
using System.Text.Json.Serialization;
using System.Text.Json;
using Social_network.Server.Extensions;

namespace Social_network.Server.Controllers
{


    public class SendMessageRequest
    {
        public string MessageText { get; set; }
    }

    public class LowerCaseNamingPolicy : JsonNamingPolicy
    {
        public override string ConvertName(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                return name;
            }

            return char.ToLower(name[0]) + name.Substring(1);
        }
    }


    [ApiController]
    [Route("api/chat")]
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly IUserRepository _userRepository;
        private static readonly Dictionary<Guid, List<Action<ChatMessage>>> _subscribers = new();

        public ChatController(ApplicationDBContext context, IUserRepository userRepository)
        {
            _context = context;
            _userRepository = userRepository;
        }

        [HttpGet("messages/{userId}")]
        public async Task<ActionResult<IEnumerable<ChatMessage>>> GetChatMessages(Guid userId)
        {
            var messages = await _context.ChatMessages
                .Where(m => m.ChatRoom.Participants.Any(p => p.Id == userId))
                .OrderByDescending(m => m.SentAt)
                .ToListAsync();

            return Ok(messages);
        }

        [HttpGet("chat/{userId1}/{userId2}")]
        public async Task<ActionResult> GetOrCreateChatRoom(Guid userId1, Guid userId2)
        {
            var chatRoom = await _context.ChatRooms
                .Include(cr => cr.Participants)
                .ThenInclude(p => p.State)
                .Include(cr => cr.Participants)
                .ThenInclude(p => p.Avatar)
                .FirstOrDefaultAsync(cr => cr.Participants.Any(p => p.Id == userId1) && cr.Participants.Any(p => p.Id == userId2));

            if (chatRoom == null)
            {
                var user1 = await _userRepository.GetUserById(userId1);
                var user2 = await _userRepository.GetUserById(userId2);

                if (user1 == null || user2 == null)
                {
                    return NotFound("One or both users not found.");
                }

                chatRoom = new ChatRoom
                {
                    Id = Guid.NewGuid(),
                    Participants = new List<User> { user1, user2 }
                };

                _context.ChatRooms.Add(chatRoom);
                await _context.SaveChangesAsync();
            }

            var response = new
            {
                Id = chatRoom.Id,
                Participants = chatRoom.Participants.Select(p => p.ToDto())
            };

            return Ok(response);
        }

        [HttpGet("chats/{userId}")]
        public async Task<ActionResult<IEnumerable<ChatRoom>>> GetChatRooms(Guid userId)
        {
            var chatRooms = await _context.ChatRooms
                .Include(cr => cr.Participants)
                .ThenInclude(p => p.State)
                .Include(cr => cr.Participants)
                .ThenInclude(p => p.Avatar)
                .Where(cr => cr.Participants.Any(p => p.Id == userId))
                .ToListAsync();

            var res = chatRooms.Select(cr => new
            {
                Id = cr.Id,
                Participant = cr.Participants.Where(u => u.Id != userId).Select(p => p.ToDto()).FirstOrDefault()
            });

            return Ok(res);
        }

        [HttpPost("message/send/{receiverId}")]
        public async Task<ActionResult> SendMessage(Guid receiverId, [FromBody] SendMessageRequest request)
        {
            var token = Request.Cookies["AuthToken"];
            var sender = await _userRepository.GetUserByToken(token);

            if (sender == null)
            {
                return Unauthorized();
            }
            var senderId = sender.Id;

            var chatRoom = await _context.ChatRooms
                .Include(cr => cr.Participants)
                .FirstOrDefaultAsync(cr => cr.Participants.Any(p => p.Id == senderId) && cr.Participants.Any(p => p.Id == receiverId));

            if (chatRoom == null)
            {
                var receiver = await _userRepository.GetUserById(receiverId);

                if (sender == null || receiver == null)
                {
                    return NotFound("One or both users not found.");
                }

                chatRoom = new ChatRoom
                {
                    Id = Guid.NewGuid(),
                    Participants = new List<User> { sender, receiver }
                };

                _context.ChatRooms.Add(chatRoom);
                await _context.SaveChangesAsync();
            }

            var chatMessage = new ChatMessage
            {
                Id = Guid.NewGuid(),
                ChatRoomId = chatRoom.Id,
                SenderId = senderId,
                Message = request.MessageText,
                SentAt = DateTime.UtcNow
            };

            _context.ChatMessages.Add(chatMessage);
            await _context.SaveChangesAsync();



            NotifySubscribers(senderId, chatMessage);
            NotifySubscribers(receiverId, chatMessage);

            return Ok(chatMessage);
        }
        [HttpGet("chat-users/{userId}")]
        public async Task<ActionResult<IEnumerable<User>>> GetChatUsers(Guid userId)
        {
            var chatRooms = await _context.ChatRooms
                .Include(cr => cr.Participants)
                .ThenInclude(p => p.State)
                .Include(cr => cr.Participants)
                .ThenInclude(p => p.Avatar)
                .Include(cr => cr.Participants)
                .ThenInclude(p => p.UserRoles)
                .Where(cr => cr.Participants.Any(p => p.Id == userId))
                .ToListAsync();

            var users = chatRooms
                .SelectMany(cr => cr.Participants)
                .Where(p => p.Id != userId)
                .Distinct()
                .ToList();

            return Ok(users.Select(u => u.ToDto()));
        }
        [HttpGet("chat-messages/{userId1}")]
        public async Task<ActionResult<IEnumerable<ChatMessage>>> GetChatMessagesBetweenUsers(Guid userId1)
        {

            var token = Request.Cookies["AuthToken"];
            var user = await _userRepository.GetUserByToken(token);
            if (user == null) {
                return Unauthorized();
            }
            var userId2 = user.Id;

            var chatRoom = await _context.ChatRooms
                .Include(cr => cr.Messages)
                .FirstOrDefaultAsync(cr => cr.Participants.Any(p => p.Id == userId1) && cr.Participants.Any(p => p.Id == userId2));

            if (chatRoom == null)
            {
                return NotFound("Chat room not found.");
            }

            var messages = chatRoom.Messages.OrderByDescending(m => m.SentAt).ToList();

            return Ok(messages);
        }
        [HttpGet("subscribe/{userId}")]
        public async Task Subscribe(Guid userId)
        {
            Response.Headers.Add("Content-Type", "text/event-stream");

            var cancellationToken = HttpContext.RequestAborted;

            var options = new JsonSerializerOptions
            {
                ReferenceHandler = ReferenceHandler.Preserve
            };

            var subscriber = new Action<ChatMessage>(async message =>
            {

             

                await HttpContext.Response.WriteAsync($"data: {System.Text.Json.JsonSerializer.Serialize(message.ToDTO(), options)}\n\n");
                await HttpContext.Response.Body.FlushAsync();
            });

            lock (_subscribers)
            {
                if (!_subscribers.ContainsKey(userId))
                {
                    _subscribers[userId] = new List<Action<ChatMessage>>();
                }
                _subscribers[userId].Add(subscriber);
            }

            try
            {
                while (!cancellationToken.IsCancellationRequested)
                {
                    await Task.Delay(1000, cancellationToken);
                }
            }
            catch (TaskCanceledException) { }
            finally
            {
                lock (_subscribers)
                {
                    _subscribers[userId].Remove(subscriber);
                }
            }
        }

        private void NotifySubscribers(Guid userId, ChatMessage message)
        {
            List<Action<ChatMessage>> subscribers;
            lock (_subscribers)
            {
                if (!_subscribers.TryGetValue(userId, out subscribers))
                {
                    return;
                }
                subscribers = new List<Action<ChatMessage>>(subscribers);
            }

            foreach (var subscriber in subscribers)
            {
                subscriber(message);
            }
        }
    }
}



