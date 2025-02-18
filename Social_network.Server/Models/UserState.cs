using System.ComponentModel;
using System.Text.Json.Serialization;

namespace Social_network.Server.Models
{
    public enum State
    {
        [Description("active")]
        Active,
        [Description("inactive")]
        Inactive
    }
    public class UserState
    {
        public Guid Id { get; set; }
        public State State { get; set; }
 

    }
}
