namespace Cozy_Haven___HotelBooking.DTOs
{
    public class BookingCancellationResult
    {
        public bool Success { get; }
        public string Message { get; }

        public BookingCancellationResult(bool success, string message)
        {
            Success = success;
            Message = message;
        }
    }
}
