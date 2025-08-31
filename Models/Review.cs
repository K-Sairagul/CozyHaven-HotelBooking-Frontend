// Models/Review.cs
namespace Cozy_Haven___HotelBooking.Models

{
    public class Review
    {
        public int ReviewId { get; set; }
        public int UserId { get; set; }
        public int HotelId { get; set; }
        public int Rating { get; set; } // 1 to 5
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        public virtual User User { get; set; }
        public virtual Hotel Hotel { get; set; }
    }
}