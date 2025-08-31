using Cozy_Haven___HotelBooking.Data;
using Cozy_Haven___HotelBooking.DTOs;
using Cozy_Haven___HotelBooking.Interfaces;
using Cozy_Haven___HotelBooking.Models;
using Microsoft.EntityFrameworkCore;

namespace Cozy_Haven___HotelBooking.Services
{
    public class BookingService : IBookingService
    {
        private readonly CozyHavenDbContext _context;
        private readonly ILogger<BookingService> _logger;
        private readonly IEmailService _emailService;

        public BookingService(CozyHavenDbContext context, ILogger<BookingService> logger, IEmailService emailService)
        {
            _context = context;
            _logger = logger;
            _emailService = emailService;
        }

        public async Task<decimal> CalculateTotalFare(int roomId, DateTime checkIn, DateTime checkOut, int guests)
        {
            var room = await _context.Rooms.FindAsync(roomId);
            if (room == null) throw new Exception("Room not found");

            var nights = (checkOut - checkIn).Days;
            return room.BaseFare * nights;
        }

        public async Task<Booking> AddBooking(BookingDTO bookingDTO, int userId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                if (!await IsRoomAvailable(bookingDTO.RoomId, bookingDTO.CheckInDate, bookingDTO.CheckOutDate))
                    throw new Exception("Room not available for selected dates");

                var totalAmount = await CalculateTotalFare(
                    bookingDTO.RoomId,
                    bookingDTO.CheckInDate,
                    bookingDTO.CheckOutDate,
                    bookingDTO.NumberOfGuests
                );

                var booking = new Booking
                {
                    UserId = userId,
                    HotelId = bookingDTO.HotelId,
                    RoomId = bookingDTO.RoomId,
                    CheckInDate = bookingDTO.CheckInDate,
                    CheckOutDate = bookingDTO.CheckOutDate,
                    NumberOfGuests = bookingDTO.NumberOfGuests,
                    TotalAmount = totalAmount,
                    BookingStatus = "Pending"
                };

                _context.Bookings.Add(booking);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return booking;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error adding booking");
                throw;
            }
        }

        public async Task<bool> IsRoomAvailable(int roomId, DateTime checkIn, DateTime checkOut)
        {
            return !await _context.Bookings
                .AnyAsync(b => b.RoomId == roomId &&
                              b.BookingStatus != "Cancelled" &&
                              b.CheckOutDate > checkIn &&
                              b.CheckInDate < checkOut);
        }

        public async Task<Booking> GetBooking(int id)
        {
            try
            {
                var booking = await _context.Bookings
                    .Include(b => b.User)
                    .Include(b => b.Hotel)
                    .Include(b => b.Room)
                    .Include(b => b.Payment)
                    .FirstOrDefaultAsync(b => b.BookingId == id);

                if (booking == null) throw new Exception("Booking not found");
                return booking;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting booking with id {id}");
                throw;
            }
        }

        public async Task<List<Booking>> GetAllBookings()
        {
            try
            {
                return await _context.Bookings
                    .Include(b => b.User)
                    .Include(b => b.Hotel)
                    .Include(b => b.Room)
                    .Include(b => b.Payment)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all bookings");
                throw;
            }
        }

        public async Task<Booking> UpdateBookingStatus(int id, string status)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var booking = await _context.Bookings.FindAsync(id);
                if (booking == null) throw new Exception("Booking not found");

