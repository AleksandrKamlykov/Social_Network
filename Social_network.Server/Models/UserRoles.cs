using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Social_network.Server.Models;
namespace Social_network.Server.Models
{
    public class UserRoles
    {
        public Guid Id { get; set; }
        [ForeignKey("UserId")]
        public Guid UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }
        [ForeignKey("RoleId")]
        public Guid RoleId { get; set; }
        public Role Role { get; set; }
    }
}
