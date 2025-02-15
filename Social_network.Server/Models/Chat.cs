namespace Social_network.Server.Models
{
    public class Chat
    {
        public Guid Id { get; set; }
        public IEnumerable<User> Users { get; set; }
        public IEnumerable<Message> Messages { get; set; }
    }
}
