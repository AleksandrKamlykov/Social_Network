namespace Social_network.Server.Models
{
    public class ChatMessage
    {
        public Guid Id { get; set; }
        public Guid ChatRoomId { get; set; }
        public ChatRoom ChatRoom { get; set; }
        public Guid SenderId { get; set; }
        public User Sender { get; set; }
        public string Message { get; set; }
        public DateTime SentAt { get; set; }
    }
}
