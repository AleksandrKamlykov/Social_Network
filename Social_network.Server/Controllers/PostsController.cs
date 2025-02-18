using Microsoft.AspNetCore.Mvc;
using Social_network.Server.Auth;
using Social_network.Server.Interfaces;
using Social_network.Server.Models;
using Social_network.Server.DTOs;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Social_network.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IPost _postRepository;
        private readonly IUser _userRepository;

        public PostsController(IPost postRepository, IUser userRepository )
        {
            _postRepository = postRepository;
            _userRepository = userRepository;
        }

        // POST: api/Create
        [HttpPost("create")]
        public async Task<ActionResult<PostDto>> Create([FromBody] CreatePostViewDTO post)
        {
 
            var token = Request.Cookies["AuthToken"];
            if (string.IsNullOrEmpty(token))
            {
                return NotFound("User not authenticated");
            }

            var userDetails = await _userRepository.GetUserByToken(token);

            var createdPost = await _postRepository.CreatePost(userDetails.Id,post);

            return Ok(createdPost.ToDto());
        }
        // GET: api/Posts
        [HttpGet("{userId}")]
        public async Task<ActionResult<IEnumerable<PostDto>>> Get(Guid userId)
        {
            var posts = await _postRepository.GetPostsByUser(userId);
            var postDtos = posts.Select(p => p.ToDto());
            Console.WriteLine(postDtos);
            return Ok(postDtos); // Example user ID
        }

        // POST api/Posts
        [HttpPost]
        public async Task<ActionResult<PostDto>> Post([FromBody] Post post)
        {
            var createdPost = await _postRepository.UpdatePost(post);
            return CreatedAtAction(nameof(Get), new { id = createdPost.Id }, createdPost);
        }

        // PUT api/Posts/5
        [HttpPut("{id}")]
        public async Task<ActionResult<Post>> Put(Guid id, [FromBody] Post post)
        {
            if (id != post.Id)
            {
                return BadRequest();
            }

            var updatedPost = await _postRepository.UpdatePost(post);
            return Ok(updatedPost.ToDto());
        }

        // DELETE api/Posts/5
        [HttpDelete("{id}")]
        public async Task<ActionResult<PostDto>> Delete(Guid id)
        {
            var deletedPost = await _postRepository.DeletePost(id);
            return Ok(deletedPost.ToDto());
        }

        // POST api/Posts/5/like
        [HttpPost("{id}/like")]
        public async Task<ActionResult<PostDto>> Like(Guid id)
        {
            var likedPost = await _postRepository.LikePost(id);
            return Ok(likedPost.ToDto());
        }

        // POST api/Posts/5/dislike
        [HttpPost("{id}/dislike")]
        public async Task<ActionResult<PostDto>> Dislike(Guid id)
        {
            var dislikedPost = await _postRepository.DislikePost(id);
            return Ok(dislikedPost.ToDto());
        }
    }
}
