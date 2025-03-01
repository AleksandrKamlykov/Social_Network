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
        public string UserName { get; set; }
        public string UserAvatar { get; set; }
        public string UserNickName { get; set; }
    }
    public class CreateCommentDTO
    {
        public string Content { get; set; }
        public Guid PostId { get; set; }
        public Guid? ReplyToComment { get; set; }
        public Guid UserId { get; set; }

    }
}
