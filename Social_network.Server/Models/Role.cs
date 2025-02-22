using System.ComponentModel;
using System.Text.Json.Serialization;

namespace Social_network.Server.Models
{
    public enum UserRoleEnum
    {
        [Description("user")]
        User,
        [Description("admin")]
        Admin
    }
    public class Role
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

    }
}
