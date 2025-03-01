using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Social_network.Server.DTO;
using Social_network.Server.Interfaces;

namespace Social_network.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {

        private readonly IComment _comment;
        private readonly IUserRepository _userRepository;


        public CommentsController(IComment comment, IUserRepository userRepo)
        {
            _comment = comment;
            _userRepository = userRepo;
        }


        [HttpGet("{postId}")]
        public async Task<IActionResult> GetCommentsByPostId(Guid postId)
        {
            var comments = await _comment.GetCommentsByPostId(postId);
            return Ok(comments);
        }
        [HttpPost("add")]
        public async Task<IActionResult> CreateComment(CreateCommentDTO comment)
        {
            var token = Request.Cookies["AuthToken"];
            if (string.IsNullOrEmpty(token))
            {
                return NotFound("User not authenticated");
            }

            var user = await _userRepository.GetUserByToken(token);

            if (user == null)
            {
                return BadRequest();
            }
            comment.UserId = user.Id;


            var newComment = await _comment.CreateComment(comment);
            return Ok(newComment);
        }
    }
}
