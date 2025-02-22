using Social_network.Server.Models;

namespace Social_network.Server.Interfaces
{
    public interface IAttachmentRepository
    {
        Task<IEnumerable<Attachment>> GetAllAsync();
        Task<Attachment> GetByIdAsync(Guid id);
        Task AddAsync(Attachment attachment, User user);
        Task UpdateAsync(Attachment attachment);
        Task DeleteAsync(Guid id);
    }
}
