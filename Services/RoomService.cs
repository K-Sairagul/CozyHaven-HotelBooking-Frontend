using CozyHavenStay.DTOs;
using Cozy_Haven___HotelBooking.Models;
using Cozy_Haven___HotelBooking.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CozyHavenStay.Services
{
    public class RoomService : IRoomService
    {
        private readonly CozyHavenDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public RoomService(CozyHavenDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<Room> AddRoomAsync(RoomDto roomDto, int userId)
        {
            if (!await IsAdminOrHotelOwner(userId))
                throw new UnauthorizedAccessException("Only Admin or HotelOwner can add rooms");

            var hotel = await _context.Hotels.FindAsync(roomDto.HotelId);
            if (hotel == null)
                throw new KeyNotFoundException("Hotel not found");

            // Validate max people (minimum 1, maximum 10)
            if (roomDto.MaxPeople < 1 || roomDto.MaxPeople > 10)
                throw new ArgumentException("Maximum people must be between 1 and 10");

            var room = new Room
            {
                RoomSize = roomDto.RoomSize,
                BedType = roomDto.BedType,
                MaxPeople = roomDto.MaxPeople,
                BaseFare = roomDto.BaseFare,
                IsAC = roomDto.IsAC,
                HotelId = roomDto.HotelId,
                ImageUrl1 = roomDto.ImageUrl1,
                ImageUrl2 = roomDto.ImageUrl2,
                ImageUrl3 = roomDto.ImageUrl3,
                ImageUrl4 = roomDto.ImageUrl4
            };

            _context.Rooms.Add(room);
            await _context.SaveChangesAsync();
            return room;
        }

        public async Task<Room> UpdateRoomAsync(int roomId, RoomDto roomDto, int userId)
        {
            if (!await IsAdminOrHotelOwner(userId))
                throw new UnauthorizedAccessException("Only Admin or HotelOwner can update rooms");

            var room = await _context.Rooms.FindAsync(roomId);
            if (room == null)
                throw new KeyNotFoundException("Room not found");

            // Validate max people (minimum 1, maximum 10)
            if (roomDto.MaxPeople < 1 || roomDto.MaxPeople > 10)
                throw new ArgumentException("Maximum people must be between 1 and 10");

            room.RoomSize = roomDto.RoomSize;
            room.BedType = roomDto.BedType;
            room.MaxPeople = roomDto.MaxPeople;
            room.BaseFare = roomDto.BaseFare;
            room.IsAC = roomDto.IsAC;
            room.HotelId = roomDto.HotelId;
            room.ImageUrl1 = roomDto.ImageUrl1 ?? room.ImageUrl1;
            room.ImageUrl2 = roomDto.ImageUrl2 ?? room.ImageUrl2;
            room.ImageUrl3 = roomDto.ImageUrl3 ?? room.ImageUrl3;
            room.ImageUrl4 = roomDto.ImageUrl4 ?? room.ImageUrl4;

            await _context.SaveChangesAsync();
            return room;
        }

        public async Task<bool> DeleteRoomAsync(int roomId, int userId)
        {
            if (!await IsAdminOrHotelOwner(userId))
                throw new UnauthorizedAccessException("Only Admin or HotelOwner can delete rooms");

            var room = await _context.Rooms.FindAsync(roomId);
            if (room == null)
                throw new KeyNotFoundException("Room not found");

            _context.Rooms.Remove(room);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<List<Room>> GetAllRoomsAsync()
        {
            return await _context.Rooms
                .Include(r => r.Hotel)
                .ToListAsync();
        }

        public async Task<Room> GetRoomByIdAsync(int roomId)
        {
            var room = await _context.Rooms
                .Include(r => r.Hotel)
                .FirstOrDefaultAsync(r => r.RoomId == roomId);

            if (room == null)
                throw new KeyNotFoundException("Room not found");
            return room;
        }

        public async Task<List<Room>> GetRoomsByHotelAsync(int hotelId)
        {
            return await _context.Rooms
                .Where(r => r.HotelId == hotelId)
                .Include(r => r.Hotel)
                .ToListAsync();
        }

        public async Task<List<Hotel>> GetAllHotelsAsync()
        {
            return await _context.Hotels.ToListAsync();
        }

        public async Task<bool> IsAdminOrHotelOwner(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            return user != null && (user.Role == "Admin" || user.Role == "HotelOwner");
        }
    }
}