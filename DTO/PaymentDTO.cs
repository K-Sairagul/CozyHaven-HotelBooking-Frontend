namespace Cozy_Haven___HotelBooking.DTOs
{
    public class PaymentDTO
    {
        public int BookingId { get; set; }
        public decimal Amount { get; set; }
        public string CardNumber { get; set; } // For UI only, won't be stored
        public string ExpiryDate { get; set; } // For UI only
        public string CVC { get; set; } // For UI only
    }

    public class PaymentResultDTO
    {
        public bool Success { get; set; }
        public string Message { get; set; }
        public int PaymentId { get; set; }
    }
}