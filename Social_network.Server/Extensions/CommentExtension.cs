using Social_network.Server.DTO;
using Social_network.Server.Models;

namespace Social_network.Server.Extensions
{
    public static class CommentExtension
    {

        public static CommentDTO ToDTO(this Comment comment)
        {
            return new CommentDTO
            {
                Content = comment.Content,
                Date = comment.Date,
                ReplyToComment = comment.ReplyToComment
            };
        }
    }
}
