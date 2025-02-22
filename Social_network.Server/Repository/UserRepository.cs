using Social_network.Server.Interfaces;
using Social_network.Server.Models;
using Social_network.Server.Data;
using Social_network.Server.Auth;
using Microsoft.EntityFrameworkCore;
using Social_network.Server.DTOs;
using System.Collections.Generic; // Updated namespace for ApplicationDBContext


namespace Social_network.Server.Repository
{
    public class UserRepository : IUser
    {
        private readonly ApplicationDBContext _context;
        private readonly PasswordHasherService _passwordHasherService;
        private readonly TokenService _tokenService;


        public UserRepository(ApplicationDBContext context, PasswordHasherService passwordHasherService, TokenService tokenService)
        {
            _context = context;
            _passwordHasherService = passwordHasherService;
            _tokenService = tokenService;
        }

        public async Task<User> CreateUser(RegisterUserDTO model)
        {

            var role = _context.AllRoles.FirstOrDefault(r => r.Name == "user");
            var state = _context.UserStates.FirstOrDefault(s => s.State == State.Active);

            var user = new User();
            user.Name = model.Name;
            user.Email = model.Email;
            user.Nickname = model.Nickname;
            user.UserRoles = new List<UserRole>() { new UserRole() { UserId = user.Id, RoleId = role.Id } };
            user.State = state;




            user.Password = _passwordHasherService.HashPassword(user, model.Password);
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
            return await _context.Users.Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                .Include(u => u.State).Where(u => u.Name.Contains(name)).ToListAsync();
        }

        public async Task<User?> GetUserByEmail(string email)
        {
            return await _context.Users.Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                .Include(u => u.State).FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User?> GetUserById(Guid userId)
        {

            var user = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .Include(u => u.State)
                .FirstOrDefaultAsync(u => u.Id == userId);

            return user;        }

        public async Task<User> GetUserByUsername(string username)
        {
            return await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .Include(u => u.State)
                .FirstOrDefaultAsync(u => u.Nickname == username);
        }
        public async Task<IEnumerable<User>> GetUsers()
        {
            return await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .Include(u => u.State)
                .ToListAsync();
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
        public async Task<User?> GetUserByToken(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return null;
            }

            var user = _tokenService.GetUserFromToken(token);
            if (user == null)
            {
                return null;
            }

            var userDetails = await this.GetUserById(user.Id);
            if (userDetails == null)
            {
                return null;
            }

            return userDetails;
        }

        public async Task<IEnumerable<User>> FindUsersByNameOrNickname(string text)
        {
            var users = await _context.Users
                .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
                .Include(u => u.State)
                .Where(u => u.Name.Contains(text) || u.Nickname.Contains(text))
                .ToListAsync();
            return users;
        }

        public async Task<IEnumerable<User>> GetUsersByIds(IEnumerable<Guid> ids)
        {
            var users = await _context.Users.Include(u => u.UserRoles).ThenInclude(ur => ur.Role).Include(u => u.State).Where(u => ids.Contains(u.Id)).ToListAsync();
            return users;
        }
        public async Task<User> GetUserByNickname(string nickname)
        {
            return await _context.Users.Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                .Include(u => u.State).FirstOrDefaultAsync(u => u.Nickname == nickname);
        }
        public Task<bool> AddManyUsers(IEnumerable<RegisterUserDTO> usersDto)
        {
            var state = _context.UserStates.FirstOrDefault(s => s.State == State.Active);
            var role = _context.AllRoles.FirstOrDefault(r => r.Name == "user");



            var users = usersDto.Select((Func<RegisterUserDTO, User>)(u =>
            {
                var user = new User();
                user.Name = u.Name;
                user.Email = u.Email;
                user.Nickname = u.Nickname;
                user.UserRoles = new List<UserRole>() { new UserRole() { UserId = user.Id, RoleId = role.Id } };
                user.State = state;
                user.Password = _passwordHasherService.HashPassword(user, u.Password);
                user.CreatedAt = DateTime.Now;
                return user;
            }));
            _context.Users.AddRange(users);
            _context.SaveChanges();

            return Task.FromResult(true);
        }
    }
}