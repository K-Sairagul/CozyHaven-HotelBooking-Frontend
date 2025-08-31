namespace Cozy_Haven___HotelBooking.DTOs
{
    public class RefundResultDTO
    {
        public bool Success { get; }
        public string Message { get; }

        public RefundResultDTO(bool success, string message)
        {
            Success = success;
            Message = message;
        }
    }
}
