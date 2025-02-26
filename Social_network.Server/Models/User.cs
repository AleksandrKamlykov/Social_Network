using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore; // Add this using directive

namespace Social_network.Server.Models
{

  
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        public Guid StateId { get; set; }
        public UserState State { get; set; }
        public string Name { get; set; }
        public string Nickname { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>(); // Changed
        public Avatar? Avatar { get; set; }
        public string? Bio { get; set; }
        public IEnumerable<Post>? Posts { get; set; }
        public IEnumerable<Comment>? Comments { get; set; }

        public DateOnly BirthDate { get; set; }
        public DateTime? LastModified { get; set; }
        public DateTime CreatedAt { get; set; }
        [JsonIgnore]
        public IEnumerable<User> Followers { get; set; }
        public IEnumerable<Picture> Pictures { get; set; }
        public IEnumerable<Audio> Audios { get; set; }
    }
}
