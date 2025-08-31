using CozyHavenStay.DTOs;
using Cozy_Haven___HotelBooking.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CozyHavenStay.Services
{
    public interface IRoomService
    {
        Task<Room> AddRoomAsync(RoomDto roomDto, int userId);

        Task<Room> UpdateRoomAsync(int roomId, RoomDto roomDto, int userId);
        Task<bool> DeleteRoomAsync(int roomId, int userId);
        Task<List<Room>> GetAllRoomsAsync();
        Task<Room> GetRoomByIdAsync(int roomId);
        Task<List<Room>> GetRoomsByHotelAsync(int hotelId);
        Task<bool> IsAdminOrHotelOwner(int userId);

    }
}