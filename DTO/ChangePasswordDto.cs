using System.ComponentModel.DataAnnotations;

namespace Cozy_Haven___HotelBooking.DTO
{
    public class ChangePasswordDto
    {
        [Required]
        public string CurrentPassword { get; set; }

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; }
    }
}
