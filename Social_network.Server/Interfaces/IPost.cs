using Social_network.Server.Models;
using Social_network.Server.DTOs;

namespace Social_network.Server.Interfaces
{
    public interface IPost
    {
        public Task<Post> CreatePost(Guid userId, CreatePostViewDTO post);
        public Task<Post> GetPostById(Guid postId);
        public Task<IEnumerable<Post>> GetPostsByUser(Guid user);
        public Task<Post> UpdatePost(Post post);
        public Task<Post> DeletePost(Guid postId);
        public Task<Post> LikePost(Guid postId);
        public Task<Post> DislikePost(Guid postId);
        public Task<IEnumerable<Post>> GetPostsByUserIds(IEnumerable<Guid> ids);
    }
}
