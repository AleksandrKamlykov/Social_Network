namespace Social_network.Server.Models
{
    public class Picture
    {
        public Guid Id { get; set; }
        public string base64 { get; set; }
        public string? UserId { get; set; }
        public User User { get; set; }
    }
}
