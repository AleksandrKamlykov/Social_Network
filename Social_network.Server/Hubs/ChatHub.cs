using Microsoft.AspNetCore.SignalR;
using Social_network.Server.Models;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Social_network.Server.Data;
using Microsoft.AspNetCore.Http.HttpResults;

namespace Social_network.Server.Hubs
{
    public class ChatHub : Hub
    {
        private readonly ApplicationDBContext _context;

        public ChatHub(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task SendMessage(Guid chatRoomId, Guid senderId, string message)
        {
            var chatRoom = await _context.ChatRooms.FindAsync(chatRoomId);
            if (chatRoom == null)
            {
                throw new Exception("Chat room not found.");
            }

            var chatMessage = new ChatMessage
            {
                Id = Guid.NewGuid(),
                ChatRoomId = chatRoomId,
                SenderId = senderId,
                Message = message,
                SentAt = DateTime.UtcNow
            };

            _context.ChatMessages.Add(chatMessage);
            await _context.SaveChangesAsync();

            var sender = await _context.Users.FindAsync(senderId);

            var msg = new
            {
                chatMessage.Id,
                chatMessage.ChatRoomId,
                chatMessage.SenderId,
                chatMessage.Message,
                chatMessage.SentAt,
                Sender = new
                {
                    sender.Id,
                    sender.Name,
                    sender.Nickname,
                    sender.Avatar
                }
            };

            await Clients.Group(chatRoomId.ToString()).SendAsync("ReceiveMessage", msg);
        }
        public async Task JoinRoom(Guid cahtRoomId)
        {
            var chatRoom = await _context.ChatRooms
                .Include(cr => cr.Participants)
                .FirstOrDefaultAsync(cr => cr.Id == cahtRoomId);

            if (chatRoom != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, chatRoom.Id.ToString());
            }

        }
        public async Task LeaveRoom(Guid chatRoomId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, chatRoomId.ToString());
        }
    }
}
