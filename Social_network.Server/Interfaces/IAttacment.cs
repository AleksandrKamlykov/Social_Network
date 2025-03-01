using Social_network.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Social_network.Server.Interfaces
{
    public interface IAttachmentRepository
    {
        Task<IEnumerable<Attachment>> GetAllAsync();
        Task<Attachment> GetByIdAsync(Guid id);
        Task<Attachment> AddAsync(Attachment attachment);
        Task UpdateAsync(Attachment attachment);
        Task DeleteAsync(Guid id);
        Task AddPictureAsync(Attachment picture, User user);
        Task<IEnumerable<Attachment>> GetPicturesByUser(Guid userId);
        Task<IEnumerable<Attachment>> GetAudiosByUser(Guid userId);
        Task AddAudioAsync(Attachment audio, User user);
        Task AddAvatarAsync(Attachment avatar, User user);
    }
}