                booking.BookingStatus = status;
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return booking;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, $"Error updating booking status for id {id}");
                throw;
            }
        }

        public async Task<Booking> DeleteBooking(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var booking = await _context.Bookings.FindAsync(id);
                if (booking == null) throw new Exception("Booking not found");

                _context.Bookings.Remove(booking);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return booking;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, $"Error deleting booking with id {id}");
                throw;
            }
        }

        public async Task<List<Booking>> GetUserBookings(int userId)
        {
            try
            {
                return await _context.Bookings
                    .Where(b => b.UserId == userId)
                    .Include(b => b.Hotel)
                    .Include(b => b.Room)
                        //.ThenInclude(r => r.RoomType) // Include RoomType if needed?
                    .Include(b => b.Payment)
                    .AsNoTracking() // For read-only operations
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting bookings for user {userId}");
                throw;
            }
        }


        public async Task<BookingCancellationResult> CancelBooking(int bookingId, int userId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var booking = await _context.Bookings
                    .Include(b => b.User)
                    .Include(b => b.Room)
                    .Include(b => b.Payment)
                    .FirstOrDefaultAsync(b => b.BookingId == bookingId);

                if (booking == null)
                    return new BookingCancellationResult(false, "Booking not found");

                if (booking.UserId != userId)
                    return new BookingCancellationResult(false, "You can only cancel your own bookings");

                if (booking.BookingStatus == "Cancelled")
                    return new BookingCancellationResult(false, "Booking is already cancelled");

                // Check cancellation policy (e.g., at least 24 hours before check-in)
                var cancellationDeadline = booking.CheckInDate.AddHours(-24);
                if (DateTime.Now > cancellationDeadline)
                    return new BookingCancellationResult(false, "Cancellation is not allowed within 24 hours of check-in");

                // Update booking status
                booking.BookingStatus = "Cancelled";

                // Process refund if payment was made
                if (booking.IsPaid && booking.Payment != null)
                {
                    booking.Payment.PaymentStatus = "Refunded";
                    //booking.Payment.RefundDate = DateTime.UtcNow;
                    _logger.LogInformation($"Refund processed for payment {booking.Payment.PaymentId}");
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Send cancellation confirmation email
                await SendCancellationConfirmation(booking);

                return new BookingCancellationResult(true, "Booking cancelled successfully. Refund processed if applicable.");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, $"Error cancelling booking {bookingId}");
                return new BookingCancellationResult(false, "Error cancelling booking");
            }
        }

        private async Task SendCancellationConfirmation(Booking booking)
        {
            try
            {
                var subject = $"Booking Cancellation Confirmation #{booking.BookingId}";

                var refundMessage = booking.IsPaid
                    ? $"<p>A refund of ${booking.TotalAmount} will be processed to your original payment method within 5-7 business days.</p>"
                    : "<p>No payment was made, so no refund is required.</p>";

                var htmlMessage = $@"
            <html>
            <body>
                <h2>Booking Cancellation Confirmation</h2>
                <p>Dear {booking.User.FullName},</p>
                <p>Your booking #{booking.BookingId} at {booking.Room.Hotel?.Name} has been successfully cancelled.</p>
                
                <h3>Booking Details:</h3>
                <ul>
                    <li>Booking ID: {booking.BookingId}</li>
                    
                    <li>Check-in: {booking.CheckInDate.ToShortDateString()}</li>
                    <li>Check-out: {booking.CheckOutDate.ToShortDateString()}</li>
                    <li>Cancellation Date: {DateTime.Now.ToShortDateString()}</li>
                </ul>
                
                <h3>Refund Information:</h3>
                {refundMessage}
                
                <p>We hope to serve you again in the future.</p>
                <p>Thank you for choosing Cozy Haven!</p>
            </body>
            </html>";

                await _emailService.SendEmailAsync(booking.User.Email, subject, htmlMessage);
                _logger.LogInformation($"Cancellation confirmation sent to {booking.User.Email}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send cancellation confirmation email");
            }
        }


        public async Task<List<BookingDetailsDTO>> GetAllBookingDetails()
        {
            var bookings = await _context.Bookings
                .Include(b => b.Hotel)
                .Include(b => b.Room)
                .Select(b => new BookingDetailsDTO
                {
                    BookingId = b.BookingId,
                    HotelName = b.Hotel.Name,
                    RoomId = b.Room.RoomId,
                    CheckInDate = b.CheckInDate,
                    CheckOutDate = b.CheckOutDate,
                    NumberOfGuests = b.NumberOfGuests,
                    Status = b.BookingStatus
                })
                .ToListAsync();

            return bookings;
        }
    }
}