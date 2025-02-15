using Social_network.Server.Models;

namespace Social_network.Server.Interfaces
{
    public interface IChat
    {
        public Task<Message> GetMessageById(Guid id);
        public Task<IEnumerable<Message>> GetMessagesByChat(Guid chat);
        public Task<IEnumerable<Message>> GetMessagesByUsers(IEnumerable<Guid> users);
        public Task<Message> CreateMessage(Message message);
        public Task<Message> DeleteMessage(Guid id);
        public Task<IEnumerable<Guid>> HasChatsWithUsers(Guid user);
        public Task<IEnumerable<Guid>> GetChatsByUser(Guid user);
        public Task<Chat> GetChatById(Guid id);
        public Task<Chat> CreateChat(Chat chat);

        public Task<Chat> DeleteChat(Guid id);

    }
}
