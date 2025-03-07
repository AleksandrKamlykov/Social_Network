using Social_network.Server.Models;

namespace Social_network.Server.DTO
{
    public class ChatMessageDTO
    {
        public Guid Id { get; set; }
        public Guid ChatRoomId { get; set; }
        public Guid SenderId { get; set; }
        public string SenderName { get; set; }
        public string Message { get; set; }
        public DateTime SentAt { get; set; }

    }
}
