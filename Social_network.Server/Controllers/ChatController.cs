using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Social_network.Server.Data;
using Social_network.Server.Models;
using Social_network.Server.Data;
using Microsoft.EntityFrameworkCore;
using Social_network.Server.Interfaces;

namespace Social_network.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly IUserRepository _userRepository; 

        public ChatController(ApplicationDBContext context, IUserRepository userRepository)
        {
            _context = context;
            _userRepository = userRepository;
        }

        [HttpGet("rooms/{roomId}/messages")]
        public async Task<ActionResult<IEnumerable<ChatMessage>>> GetChatMessages(Guid roomId)
        {
            var messages = await _context.ChatMessages
                .Where(m => m.ChatRoomId == roomId)
                .OrderByDescending(m => m.SentAt)
                .ToListAsync();

        
            return Ok(messages);
        }
        [HttpGet("rooms/{userId1}/{userId2}")]
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

    }
    
    }
