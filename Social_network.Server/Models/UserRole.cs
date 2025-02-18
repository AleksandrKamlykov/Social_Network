using System.ComponentModel;
using System.Text.Json.Serialization;

namespace Social_network.Server.Models
{
    public enum Role
    {
        [Description("user")]
        User,
        [Description("admin")]
        Admin
    }
    public class UserRole
    {
        public Guid Id { get; set; }
        public Role Role { get; set; }
    }
}
