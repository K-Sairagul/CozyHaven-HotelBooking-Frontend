using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cozy_Haven___HotelBooking.Models

{
    public class User
    {
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string Gender { get; set; }
        public string ContactNumber { get; set; }


        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } // "User", "HotelOwner", "Admin"

        public string? Token { get; set; }

        [NotMapped]
        public string? NewPassword { get; set; }

        public ICollection<Booking> Bookings { get; set; }

        public virtual ICollection<Review> Reviews { get; set; }
    }

}
