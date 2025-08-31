using Cozy_Haven___HotelBooking.DTO;
using Cozy_Haven___HotelBooking.DTOs;
using Cozy_Haven___HotelBooking.Models;

namespace Cozy_Haven___HotelBooking.Interfaces
{
    public interface IBookingService
    {
        Task<Booking> AddBooking(BookingDTO booking, int userId);
        Task<Booking> GetBooking(int id);
        Task<List<Booking>> GetAllBookings();
        Task<Booking> UpdateBookingStatus(int id, string status);
        Task<Booking> DeleteBooking(int id);
        Task<List<Booking>> GetUserBookings(int userId);
        Task<decimal> CalculateTotalFare(int roomId, DateTime checkIn, DateTime checkOut, int guests);
        Task<bool> IsRoomAvailable(int roomId, DateTime checkIn, DateTime checkOut);

        Task<BookingCancellationResult> CancelBooking(int bookingId, int userId);
        Task<List<BookingDetailsDTO>> GetAllBookingDetails();
    }
}