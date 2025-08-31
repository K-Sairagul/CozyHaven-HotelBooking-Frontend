using Microsoft.AspNetCore.Mvc;
using CozyHavenStay.DTOs;
using CozyHavenStay.Services;
using Cozy_Haven___HotelBooking.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace CozyHavenStay.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class HotelController : ControllerBase
    {
        private readonly IAuthHotelService _hotelService;
        private readonly ILogger<HotelController> _logger;

        public HotelController(IAuthHotelService hotelService, ILogger<HotelController> logger)
        {
            _hotelService = hotelService;
            _logger = logger;
        }

        private int GetUserIdFromToken()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
            {
                throw new UnauthorizedAccessException("Invalid user token");
            }
            return userId;
        }

        // POST: api/Hotel
        [HttpPost]
        public async Task<ActionResult<Hotel>> AddHotel([FromBody] HotelDto hotelDto)
        {
            try
            {
                var userId = GetUserIdFromToken();
                var hotel = await _hotelService.AddHotelAsync(hotelDto, userId);
                return CreatedAtAction(nameof(GetHotelById), new { id = hotel.HotelId }, hotel);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized attempt to add hotel");
                return Unauthorized(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding hotel");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // PUT: api/Hotel/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHotel(int id, [FromBody] HotelDto hotelDto)
        {
            try
            {
                var userId = GetUserIdFromToken();
                var updatedHotel = await _hotelService.UpdateHotelAsync(id, hotelDto, userId);
                return Ok(updatedHotel);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized attempt to update hotel");
                return Unauthorized(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Hotel not found");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating hotel");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // DELETE: api/Hotel/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHotel(int id)
        {
            try
            {
                var userId = GetUserIdFromToken();
                var result = await _hotelService.DeleteHotelAsync(id, userId);
                if (result)
                {
                    return NoContent();
                }
                return BadRequest(new { message = "Failed to delete hotel" });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized attempt to delete hotel");
                return Unauthorized(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Hotel not found");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting hotel");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // GET: api/Hotel
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<Hotel>>> GetAllHotels()
        {
            try
            {
                var hotels = await _hotelService.GetAllHotelsAsync();
                return Ok(hotels);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all hotels");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // GET: api/Hotel/5
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Hotel>> GetHotelById(int id)
        {
            try
            {
                var hotel = await _hotelService.GetHotelByIdAsync(id);
                return Ok(hotel);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Hotel not found");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting hotel by id");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // In HotelController.cs
        [HttpGet("location/{location}")]
        [AllowAnonymous]
        public async Task<ActionResult<List<Hotel>>> GetHotelsByLocation(string location)
        {
            try
            {
                var hotels = await _hotelService.GetHotelsByLocationAsync(location);
                return Ok(hotels);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting hotels by location");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        
    }
}