using System.ComponentModel.DataAnnotations;

namespace CozyHavenStay.DTOs;


    public class RoomDto
    {
        [Required(ErrorMessage = "Room size is required")]
        public string RoomSize { get; set; }

        [Required(ErrorMessage = "Bed type is required")]
        public string BedType { get; set; }

        [Required(ErrorMessage = "Maximum occupancy is required")]
        [Range(1, 10, ErrorMessage = "Maximum people must be between 1 and 10")]
        public int MaxPeople { get; set; }

        [Required(ErrorMessage = "Base fare is required")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Base fare must be greater than 0")]
        public decimal BaseFare { get; set; }

        [Required(ErrorMessage = "AC status is required")]
        public bool IsAC { get; set; }

        [Required(ErrorMessage = "Hotel ID is required")]
        public int HotelId { get; set; }

        [Required(ErrorMessage = "Image1 is required")]
        public string ImageUrl1 { get; set; }

        [Required(ErrorMessage = "Image2 is required")]
        public string ImageUrl2 { get; set; }

    [Required(ErrorMessage = "Image3 is required")]

    public string ImageUrl3 { get; set; }

    [Required(ErrorMessage = "Image4 is required")]

    public string ImageUrl4 { get; set; }


    
}
