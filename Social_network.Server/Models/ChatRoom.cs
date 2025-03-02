namespace Social_network.Server.Models
{
    public class ChatRoom
    {
        public Guid Id { get; set; }
        public ICollection<ChatMessage> Messages { get; set; }
        public ICollection<User> Participants { get; set; }
    }
}
