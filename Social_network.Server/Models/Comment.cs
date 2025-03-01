using System.Text.Json.Serialization;

namespace Social_network.Server.Models
{
    public class Comment
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; }
        public Guid UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }
        public Guid PostId { get; set; }
        [JsonIgnore]
        public Post Post { get; set; }
        public Guid? ReplyToComment { get; set; }
    }
}
