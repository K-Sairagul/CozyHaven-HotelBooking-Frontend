import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hotelNames, setHotelNames] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First fetch all rooms
        const roomsResponse = await fetch(`https://localhost:7274/api/Room`);
        if (!roomsResponse.ok) {
          throw new Error('Failed to fetch rooms');
        }
        const roomsData = await roomsResponse.json();
        setRooms(roomsData);

        // Then fetch all hotels to get names
        const hotelsResponse = await fetch(`https://localhost:7274/api/Hotel`);
        if (!hotelsResponse.ok) {
          throw new Error('Failed to fetch hotels');
        }
        const hotelsData = await hotelsResponse.json();
        
        // Create a mapping of hotelId to hotelName
        const namesMap = {};
        hotelsData.forEach(hotel => {
          namesMap[hotel.hotelId] = hotel.name;
        });
        setHotelNames(namesMap);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (roomId) => {
  if (window.confirm('Are you sure you want to delete this room?')) {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`https://localhost:7274/api/Room/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 500) {
        alert("Room cannot be deleted because bookings already exist.");
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to delete room');
      }

      // Remove the deleted room from state
      setRooms(rooms.filter(room => room.roomId !== roomId));
      alert('Room deleted successfully');
    } catch (err) {
      setError(err.message);
    }
  }
};


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Rooms</h1>
        <Link
          to="/userdashboard/dashboard/addroom"
          className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition duration-200"
        >
          Add New Room
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div key={room.roomId} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="h-48 bg-gray-200 overflow-hidden">
              {room.imageUrl1 && (
                <img 
                  src={room.imageUrl1} 
                  alt={room.bedType} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-xl font-semibold text-gray-800">{room.bedType} Room</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  ${room.baseFare}/night
                </span>
              </div>
              
              <p className="text-gray-600 mb-2">
                <span className="font-medium">Hotel:</span> {hotelNames[room.hotelId] || 'Hotel not found'}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {room.maxPeople} {room.maxPeople === 1 ? 'person' : 'people'}
                </span>
                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {room.roomSize}
                </span>
                {room.isAC && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    AC Available
                  </span>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Link
                  to={`/rooms/${room.roomId}`}
                  className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition duration-200"
                >
                  View
                </Link>
                <button
                  onClick={() => navigate(`/room/update/${room.roomId}`)}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded transition duration-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(room.roomId)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {rooms.length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No rooms available</h3>
          <p className="mt-1 text-gray-500">There are currently no rooms to display.</p>
        </div>
      )}
    </div>
  );
};

export default RoomList;