using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Social_network.Server.Models
{
    public class Audio
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }
        public Guid AttachmentId { get; set; }
        public Attachment Attachment { get; set; }
    }
}
