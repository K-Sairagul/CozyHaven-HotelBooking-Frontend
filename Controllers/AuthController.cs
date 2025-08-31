using Cozy_Haven___HotelBooking.Controllers;
using Cozy_Haven___HotelBooking.DTO;
using Cozy_Haven___HotelBooking.Models;
using CozyHavenStay.DTOs;
using CozyHavenStay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;


namespace CozyHavenStay.Controllers
{
    [ApiController]
    [Route("api/v1/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;


        public AuthController(IAuthService authService,ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto);
            if (result.Contains("already"))
                return BadRequest(result);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var (token, role, fullName,userId) = await _authService.LoginAsync(dto);
            if (token == null)
                return Unauthorized("Invalid credentials.");

            return Ok(new { Token = token, Role = role, fullName,UserId=userId });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
        {
            var success = await _authService.ForgotPasswordAsync(dto);
            return success ? Ok("Password reset link sent.") : BadRequest("Failed to send password reset link.");
        }


        [HttpPost("reset-password")]

        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
        {
            var success = await _authService.ResetPasswordAsync(dto);
            return success ? Ok("Password reset successfully.") : BadRequest("Failed to reset password.");
        }

        // Add these to AuthController.cs

        [Authorize(Roles = "Admin")] // Only admins can get all users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _authService.GetAllUsersAsync();
            return Ok(users);
        }

        [Authorize] // Any authenticated user can update their own profile
        [HttpPut("users/{userId}")]
        public async Task<IActionResult> UpdateUser(int userId, [FromBody] UpdateUserDto dto)
        {
            // Verify the user is updating their own profile or is admin
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var currentUserRole = User.FindFirstValue(ClaimTypes.Role);

            if (currentUserId != userId && currentUserRole != "Admin")
            {
                return Forbid(); // Prevent users from updating other profiles
            }

            try
            {
                var updatedUser = await _authService.UpdateUserAsync(userId, dto);
                return Ok(updatedUser);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating user {userId}");
                return StatusCode(500, "An error occurred while updating the user");
            }
        }


        // Add to AuthController.cs
        [Authorize] // Requires authentication
        [HttpGet("users/{userId}")]
        public async Task<IActionResult> GetUser(int userId)
        {
            // Verify the user is requesting their own info or is admin
            var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var currentUserRole = User.FindFirstValue(ClaimTypes.Role);

            if (currentUserId != userId && currentUserRole != "Admin")
            {
                return Forbid(); // Prevent users from accessing other users' info
            }

            try
            {
                var user = await _authService.GetUserByIdAsync(userId);

                // Create a response DTO to avoid sending sensitive data
                var response = new UserInfoDto
                {
                    UserId = user.UserId,
                    FullName = user.FullName,
                    Email = user.Email,
                    Gender = user.Gender,
                    ContactNumber = user.ContactNumber,
                    
                };

                return Ok(response);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting user {userId}");
                return StatusCode(500, "An error occurred while getting user information");
            }
        }



        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            try
            {
                var success = await _authService.ChangePasswordAsync(userId, dto.CurrentPassword, dto.NewPassword);
                return success ? Ok("Password changed successfully") : BadRequest("Current password is incorrect");
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error changing password for user {userId}");
                return StatusCode(500, "An error occurred while changing password");
            }
        }
    }
}
