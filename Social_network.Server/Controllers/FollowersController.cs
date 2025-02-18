using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Social_network.Server.Interfaces;

namespace Social_network.Server.Controllers
{
    public record followDto
    {
        public Guid follow { get; init; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class FollowersController : ControllerBase
    {

        private readonly IFollowers _follower;
        private readonly IUser _userRepository;

        public FollowersController(IFollowers follower, IUser userRepository)
        {
            _follower = follower;
            _userRepository = userRepository;
        }

        [HttpGet("{follow}")]
        public async Task<IActionResult> GetFollowers(Guid follow)
        {
            var followers = await _follower.GetFollowers(follow);
            return Ok(followers.Select(f => f.FollowedId));

        }
        [HttpGet("following/{userId}")]
        public async Task<IActionResult> GetFollowing(Guid userId)
        {
            var following = await _follower.GetFollowers(userId);

            var users = await _userRepository.GetUsersByIds(following.Select(f => f.FollowedId));

            return Ok(users.Select(u => u.ToDto()));
        }
        [HttpPost("follow")]
        public async Task<IActionResult> Follow([FromBody] followDto follow)
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
            var newFollower = await _follower.Follow(user.Id, follow.follow);
            return Ok(newFollower);
        }
        [HttpPost("unfollow")]
        public async Task<IActionResult> Unfollow([FromBody] followDto follow)
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
            var unfollowed = await _follower.Unfollow(user.Id, follow.follow);
            return Ok(unfollowed);
        }

    }
}
