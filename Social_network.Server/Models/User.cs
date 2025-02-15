using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore; // Add this using directive

namespace Social_network.Server.Models
{
    public enum Role
    {
        [Description("user")]
        User,
        [Description("admin")]
        Admin
    }
    public enum State
    {
        [Description("active")]
        Active,
        [Description("inactive")]
        Inactive
    }
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        public State State { get; set; } = State.Active;
        public string Name { get; set; }
        public string Nickname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public IEnumerable<Role> Roles { get; set; } 
        public Picture? Avatar { get; set; }
        public string? Bio { get; set; }
        public IEnumerable<Picture>? Pictures { get; set; }
        public IEnumerable<Post>? Posts { get; set; }
        public IEnumerable<Comment>? Comments { get; set; }
       // public IEnumerable<Message>? Messages { get; set; }
     //   public IEnumerable<Chat>? Chats { get; set; }

        public IEnumerable<User>? Friends { get; set; }
        public DateOnly BirthDate { get; set; }
        public DateTime? LastModified { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
