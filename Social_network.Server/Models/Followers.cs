using System.Text.Json.Serialization;

namespace Social_network.Server.Models
{
    public class Followers
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }
        public Guid FollowedId { get; set; }
        [JsonIgnore]
        public User Followed { get; set; }
    }
}
