using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Cozy_Haven___HotelBooking.Models

{
    public class Room
    {
        public int RoomId { get; set; }

        [Required]
        public string RoomSize { get; set; }

        public string BedType { get; set; }

        public int MaxPeople { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal BaseFare { get; set; }

        public bool IsAC { get; set; }

        public string ImageUrl1 { get; set; }
        public string ImageUrl2 { get; set; }
        public string ImageUrl3 { get; set; }
        public string ImageUrl4 { get; set; }

        public int HotelId { get; set; }

        public Hotel Hotel { get; set; }
    }
}
