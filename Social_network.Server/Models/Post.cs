using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Social_network.Server.Models
{
    public class Post
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; }

        [ForeignKey("User")]
        public Guid UserId { get; set; }
        public User User { get; set; }
        [JsonIgnore]
        public IEnumerable<Comment>? Comments { get; set; }
        public uint Likes { get; set; } =0;
    }
}
