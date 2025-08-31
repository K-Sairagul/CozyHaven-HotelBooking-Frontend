using Cozy_Haven___HotelBooking.Data;
using Cozy_Haven___HotelBooking.Models;
using CozyHavenStay.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CozyHavenStay.Services
{
    public class HotelService : IAuthHotelService
    {
        private readonly CozyHavenDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HotelService(CozyHavenDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        //Getting allHotels
        public async Task<List<Hotel>> GetAllHotelsAsync()
        {
            var httpContext = _httpContextAccessor.HttpContext;
            if (httpContext == null || !httpContext.User.Identity.IsAuthenticated)
            {
                // If unauthenticated (AllowAnonymous), return all hotels
                return await _context.Hotels.ToListAsync();
            }

            var userIdClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            var roleClaim = httpContext.User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);

            if (userIdClaim == null || roleClaim == null)
            {
                throw new UnauthorizedAccessException("Invalid user token");
            }

            var role = roleClaim.Value;
            var userId = int.Parse(userIdClaim.Value);

            if (role == "Admin" || role == "User")
            {
                return await _context.Hotels.ToListAsync();
            }
            else if (role == "HotelOwner")
            {
                return await _context.Hotels
                    .Where(h => h.HotelOwnerId == userId)
                    .ToListAsync();
            }
            else
            {
                return new List<Hotel>(); // Or throw Forbid
            }
        }


        public async Task<Hotel> AddHotelAsync(HotelDto hotelDto, int createdByUserId)
        {
            if (!await IsAdminOrHotelOwner(createdByUserId))
            {
                throw new UnauthorizedAccessException("Only Admin or HotelOwner can add hotels");
            }

            // Validate hotelOwnerId if provided
            if (hotelDto.HotelOwnerId.HasValue)
            {
                var hotelOwner = await _context.Users.FindAsync(hotelDto.HotelOwnerId.Value);
                if (hotelOwner == null || hotelOwner.Role != "HotelOwner")
                {
                    throw new ArgumentException("Invalid HotelOwnerId");
                }
            }

            var hotel = new Hotel
            {
                Name = hotelDto.Name,
                Address = hotelDto.Address,
                Location = hotelDto.Location,
                Description = hotelDto.Description,
                ImageUrl = hotelDto.ImageUrl,
                HotelOwnerId = hotelDto.HotelOwnerId // assign hotel owner here
            };

            _context.Hotels.Add(hotel);
            await _context.SaveChangesAsync();
            return hotel;
        }


        public async Task<Hotel> UpdateHotelAsync(int hotelId, HotelDto hotelDto, int userId)
        {
            if (!await IsAdminOrHotelOwner(userId))
            {
                throw new UnauthorizedAccessException("Only Admin or HotelOwner can update hotels");
            }

            var hotel = await _context.Hotels.FindAsync(hotelId);
            if (hotel == null)
            {
                throw new KeyNotFoundException("Hotel not found");
            }

            hotel.Name = hotelDto.Name;
            hotel.Address = hotelDto.Address;
            hotel.Location = hotelDto.Location;
            hotel.Description = hotelDto.Description;

            await _context.SaveChangesAsync();
            return hotel;
        }

        public async Task<bool> DeleteHotelAsync(int hotelId, int userId)
        {
            if (!await IsAdminOrHotelOwner(userId))
            {
                throw new UnauthorizedAccessException("Only Admin or HotelOwner can delete hotels");
            }

            var hotel = await _context.Hotels.FindAsync(hotelId);
            if (hotel == null)
            {
                throw new KeyNotFoundException("Hotel not found");
            }

            _context.Hotels.Remove(hotel);
            await _context.SaveChangesAsync();
            return true;
        }

       

        public async Task<Hotel> GetHotelByIdAsync(int hotelId)
        {
            var hotel = await _context.Hotels.FindAsync(hotelId);
            if (hotel == null)
            {
                throw new KeyNotFoundException("Hotel not found");
            }
            return hotel;
        }

        // In HotelService.cs
        public async Task<List<Hotel>> GetHotelsByLocationAsync(string location)
        {
            return await _context.Hotels
                .Where(h => h.Location.ToLower().Contains(location.ToLower()))
                .ToListAsync();
        }

       


        public async Task<bool> IsAdminOrHotelOwner(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user != null && (user.Role == "Admin" || user.Role == "HotelOwner");
        }
    }
}