using System.ComponentModel;

namespace Social_network.Server.Models
{
    public enum MessageType
    {
        [Description("text")]
        Text,

        [Description("image")]
        Image
    }

    public class Message
    {
        public Guid Id { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; }
        public MessageType Type { get; set; } = MessageType.Text;

        public string? SenderId { get; set; }
        public User Sender { get; set; }
        //public string? ReceiverId { get; set; }
        //public User Receiver { get; set; }
        public Guid? ReplyToMessage { get; set; }
        public Guid ChatId { get; set; }
        public Chat Chat { get; set; }
    }
}
