using System.ComponentModel.DataAnnotations.Schema;

namespace Cozy_Haven___HotelBooking.Models

{
    public class Booking
    {
        public int BookingId { get; set; }
        public int UserId { get; set; }
        public int HotelId { get; set; }
        public int RoomId { get; set; }
        public int? PaymentId { get; set; }

        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int NumberOfGuests { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalAmount { get; set; }

        public bool IsPaid { get; set; } = false;
        public string BookingStatus { get; set; } = "Pending";

        // Navigation properties
        public User User { get; set; }
        public Hotel Hotel { get; set; }
        public Room Room { get; set; }
        public Payment Payment { get; set; }
    }
}