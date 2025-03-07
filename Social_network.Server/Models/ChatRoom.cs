using System.Text.Json.Serialization;

namespace Social_network.Server.Models
{
    public class ChatRoom
    {
        public Guid Id { get; set; }
        [JsonIgnore]
        public ICollection<ChatMessage> Messages { get; set; }
        [JsonIgnore]
        public ICollection<User> Participants { get; set; }
    }
}
