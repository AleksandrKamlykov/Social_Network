using Microsoft.AspNetCore.Identity;
using Social_network.Server.Models;

namespace Social_network.Server.Auth
{

    public class PasswordHasherService
    {
        private readonly PasswordHasher<User> _passwordHasher;

        public PasswordHasherService()
        {
            _passwordHasher = new PasswordHasher<User>();
        }

        public string HashPassword(User user, string password)
        {
            return _passwordHasher.HashPassword(user, password);
        }

        public PasswordVerificationResult VerifyPassword(User user, string hashedPassword, string providedPassword)
        {
            return _passwordHasher.VerifyHashedPassword(user, hashedPassword, providedPassword);
        }
    }
}
