using Cozy_Haven___HotelBooking.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace Cozy_Haven___HotelBooking.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly CozyHavenDbContext _context;

        public AdminController(CozyHavenDbContext context)
        {
            _context = context;
        }

        [HttpGet("hotelowners")]
        [Authorize(Roles = "Admin")]
        public IActionResult GetHotelOwners()
        {
            var hotelOwners = _context.Users
                .Where(u => u.Role == "HotelOwner")
                .Select(u => new {
                    u.UserId,
                    u.FullName,
                    u.Email
                })
                .ToList();

            return Ok(hotelOwners);
        }
    }
}
