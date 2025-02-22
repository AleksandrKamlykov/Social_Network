using System;
using System.ComponentModel;

namespace Social_network.Server.Models
{
    public enum AttachmentType
    {
        [Description("audio")]
        Audio,
        [Description("video")]
        Video,
        [Description("image")]
        Image
    }

    public class Attachment
    {
        public Guid Id { get; set; }
        public AttachmentType Type { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public string Extension { get; set; }
        public string Base64Data { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}