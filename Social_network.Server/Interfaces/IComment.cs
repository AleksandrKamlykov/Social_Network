using Social_network.Server.DTO;
using Social_network.Server.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.EntityFrameworkCore;
using Social_network.Server.Data;

namespace Social_network.Server.Interfaces
{
    public interface IComment
    {
        public Task<Comment> CreateComment(CreateCommentDTO comment);
        public Task<IEnumerable<CommentDTO>> GetCommentsByPostId(Guid postId);
    }
}
