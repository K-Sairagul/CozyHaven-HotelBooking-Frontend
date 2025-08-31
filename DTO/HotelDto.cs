using System.ComponentModel.DataAnnotations;

public class HotelDto
{
    [Required(ErrorMessage = "Hotel name is required")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "Name must be 3-100 characters")]
    public string Name { get; set; }

    [Required(ErrorMessage = "Address is required")]
    [StringLength(200, ErrorMessage = "Address too long (max 200 chars)")]
    public string Address { get; set; }

    [Required(ErrorMessage = "Location is required")]
    public string Location { get; set; }

    [StringLength(500, ErrorMessage = "Description too long (max 500 chars)")]
    public string Description { get; set; }

    [Required(ErrorMessage = "ImageUrl name is required")]
    public string ImageUrl { get; set; }

    public int? HotelOwnerId { get; set; }
}