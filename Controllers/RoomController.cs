using Cozy_Haven___HotelBooking.Models;
using CozyHavenStay.DTOs;
using CozyHavenStay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CozyHavenStay.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _roomService;
        private readonly ILogger<RoomController> _logger;

        public RoomController(IRoomService roomService, ILogger<RoomController> logger)
        {
            _roomService = roomService;
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

        /// <summary>
        /// Adds a new room
        /// </summary>
        /// <param name="roomDto">Room data</param>
        /// <returns>The created room</returns>
        [HttpPost]
        [Authorize(Policy = "AdminOrHotelOwner")]
        public async Task<ActionResult<Room>> AddRoom([FromBody] RoomDto roomDto)
        {
            try
            {
                _logger.LogInformation("Attempting to add new room");
                var userId = GetUserIdFromToken();
                var room = await _roomService.AddRoomAsync(roomDto, userId);
                _logger.LogInformation($"Room {room.RoomId} created successfully");
                return CreatedAtAction(nameof(GetRoomById), new { id = room.RoomId }, room);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, "Unauthorized attempt to add room");
                return Unauthorized(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "Hotel not found while adding room");
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid argument while adding room");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding room");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Updates an existing room
        /// </summary>
        /// <param name="id">Room ID</param>
        /// <param name="roomDto">Updated room data</param>
        /// <returns>The updated room</returns>
        [HttpPut("{id}")]
        [Authorize(Policy = "AdminOrHotelOwner")]
        public async Task<IActionResult> UpdateRoom(int id, [FromBody] RoomDto roomDto)
        {
            try
            {
                _logger.LogInformation($"Attempting to update room {id}");
                var userId = GetUserIdFromToken();
                var updatedRoom = await _roomService.UpdateRoomAsync(id, roomDto, userId);
                _logger.LogInformation($"Room {id} updated successfully");
                return Ok(updatedRoom);
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, $"Unauthorized attempt to update room {id}");
                return Unauthorized(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, $"Room {id} not found for update");
                return NotFound(new { message = ex.Message });
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid argument while updating room");
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating room {id}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Deletes a room
        /// </summary>
        /// <param name="id">Room ID</param>
        /// <returns>No content if successful</returns>
        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOrHotelOwner")]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            try
            {
                _logger.LogInformation($"Attempting to delete room {id}");
                var userId = GetUserIdFromToken();
                var result = await _roomService.DeleteRoomAsync(id, userId);
                if (result)
                {
                    _logger.LogInformation($"Room {id} deleted successfully");
                    return NoContent();
                }
                _logger.LogWarning($"Failed to delete room {id}");
                return BadRequest(new { message = "Failed to delete room" });
            }
            catch (UnauthorizedAccessException ex)
            {
                _logger.LogWarning(ex, $"Unauthorized attempt to delete room {id}");
                return Unauthorized(new { message = ex.Message });
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, $"Room {id} not found for deletion");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting room {id}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Gets all rooms for a specific hotel
        /// </summary>
        /// <param name="hotelId">Hotel ID</param>
        /// <returns>List of rooms</returns>
        [HttpGet("hotel/{hotelId}")]
        [AllowAnonymous]
        public async Task<ActionResult<List<Room>>> GetRoomsByHotel(int hotelId)
        {
            try
            {
                _logger.LogInformation($"Getting rooms for hotel {hotelId}");
                var rooms = await _roomService.GetRoomsByHotelAsync(hotelId);
                return Ok(rooms);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, $"Hotel {hotelId} not found");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting rooms for hotel {hotelId}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Gets a specific room by ID
        /// </summary>
        /// <param name="id">Room ID</param>
        /// <returns>The room details</returns>
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Room>> GetRoomById(int id)
        {
            try
            {
                _logger.LogInformation($"Getting room {id}");
                var room = await _roomService.GetRoomByIdAsync(id);
                return Ok(room);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, $"Room {id} not found");
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting room {id}");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        /// <summary>
        /// Gets all rooms
        /// </summary>
        /// <returns>List of all rooms</returns>
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<List<Room>>> GetAllRooms()
        {
            try
            {
                _logger.LogInformation("Getting all rooms");
                var rooms = await _roomService.GetAllRoomsAsync();
                return Ok(rooms);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all rooms");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }
    }
}