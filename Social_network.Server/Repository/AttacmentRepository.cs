using Microsoft.EntityFrameworkCore;
using Social_network.Server.Interfaces;
using Social_network.Server.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Social_network.Server.Repository
{
    public class AttachmentRepository : IAttachmentRepository
    {
        private readonly DbContext _context;
        private readonly IUserRepository _userRepository;


        public AttachmentRepository(DbContext context, IUserRepository userRepository)
        {
            _context = context;
            _userRepository = userRepository;
        }

        public async Task<IEnumerable<Attachment>> GetAllAsync()
        {
            return await _context.Set<Attachment>().ToListAsync();
        }

        public async Task<Attachment> GetByIdAsync(Guid id)
        {
            return await _context.Set<Attachment>().FindAsync(id);
        }

        public async Task AddAsync(Attachment attachment, User user)
        {
            user.Attachments.Add(attachment);

            //await _context.Set<Attachment>().AddAsync(attachment);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Attachment attachment)
        {
            _context.Set<Attachment>().Update(attachment);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var attachment = await _context.Set<Attachment>().FindAsync(id);
            if (attachment != null)
            {
                _context.Set<Attachment>().Remove(attachment);
                await _context.SaveChangesAsync();
            }
        }
    }
}