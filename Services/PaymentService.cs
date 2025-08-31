using Cozy_Haven___HotelBooking.Data;
using Cozy_Haven___HotelBooking.DTOs;
using Cozy_Haven___HotelBooking.Interfaces;
using Cozy_Haven___HotelBooking.Models;

using Microsoft.EntityFrameworkCore;

namespace Cozy_Haven___HotelBooking.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly CozyHavenDbContext _context;
        private readonly ILogger<PaymentService> _logger;
        private readonly IEmailService _emailService;

        public PaymentService(CozyHavenDbContext context,
                            ILogger<PaymentService> logger,
                            IEmailService emailService)
        {
            _context = context;
            _logger = logger;
            _emailService = emailService;
        }

        public async Task<PaymentResultDTO> ProcessPayment(PaymentDTO paymentDTO)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Validate booking
                var booking = await _context.Bookings
                    .Include(b => b.User)  // Include user for email
                    .Include(b => b.Room)   // Include room for booking details
                    .ThenInclude(r => r.Hotel)  // Include hotel for booking details
                    .FirstOrDefaultAsync(b => b.BookingId == paymentDTO.BookingId);

                if (booking == null)
                    throw new Exception("Booking not found");
                if (booking.IsPaid)
                    throw new Exception("Booking is already paid");
                if (Math.Abs(booking.TotalAmount - paymentDTO.Amount) > 0.01m)
                    throw new Exception("Payment amount doesn't match booking total");

                // Process payment
                var payment = new Payment
                {
                    BookingId = paymentDTO.BookingId,
                    AmountPaid = paymentDTO.Amount,
                    PaymentStatus = "Completed",
                    PaymentDate = DateTime.UtcNow
                };

                _context.Payments.Add(payment);
                booking.IsPaid = true;
                booking.BookingStatus = "Confirmed";

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Send payment confirmation email
                await SendPaymentConfirmationEmail(booking, payment);

                return new PaymentResultDTO
                {
                    Success = true,
                    Message = "Payment processed successfully",
                    PaymentId = payment.PaymentId
                };
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error processing payment");
                return new PaymentResultDTO
                {
                    Success = false,
                    Message = ex.Message
                };
            }
        }

        private async Task SendPaymentConfirmationEmail(Booking booking, Payment payment)
        {
            try
            {
                var subject = $"Payment Confirmation for Booking #{booking.BookingId}";

                var htmlMessage = $@"
                    <html>
                    <body>
                        <h2>Payment Confirmation</h2>
                        <p>Dear {booking.User.FullName},</p>
                        <p>Thank you for your payment. Your booking at {booking.Room.Hotel.Name} has been confirmed.</p>
                        
                        <h3>Booking Details:</h3>
                        <ul>
                            <li>Booking ID: {booking.BookingId}</li>
                            <li>Hotel: {booking.Room.Hotel.Name}</li>
                            <li>Room Type: {booking.Room.RoomId}</li>
                            <li>Check-in: {booking.CheckInDate.ToShortDateString()}</li>
                            <li>Check-out: {booking.CheckOutDate.ToShortDateString()}</li>
                          
                        </ul>
                        
                        <h3>Payment Details:</h3>
                        <ul>
                            <li>Payment ID: {payment.PaymentId}</li>
                            <li>Amount Paid: ${payment.AmountPaid}</li>
                            <li>Payment Date: {payment.PaymentDate.ToShortDateString()}</li>
                            <li>Payment Status: {payment.PaymentStatus}</li>
                        </ul>
                        
                        <p>If you have any questions, please contact our customer support.</p>
                        <p>Thank you for choosing Cozy Haven!</p>
                    </body>
                    </html>";

                await _emailService.SendEmailAsync(booking.User.Email, subject, htmlMessage);
                _logger.LogInformation($"Payment confirmation email sent to {booking.User.Email}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send payment confirmation email");
                // Don't throw exception here as payment was successful
            }
        }

        public async Task<Payment> GetPayment(int paymentId)
        {
            return await _context.Payments
                .Include(p => p.Booking)
                .FirstOrDefaultAsync(p => p.PaymentId == paymentId);
        }

        // Add this method to PaymentService.cs
        public async Task<List<PaymentHistoryDTO>> GetUserPaymentHistory(int userId)
        {
            return await _context.Payments
                .Where(p => p.Booking.UserId == userId)
                .Include(p => p.Booking)
                    .ThenInclude(b => b.Room)
                        .ThenInclude(r => r.Hotel)
                .Select(p => new PaymentHistoryDTO
                {
                    PaymentId = p.PaymentId,
                    PaymentDate = p.PaymentDate,
                    HotelName = p.Booking.Room.Hotel.Name,
                    RoomId = p.Booking.Room.RoomId,
                    //RoomType = p.Booking.Room.RoomType,
                    AmountPaid = p.AmountPaid,
                    PaymentStatus = p.PaymentStatus
                })
                .OrderByDescending(p => p.PaymentDate)
                .ToListAsync();
        }



        public async Task<RefundResultDTO> ProcessRefund(int paymentId)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var payment = await _context.Payments
                    .Include(p => p.Booking)
                    .ThenInclude(b => b.User)
                    .Include(p => p.Booking)
                    .ThenInclude(b => b.Room)
                    .FirstOrDefaultAsync(p => p.PaymentId == paymentId);

                if (payment == null)
                    return new RefundResultDTO(false, "Payment not found");

                if (payment.PaymentStatus != "Completed")
                    return new RefundResultDTO(false, "Only completed payments can be refunded");

                // Update payment status
                payment.PaymentStatus = "Refunded";
                //payment.RefundDate = DateTime.UtcNow;

                // Update booking status
                payment.Booking.BookingStatus = "Cancelled";
                payment.Booking.IsPaid = false;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                // Send refund confirmation email
                await SendRefundConfirmation(payment);

                return new RefundResultDTO(true, "Refund processed successfully");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, $"Error processing refund for payment {paymentId}");
                return new RefundResultDTO(false, "Error processing refund");
            }
        }

        private async Task SendRefundConfirmation(Payment payment)
        {
            try
            {
                var subject = $"Refund Confirmation for Booking #{payment.Booking.BookingId}";

                var htmlMessage = $@"
            <html>
            <body>
                <h2>Refund Confirmation</h2>
                <p>Dear {payment.Booking.User.FullName},</p>
                <p>Your refund for booking #{payment.Booking.BookingId} has been processed.</p>
                
                <h3>Booking Details:</h3>
                <ul>
                    <li>Booking ID: {payment.Booking.BookingId}</li>
                    <li>Hotel: {payment.Booking.Room.Hotel?.Name}</li>
                    
                    <li>Original Check-in: {payment.Booking.CheckInDate.ToShortDateString()}</li>
                </ul>
                
                <h3>Refund Details:</h3>
                <ul>
                    <li>Amount Refunded: ${payment.AmountPaid}</li>
                    <li>Refund Date: {DateTime.Now.ToShortDateString()}</li>
                    <li>Payment Method: Original payment method</li>
                </ul>
                
                <p>Please allow 5-7 business days for the refund to appear in your account.</p>
                <p>If you have any questions, please contact our customer support.</p>
                <p>Thank you for choosing Cozy Haven!</p>
            </body>
            </html>";

                await _emailService.SendEmailAsync(payment.Booking.User.Email, subject, htmlMessage);
                _logger.LogInformation($"Refund confirmation sent to {payment.Booking.User.Email}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send refund confirmation email");
            }
        }

        public async Task<List<PaymentHistoryDTO>> GetPaymentHistory()
        {
            try
            {
                var paymentHistory = await _context.Payments
                    .Include(p => p.Booking)
                        .ThenInclude(b => b.Room)
                            .ThenInclude(r => r.Hotel)
                    .Include(p => p.Booking)
                        .ThenInclude(b => b.User)
                    .OrderByDescending(p => p.PaymentDate)
                    .Select(p => new PaymentHistoryDTO
                    {
                        PaymentId = p.PaymentId,
                        PaymentDate = p.PaymentDate,
                        HotelName = p.Booking.Room.Hotel.Name,
                        RoomId = p.Booking.Room.RoomId,
                        RoomType = p.Booking.Room.RoomSize,
                        AmountPaid = p.AmountPaid,
                        PaymentStatus = p.PaymentStatus
                    })
                    .ToListAsync();

                return paymentHistory;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment history");
                throw;
            }
        }
    }
}