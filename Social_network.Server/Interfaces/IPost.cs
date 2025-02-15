using Social_network.Server.Models;

namespace Social_network.Server.Interfaces
{
    public interface IPost
    {
        public Task<Post> GetPostById(Guid postId);
        public Task<IEnumerable<Post>> GetPostsByUser(Guid user);
        public Task<Post> UpdatePost(Post post);
        public Task<Post> DeletePost(Guid postId);
        public Task<Post> LikePost(Guid postId);
        public Task<Post> DislikePost(Guid postId);
    }
}
