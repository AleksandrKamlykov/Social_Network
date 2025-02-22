using Microsoft.AspNetCore.Mvc;
using Social_network.Server.Models;
using Social_network.Server.Repository;
using Social_network.Server.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Social_network.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttachmentsController : ControllerBase
    {
        private readonly IAttachmentRepository _attachmentRepository;
        private readonly IUserRepository _userRepository;

        public AttachmentsController(IAttachmentRepository attachmentRepository, IUserRepository userRepository)
        {
            _attachmentRepository = attachmentRepository;
            _userRepository = userRepository;

        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Attachment>>> GetAll()
        {
            var attachments = await _attachmentRepository.GetAllAsync();
            return Ok(attachments);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Attachment>> GetById(Guid id)
        {
            var attachment = await _attachmentRepository.GetByIdAsync(id);
            if (attachment == null)
            {
                return NotFound();
            }
            return Ok(attachment);
        }

        [HttpPost]
        public async Task<ActionResult> Create(Attachment attachment)
        {
            var token = Request.Cookies["AuthToken"];
            var user = await _userRepository.GetUserByToken(token);

            if (user == null) {
                return Unauthorized();
            }

            await _attachmentRepository.AddAsync(attachment, user);
            return CreatedAtAction(nameof(GetById), new { id = attachment.Id }, attachment);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> Update(Guid id, Attachment attachment)
        {
            if (id != attachment.Id)
            {
                return BadRequest();
            }

            await _attachmentRepository.UpdateAsync(attachment);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(Guid id)
        {
            await _attachmentRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
