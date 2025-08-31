namespace Cozy_Haven___HotelBooking.DTO
{
    public class UserReviewResponseDto
    {
        public int ReviewId { get; set; }
        public int HotelId { get; set; }
        public string HotelName { get; set; }
        public string HotelLocation { get; set; }
        public string HotelImageUrl { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime ReviewDate { get; set; }
    }
}
