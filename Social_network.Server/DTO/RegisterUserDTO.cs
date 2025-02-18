namespace Social_network.Server.DTOs
{
    public class RegisterUserDTO
    {
        public string Name { get; set; }
        public string Nickname { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public DateOnly BirthDate { get; set; }
    }
}
