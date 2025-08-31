namespace Cozy_Haven___HotelBooking.Models

{
    public class StripeConfig
    {
        public string PublishableKey { get; set; }
        public string SecretKey { get; set; }
        public string WebhookSecret { get; set; }
        public string SuccessUrl { get; set; } = "https://yourdomain.com/payment/success";
        public string CancelUrl { get; set; } = "https://yourdomain.com/payment/failed";
    }
}
