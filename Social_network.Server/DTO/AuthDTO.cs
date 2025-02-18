using Social_network.Server.Models;

namespace Social_network.Server.DTOs
{
    public class AuthDTO
    {
        public User User { get; set; }
        public LoginModel LoginModel { get; set; }
    }
}
