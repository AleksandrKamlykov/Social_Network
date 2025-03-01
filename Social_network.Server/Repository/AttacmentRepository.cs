using Microsoft.EntityFrameworkCore;
using Social_network.Server.Data;
using Social_network.Server.Interfaces;
using Social_network.Server.Models;
using Social_network.Server.Repository;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Social_network.Server.Repository
{
    public class AttachmentRepository : IAttachmentRepository
    {
        private readonly ApplicationDBContext _context;

        public AttachmentRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Attachment>> GetAllAsync()
        {
            return await _context.Set<Attachment>().ToListAsync();
        }

        public async Task<Attachment> GetByIdAsync(Guid id)
        {
            return await _context.Set<Attachment>().FindAsync(id);
        }

        public async Task<Attachment> AddAsync(Attachment attachment)
        {
            attachment.CreatedAt = DateTime.UtcNow;
            _context.Attachments.Add(attachment);
            await _context.SaveChangesAsync();
            return attachment;
        }

        public async Task UpdateAsync(Attachment attachment)
        {
            _context.Attachments.Update(attachment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var attachment = await _context.Attachments.FindAsync(id);
            if (attachment != null)
            {
                _context.Attachments.Remove(attachment);
                await _context.SaveChangesAsync();
            }
        }

        public async Task AddPictureAsync(Attachment attachment, User user)
        {

            var res = this.AddAsync(attachment);

            Picture picture = new Picture
            {
                AttachmentId = res.Result.Id,
                UserId = user.Id
            };

            _context.Pictures.Add(picture);
            await _context.SaveChangesAsync();
        }
        public async Task<IEnumerable<Attachment>> GetPicturesByUser(Guid userId)
        {
            var res = await _context.Pictures.Include(p=> p.Attachment).Where(p => p.UserId == userId).Select(p => p.Attachment).ToListAsync();
            return res;
        }
        public async Task<IEnumerable<Attachment>> GetAudiosByUser(Guid userId)
        {
            var res = await _context.Audios.Include(p => p.Attachment).Where(p => p.UserId == userId).Select(p => p.Attachment).ToListAsync();
            return res;
        }

        public async Task AddAudioAsync(Attachment audio, User user)
        {
            var res = this.AddAsync(audio);

            Audio a = new Audio
            {
                AttachmentId = res.Result.Id,
                UserId = user.Id
            };

            _context.Audios.Add(a);
            await _context.SaveChangesAsync();
        }
        public async Task AddAvatarAsync(Attachment avatar, User user)
        {
            var res = this.AddAsync(avatar);

            Avatar picture = new Avatar
            {
                AttachmentId = res.Result.Id,
                UserId = user.Id
            };

            _context.Avatars.Add(picture);
            await _context.SaveChangesAsync();
        }
    }
}