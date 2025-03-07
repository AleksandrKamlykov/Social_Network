using Social_network.Server.DTO;
using Social_network.Server.Models;

namespace Social_network.Server.Extensions
{
    public static class ChatMessageExtension
    {

            public static ChatMessageDTO ToDTO(this ChatMessage comment)
            {
                return new ChatMessageDTO
                {
                    Id = comment.Id,
                    ChatRoomId = comment.ChatRoomId,
                    SenderId = comment.SenderId,
                    Message = comment.Message,
                    SentAt = comment.SentAt,
                    SenderName = comment.Sender.Name
                };
            }
        
    }
}
