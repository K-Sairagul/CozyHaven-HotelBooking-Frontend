// PaymentHistoryDTO.cs
namespace Cozy_Haven___HotelBooking.DTOs
{
    public class PaymentHistoryDTO
    {
        public int PaymentId { get; set; }
        public DateTime PaymentDate { get; set; }
        public string HotelName { get; set; }
        public int RoomId { get; set; }
        public string RoomType { get; set; }
        public decimal AmountPaid { get; set; }
        public string PaymentStatus { get; set; }
    }
}