using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Social_network.Server.Data;
using Social_network.Server.DTO;
using Social_network.Server.Extensions;
using Social_network.Server.Interfaces;
using Social_network.Server.Models;

namespace Social_network.Server.Repository
{
    public class CommentsRepository : IComment
    {
        private readonly ApplicationDBContext _context;

        public CommentsRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Comment> CreateComment(CommentDTO comment)
        {
            var newComment = new Comment
            {
                Content = comment.Content,
                Date = DateTime.Now,
                ReplyToComment = comment.ReplyToComment,
                PostId = comment.PostId,
                UserId = comment.UserId
            };
            var res = await _context.Comments.AddAsync(newComment);

            await _context.SaveChangesAsync();

            return newComment;
        }

        public async Task<IEnumerable<CommentDTO>> GetCommentsByPostId(Guid postId)
        {
            var comments = await _context.Comments.Where(c => c.PostId == postId).ToListAsync();
            List<CommentDTO> commentsDTO = new List<CommentDTO>();
            foreach (var comment in comments)
            {
                commentsDTO.Add(comment.ToDTO());
            }
            return commentsDTO;
        }
    }
}
