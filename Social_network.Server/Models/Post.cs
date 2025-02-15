namespace Social_network.Server.Models
{
    public class Post
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; }
        public string? UserId { get; set; }
        public User User { get; set; }
        public IEnumerable<Comment>? Comments { get; set; }
        public uint Likes { get; set; } =0;
    }
}
