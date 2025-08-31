using System;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Cozy_Haven___HotelBooking.Data;
using Cozy_Haven___HotelBooking.Models;
using Cozy_Haven___HotelBooking.Services;
using CozyHavenStay.Services;
using Moq;


using CozyHavenStay.DTOs;

using Microsoft.AspNetCore.Identity;
using Cozy_Haven___HotelBooking.DTO;



namespace CozyHavenStay.Services
{
    public class AuthService : IAuthService
    {
        private readonly CozyHavenDbContext _context;
        private readonly IConfiguration _config;
        private readonly ILogger<AuthService> _logger;
        private readonly IEmailService _emailService;


        public AuthService(CozyHavenDbContext context, IConfiguration config, ILogger<AuthService> logger, IEmailService emailService)
        {
            _context = context;
            _config = config;
            _logger = logger;
            _emailService = emailService;
        }

        public async Task<string> RegisterAsync(RegisterDto dto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                _logger.LogWarning($"Registration attempt with existing email: {dto.Email}");
                return "Email already registered.";
            }

            var role=dto.Role.ToLower();


            // Role-based email validation
            if (role=="admin" || role=="hotelowner")
            {
                if (!dto.Email.EndsWith("cozyHaven.com", StringComparison.OrdinalIgnoreCase))
                {
                    return "Admin email must end with cozyHaven.com";
                }
            }
            else if (role == "user")
            {
                if (dto.Email.EndsWith("cozyHaven.com", StringComparison.OrdinalIgnoreCase))
                {
                    return "User email cannot end with cozyHaven.com";
                }
            }

            var user = new User
            {
                FullName = dto.FullName,
                Gender = dto.Gender,
                ContactNumber = dto.ContactNumber,
                Email = dto.Email,
                PasswordHash = ComputeHash(dto.Password),
                Role = dto.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"New user registered: {user.Email}");
            return "User registered successfully!";
        }

        public async Task<(string Token, string Role, string Fullname, int UserId)> LoginAsync(LoginDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (user == null || user.PasswordHash != ComputeHash(dto.Password))
            {
                _logger.LogWarning($"Failed login attempt for email: {dto.Email}");
                return (null, null,null,0); // Return null for both if login fails
            }

            var token = GenerateJwtToken(user);
            return (token, user.Role, user.FullName, user.UserId); 
        }


        public async Task<bool> ForgotPasswordAsync(ForgotPasswordDto dto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
            {
                _logger.LogWarning($"Password reset attempt for non-existing email: {dto.Email}");
                return false; // User not found
            }

            var token = Guid.NewGuid().ToString();
            user.Token = token;
            await _context.SaveChangesAsync();
            _logger.LogInformation($"Token stored for user {user.Email}: {user.Token}");

            var resetLink = $"http://localhost:5173/reset-password?email={user.Email}&token={token}";

            string emailBody = $@"
        <div style='font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; color: #333;'>
            <h2 style='color: #2c3e50;'>Hi {user.FullName ?? "User"},</h2>
            <p>We received a request to reset your password for your <strong>Cozy Haven Stay</strong> account.</p>
            <p>If you made this request, please click the button below to reset your password:</p>

            <div style='text-align: center; margin: 30px 0;'>
                <a href='{resetLink}' style='background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;'>Reset Password</a>
            </div>

            <p>If you didn’t request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>

            <p style='margin-top: 40px;'>Best regards,<br><strong>The Cozy Haven Stay Team</strong></p>
            <hr style='margin-top: 30px;' />
            <small style='color: #999;'>This link will expire in 30 minutes or after it's used once.</small>
        </div>
    ";

            await _emailService.SendEmailAsync(
                user.Email,
                "Reset Your Password - Cozy Haven Stay",
                emailBody
            );

            _logger.LogInformation($"Password reset email sent to: {user.Email}");
            return true;
        }



        public async Task<bool> ResetPasswordAsync(ResetPasswordDto dto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Token == dto.Token);

            if (user == null)
            {
                _logger.LogWarning("Ivalid Link or Expired Url");
                return false; // User not found
            }

            user.PasswordHash = ComputeHash(dto.NewPassword);
            user.Token = null;
            await _context.SaveChangesAsync();

            _logger.LogWarning("Password reset successfully");
            return true; // User not found
        }


        private string GenerateJwtToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["Jwt:Key"]));

            var credentials = new SigningCredentials(
                securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(Convert.ToDouble(_config["Jwt:ExpiryInMinutes"])),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string ComputeHash(string input)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
            return Convert.ToBase64String(bytes);
        }

        // Add these methods to AuthService.cs
        public async Task<List<User>> GetAllUsersAsync()
        {
            return await _context.Users
                .OrderBy(u => u.UserId)
                .ToListAsync();
        }

        public async Task<User> UpdateUserAsync(int userId, UpdateUserDto dto)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                _logger.LogWarning($"User with ID {userId} not found for update");
                throw new KeyNotFoundException("User not found");
            }

            // Check if email is being changed
            if (!string.IsNullOrEmpty(dto.Email))
            {
                // Prevent users from changing to admin/hotelowner email domain
                if (user.Role.ToLower() == "user" &&
                    dto.Email.EndsWith("cozyHaven.com", StringComparison.OrdinalIgnoreCase))
                {
                    throw new InvalidOperationException("User email cannot end with cozyHaven.com");
                }

                // Check if new email already exists
                if (await _context.Users.AnyAsync(u => u.Email == dto.Email && u.UserId != userId))
                {
                    throw new InvalidOperationException("Email already in use by another account");
                }

                user.Email = dto.Email;
            }

            // Update other fields
            if (!string.IsNullOrEmpty(dto.FullName)) user.FullName = dto.FullName;
            if (!string.IsNullOrEmpty(dto.ContactNumber)) user.ContactNumber = dto.ContactNumber;
            if (!string.IsNullOrEmpty(dto.Gender)) user.Gender = dto.Gender;

            // Only update password if provided
            if (!string.IsNullOrEmpty(dto.NewPassword))
            {
                user.PasswordHash = ComputeHash(dto.NewPassword);
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"User {userId} updated successfully");
            return user;
        }

        // Add to AuthService.cs
        public async Task<User> GetUserByIdAsync(int userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
            {
                _logger.LogWarning($"User with ID {userId} not found");
                throw new KeyNotFoundException("User not found");
            }

            return user;
        }


        public async Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                _logger.LogWarning($"User with ID {userId} not found for password change");
                throw new KeyNotFoundException("User not found");
            }

            // Verify current password
            if (user.PasswordHash != ComputeHash(currentPassword))
            {
                _logger.LogWarning($"Incorrect current password provided for user {userId}");
                return false;
            }

            // Update to new password
            user.PasswordHash = ComputeHash(newPassword);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Password changed successfully for user {userId}");
            return true;
        }
    }
}