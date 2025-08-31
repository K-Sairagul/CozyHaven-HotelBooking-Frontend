using Cozy_Haven___HotelBooking.DTOs;
using Cozy_Haven___HotelBooking.Interfaces;
using Cozy_Haven___HotelBooking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Cozy_Haven___HotelBooking.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly ILogger<BookingController> _logger;

        public BookingController(IBookingService bookingService, ILogger<BookingController> logger)
        {
            _bookingService = bookingService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<List<Booking>>> GetAllBookings()
        {
            try
            {
                return Ok(await _bookingService.GetAllBookings());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all bookings");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBookingById(int id)
        {
            try
            {
                var booking = await _bookingService.GetBooking(id);
                if (booking == null) return NotFound();
                return Ok(booking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting booking with ID {id}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Booking>> AddBooking([FromBody] BookingDTO bookingDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var booking = await _bookingService.AddBooking(bookingDTO, int.Parse(userId));
                return CreatedAtAction(nameof(GetBookingById), new { id = booking.BookingId }, booking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding booking");
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("user")]
        public async Task<ActionResult<List<Booking>>> GetUserBookings()
        {
            try
            {
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                return Ok(await _bookingService.GetUserBookings(int.Parse(userId)));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting user bookings");
                return StatusCode(500, "Internal server error");
            }
        }




        [HttpPut("{id}/status")]
        public async Task<ActionResult<Booking>> UpdateBookingStatus(int id, [FromQuery] string status)
        {
            try
            {
                var booking = await _bookingService.UpdateBookingStatus(id, status);
                if (booking == null) return NotFound();
                return Ok(booking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating booking status for ID {id}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Booking>> DeleteBooking(int id)
        {
            try
            {
                var booking = await _bookingService.DeleteBooking(id);
                if (booking == null) return NotFound();
                return Ok(booking);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting booking with ID {id}");
                return StatusCode(500, "Internal server error");
            }
        }

        // In your controller
        [HttpPut("cancel/{bookingId}")]
        public async Task<IActionResult> CancelBooking(int bookingId)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var result = await _bookingService.CancelBooking(bookingId, userId);

            if (!result.Success)
                return BadRequest(result.Message);

            return Ok(result);
        }


        [HttpGet("details")]
        public async Task<ActionResult<List<BookingDetailsDTO>>> GetAllBookingDetails()
        {
            try
            {
                var bookings = await _bookingService.GetAllBookingDetails();
                return Ok(bookings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all booking details");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}