using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Social_network.Server.Auth;
using Social_network.Server.Interfaces;
using Social_network.Server.Models;
using Social_network.Server.DTOs;

namespace Social_network.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly TokenService _tokenService;
        private readonly PasswordHasherService _passwordHasherService;
        private readonly IUser _userRepository;
        public UserController(TokenService tokenService, PasswordHasherService passwordHasherService, IUser userRepository)
        {
            _tokenService = tokenService;
            _passwordHasherService = passwordHasherService;
            _userRepository = userRepository;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterUserDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            await _userRepository.CreateUser(model);

            return Ok(model);
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var user = await _userRepository.GetUserByUsername(model.Username);
            if (user == null)
            {
                ModelState.AddModelError(string.Empty, "Invalid login attempt.");
                return BadRequest(ModelState);
            }

            var isPasswordValid = _passwordHasherService.VerifyPassword(user, user.Password, model.Password);
            if (isPasswordValid != PasswordVerificationResult.Success)
            {
                ModelState.AddModelError(string.Empty, "Invalid password attempt.");
                return BadRequest(ModelState);
            }

            var token = _tokenService.GenerateToken(user);

            Response.Cookies.Append("AuthToken", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(12)
            });

            return Ok();
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }

        [HttpGet("whoami")]
        public async Task<IActionResult> WhoAmI()
        {
            var token = Request.Cookies["AuthToken"];
            if (string.IsNullOrEmpty(token))
            {
                return NotFound("User not authenticated");
            }

            var user = _tokenService.GetUserFromToken(token);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var userDetails = await _userRepository.GetUserById(user.Id);
            if (userDetails == null)
            {
                return NotFound("User details not found");
            }

            return Ok(userDetails.ToDto());
        }
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers([FromQuery] string? value)
        {


            var token = Request.Cookies["AuthToken"];
            if (string.IsNullOrEmpty(token))
            {
                return NotFound("User not authenticated");
            }
            var user = _tokenService.GetUserFromToken(token);
            if (user == null)
            {
                return NotFound("User not found");
            }
            



            if (string.IsNullOrEmpty(value))
            {
                var allUsers = await _userRepository.GetUsers();
                var usersDto = allUsers.Select(u => u.ToDto()).Where(u => u.Id != user.Id);

                return Ok(usersDto);
            }

            var filteredUsers = await _userRepository.FindUsersByNameOrNickname(value);
            var filteredUsersDto = filteredUsers.Select(u => u.ToDto()).Where(u => u.Id != user.Id);
            return Ok(filteredUsersDto);
        }

        [HttpPost("load-many-users")]
        public async Task<IActionResult> LoadManyUsers([FromBody] IEnumerable<RegisterUserDTO> userDTOs)
        {

            var result = await _userRepository.AddManyUsers(userDTOs);
            return Ok(result);
        }

    }
}