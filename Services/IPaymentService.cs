using Cozy_Haven___HotelBooking.DTOs;
using Cozy_Haven___HotelBooking.Models;

namespace Cozy_Haven___HotelBooking.Interfaces
{
    public interface IPaymentService
    {
        Task<PaymentResultDTO> ProcessPayment(PaymentDTO paymentDTO);
        Task<Payment> GetPayment(int paymentId);
        Task<List<PaymentHistoryDTO>> GetUserPaymentHistory(int userId);

        Task<List<PaymentHistoryDTO>> GetPaymentHistory();
    }
}