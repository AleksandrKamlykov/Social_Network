using Social_network.Server.Models;
using System.Text.Json.Serialization;

namespace Social_network.Server.DTO
{
    public class CommentDTO
    {
        public string Content { get; set; }
        public DateTime Date { get; set; }
        public Guid? ReplyToComment { get; set; }
        public Guid PostId { get; set; }
        public Guid UserId { get; set; }
    }
}
