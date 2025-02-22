using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Social_network.Server.Models;
namespace Social_network.Server.Models
{
    public class UserRole
    {
        public Guid UserId { get; set; }
        public User User { get; set; }

        public Guid RoleId { get; set; }
        public Role Role { get; set; }
    }
}
