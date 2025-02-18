using Microsoft.EntityFrameworkCore;
using Social_network.Server.Data;
using Social_network.Server.Interfaces;
using Social_network.Server.Models;
using Social_network.Server.DTOs;

namespace Social_network.Server.Repository
{
    public class PostRepository : IPost
    {
        private readonly ApplicationDBContext _context;
        private readonly IUser _userRepository;
        public PostRepository(ApplicationDBContext context, IUser userRepository)
        {
            _context = context;
            _userRepository = userRepository;
        }

        public async Task<Post> GetPostById(Guid postId)
        {
            return await _context.Posts.Include(p => p.User).FirstOrDefaultAsync(p => p.Id == postId);
        }

        public async Task<IEnumerable<Post>> GetPostsByUser(Guid userId)
        {
            return await _context.Posts.Where(p => p.User.Id == userId).ToListAsync();
        }

        public async Task<Post> UpdatePost(Post post)
        {
            _context.Posts.Update(post);
            await _context.SaveChangesAsync();
            return post;
        }

        public async Task<Post> DeletePost(Guid postId)
        {
            var post = await _context.Posts.FindAsync(postId);
            if (post != null)
            {
                _context.Posts.Remove(post);
                await _context.SaveChangesAsync();
            }
            return post;
        }

        public async Task<Post> LikePost(Guid postId)
        {
            var post = await _context.Posts.FindAsync(postId);
            if (post != null)
            {
                post.Likes++;
                await _context.SaveChangesAsync();
            }
            return post;
        }

        public async Task<Post> DislikePost(Guid postId)
        {
            var post = await _context.Posts.FindAsync(postId);
            if (post != null)
            {
                post.Likes--;
                await _context.SaveChangesAsync();
            }
            return post;
        }
        public async Task<Post> CreatePost(Guid userId,CreatePostViewDTO postViewModel)
        {
            var post = new Post();
            post.Content = postViewModel.Content;
            post.Date = DateTime.Now;
            post.UserId = userId;


            await _context.Posts.AddAsync(post);
            await _context.SaveChangesAsync();
            return post;
        }
    }
}
