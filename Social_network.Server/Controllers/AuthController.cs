using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Social_network.Server.Auth;
using Social_network.Server.Interfaces;
using Social_network.Server.Models;

namespace Social_network.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly TokenService _tokenService;
        private readonly PasswordHasherService _passwordHasherService;
        private readonly IUser _userRepository;
        public AuthController(TokenService tokenService, PasswordHasherService passwordHasherService, IUser userRepository)
        {
            _tokenService = tokenService;
            _passwordHasherService = passwordHasherService;
            _userRepository = userRepository;
        }
        [HttpPost]
        public async Task<IActionResult> RegisterPost(User model)
        {

            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            model.Password = _passwordHasherService.HashPassword(model, model.Password);
            await _userRepository.CreateUser(model);

            return Ok(model);
        }
        [HttpPost]
        public async Task<IActionResult> Login(LoginModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            var user = await _userRepository.GetUserByUsername(model.Username);
            if (user == null || _passwordHasherService.VerifyPassword(user, user.Password, model.Password) != PasswordVerificationResult.Success)
            {
                ModelState.AddModelError(string.Empty, "Invalid login attempt.");
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

        [HttpPost]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }

        [HttpGet]
        public async Task<User> whoAmI()
        {
            var token = Request.Cookies["AuthToken"];
            if (string.IsNullOrEmpty(token))
            {
                return null;
            }
            var user = _tokenService.GetUserFromToken(token);
            if (user == null)
            {
                return null;
            }

            return await _userRepository.GetUserById(user.Id);
        }
    }
}
