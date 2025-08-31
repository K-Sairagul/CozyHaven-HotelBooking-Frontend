using CozyHavenStay.DTOs;
using Cozy_Haven___HotelBooking.Models;

namespace CozyHavenStay.Services
{
    public interface IAuthHotelService
    {
        Task<Hotel> AddHotelAsync(HotelDto hotelDto, int userId);
        Task<bool> DeleteHotelAsync(int hotelId, int userId);
        Task<List<Hotel>> GetAllHotelsAsync();
        Task<Hotel> GetHotelByIdAsync(int hotelId);
        Task<Hotel> UpdateHotelAsync(int hotelId, HotelDto hotelDto, int userId);
        Task<bool> IsAdminOrHotelOwner(int userId);

        Task<List<Hotel>> GetHotelsByLocationAsync(string location);

    }
}
