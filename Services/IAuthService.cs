using CozyHavenStay.DTOs;
using Cozy_Haven___HotelBooking.Models;
using Cozy_Haven___HotelBooking.DTO;

namespace CozyHavenStay.Services
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterDto dto);
        Task<(string Token, string Role, string Fullname, int UserId )> LoginAsync(LoginDto dto);

        Task<bool>ForgotPasswordAsync(ForgotPasswordDto dto);
        Task<bool>ResetPasswordAsync(ResetPasswordDto dto);

        Task<List<User>> GetAllUsersAsync();
        Task<User> UpdateUserAsync(int userId, UpdateUserDto dto);

        Task<User> GetUserByIdAsync(int userId);

        Task<bool> ChangePasswordAsync(int userId, string currentPassword, string newPassword);
    }

}

