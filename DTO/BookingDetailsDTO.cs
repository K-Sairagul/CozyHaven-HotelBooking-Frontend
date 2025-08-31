namespace Cozy_Haven___HotelBooking.DTOs
{
    public class BookingDetailsDTO
    {
        public int BookingId { get; set; }
        public string HotelName { get; set; }
        public int RoomId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfGuests { get; set; }
        public string Status { get; set; } // "Confirmed", "Pending", "Cancelled"
    }
}
