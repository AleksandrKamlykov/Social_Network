using Social_network.Server.Interfaces;
using Social_network.Server.Models;
using Social_network.Server.Data;
using Social_network.Server.Auth;
using Microsoft.EntityFrameworkCore; // Updated namespace for ApplicationDBContext


namespace Social_network.Server.Repository
{
    public class UserRepository : IUser
    {
        private readonly ApplicationDBContext _context;
        private readonly PasswordHasherService _passwordHasherService;

        public UserRepository(ApplicationDBContext context, PasswordHasherService passwordHasherService)
        {
            _context = context;
            _passwordHasherService = passwordHasherService;
        }

        public async Task<User> CreateUser(User user)
        {

            user.Password = _passwordHasherService.HashPassword(user, user.Password);
            user.CreatedAt = DateTime.Now;



            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> DeleteUser(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return null;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<IEnumerable<User>> FindUsersByName(string name)
        {
            return await _context.Users.Where(u => u.Name.Contains(name)).ToListAsync();
        }

        public async Task<User> GetUserByEmail(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> GetUserById(Guid id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<User> GetUserByUsername(string username)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Name == username);
        }

        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> UpdateUser(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user;
        }

        Task<User> IUser.FindUsersByName(string name)
        {
            throw new NotImplementedException();
        }
    }
}