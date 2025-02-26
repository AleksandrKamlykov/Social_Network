using System;
using System.Collections.Generic;

namespace Social_network.Server.Models
{
    public class Audio
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public List<Attachment> Attachments { get; set; } = new List<Attachment>();
    }
}
