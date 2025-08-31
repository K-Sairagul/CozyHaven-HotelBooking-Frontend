namespace Cozy_Haven___HotelBooking.Models
{
    public class Payment
    {
        public int PaymentId { get; set; }
        public int BookingId { get; set; }
        public decimal AmountPaid { get; set; }
        public string Currency { get; set; } = "USD";
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public string PaymentStatus { get; set; } = "Pending";

        // Navigation property
        public Booking Booking { get; set; }
    }
}