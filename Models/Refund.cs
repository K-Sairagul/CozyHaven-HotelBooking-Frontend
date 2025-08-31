namespace Cozy_Haven___HotelBooking.Models

{
    public class Refund
    {
        public int RefundId { get; set; }
        public int BookingId { get; set; }
        public decimal Amount { get; set; }
        public DateTime ProcessedDate { get; set; }

        public Booking Booking { get; set; }
    }

}
