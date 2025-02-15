using Social_network.Server.Models;

namespace Social_network.Server.Interfaces
{
    public interface IUser
    {
        public Task<User> GetUserById(Guid id);
        public Task<User> GetUserByEmail(string email);
        public Task<User> GetUserByUsername(string username);
        public Task<IEnumerable<User>> GetUsers();
        public Task<User> FindUsersByName(string name);
        public Task<User> CreateUser(User user);
        public Task<User> UpdateUser(User user);
        public Task<User> DeleteUser(Guid id);
    }
}
