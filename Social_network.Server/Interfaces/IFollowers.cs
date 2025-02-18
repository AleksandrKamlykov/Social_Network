using Social_network.Server.Models;

namespace Social_network.Server.Interfaces
{
    public interface IFollowers
    {
        public Task<Followers> Follow(Guid userId, Guid followedId);
        public Task<Followers> Unfollow(Guid userId, Guid followedId);
        public Task<IEnumerable<Followers>> GetFollowers(Guid userId);
    }
}
