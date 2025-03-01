using System;
using System.Collections.Generic;

namespace Social_network.Server.Models
{
    public class Avatar
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public Guid AttachmentId { get; set; }
        public Attachment Attachments { get; set; }
    }
}
