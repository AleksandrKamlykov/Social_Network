using Microsoft.EntityFrameworkCore;
using Social_network.Server.Data;
using Social_network.Server.Interfaces;
using Social_network.Server.Models;

namespace Social_network.Server.Repository
{
    public class FollowersRepository : IFollowers
    {
        private readonly ApplicationDBContext _context;

        public FollowersRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<Followers> Follow(Guid userId, Guid followedId)
        {


            var follower = new Followers
            {
                UserId = userId,
                FollowedId = followedId
            };

             await _context.Followers.AddAsync(follower);
            await _context.SaveChangesAsync();
            return follower;
        }

        public async Task<IEnumerable<Followers>> GetFollowers(Guid userId)
        {
           var followers = await _context.Followers.Where(f => f.UserId == userId).ToListAsync();

            return followers;
        }

        public async Task<Followers> Unfollow(Guid userId, Guid followedId)
        {
            var follower = await _context.Followers.FirstOrDefaultAsync(f => f.UserId == userId && f.FollowedId == followedId);
            if (follower != null)
            {
                _context.Followers.Remove(follower);
                _context.SaveChanges();
            }
            return await Task.FromResult(follower);

        }
    }
}
