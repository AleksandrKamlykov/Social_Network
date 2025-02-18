using Social_network.Server.Models;
using Social_network.Server.DTOs;

namespace Social_network.Server.Interfaces
{
    public interface IUser
    {
        public Task<User> GetUserById(Guid id);
        public Task<User> GetUserByEmail(string email);
        public Task<User> GetUserByUsername(string username);
        public Task<User?> GetUserByToken(string token);
        public Task<IEnumerable<User>> GetUsers();
        public Task<User> FindUsersByName(string name);
        public Task<IEnumerable<User>> FindUsersByNameOrNickname(string text);
        public Task<User> CreateUser(RegisterUserDTO user);
        public Task<User> UpdateUser(User user);
        public Task<User> DeleteUser(Guid id);
        public Task<IEnumerable<User>> GetUsersByIds(IEnumerable<Guid> ids);
        public Task<bool> AddManyUsers(IEnumerable<RegisterUserDTO> users);
    }
}
    