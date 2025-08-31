using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cozy_Haven___HotelBooking.Models

{
    public class Hotel
    {
        public int HotelId { get; set; }

        [Required]
        public string Name { get; set; }

        public string Address { get; set; }

        public string Location { get; set; }

        public string Description { get; set; }
        
        public string ImageUrl { get; set; }

        public int? HotelOwnerId { get; set; }

        [ForeignKey("HotelOwnerId")]
        public User? HotelOwner { get; set; }


        public ICollection<Room> Rooms { get; set; }

        public virtual ICollection<Review> Reviews { get; set; }
    }
}
