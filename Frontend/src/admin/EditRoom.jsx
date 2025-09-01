import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    roomSize: '',
    bedType: '',
    maxPeople: 1,
    baseFare: 0,
    isAC: false,
    hotelId: '',
    imageUrl1: '',
    imageUrl2: '',
    imageUrl3: '',
    imageUrl4: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch room data
        const roomResponse = await fetch(`https://localhost:7274/api/Room/${id}`);
        if (!roomResponse.ok) {
          throw new Error('Failed to fetch room data');
        }
        const roomData = await roomResponse.json();

        // Fetch hotels for the dropdown
        const hotelsResponse = await fetch(`https://localhost:7274/api/Hotel`);
        if (!hotelsResponse.ok) {
          throw new Error('Failed to fetch hotels');
        }
        const hotelsData = await hotelsResponse.json();
        setHotels(hotelsData);

        // Set form data with room data
        setFormData({
          roomSize: roomData.roomSize,
          bedType: roomData.bedType,
          maxPeople: roomData.maxPeople,
          baseFare: roomData.baseFare,
          isAC: roomData.isAC,
          hotelId: roomData.hotelId,
          imageUrl1: roomData.imageUrl1,
          imageUrl2: roomData.imageUrl2,
          imageUrl3: roomData.imageUrl3,
          imageUrl4: roomData.imageUrl4
        });

      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://localhost:7274/api/Room/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update room');
      }

      toast.success('Room updated successfully!');
       setTimeout(() => {
      navigate("/userdashboard/dashboard/allhotels", { replace: true });
    }, 5000);

    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Room</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hotel Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hotelId">
                Hotel
              </label>
              <select
                id="hotelId"
                name="hotelId"
                value={formData.hotelId}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select a hotel</option>
                {hotels.map(hotel => (
                  <option key={hotel.hotelId} value={hotel.hotelId}>
                    {hotel.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Room Size */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roomSize">
                Room Size
              </label>
              <input
                type="text"
                id="roomSize"
                name="roomSize"
                value={formData.roomSize}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            {/* Bed Type */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bedType">
                Bed Type
              </label>
              <input
                type="text"
                id="bedType"
                name="bedType"
                value={formData.bedType}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            {/* Max People */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxPeople">
                Maximum Occupancy
              </label>
              <input
                type="number"
                id="maxPeople"
                name="maxPeople"
                min="1"
                max="10"
                value={formData.maxPeople}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            {/* Base Fare */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="baseFare">
                Base Fare ($)
              </label>
              <input
                type="number"
                id="baseFare"
                name="baseFare"
                min="0.01"
                step="0.01"
                value={formData.baseFare}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>

            {/* AC Availability */}
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                id="isAC"
                name="isAC"
                checked={formData.isAC}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isAC" className="ml-2 block text-sm text-gray-700">
                Air Conditioning Available
              </label>
            </div>

            {/* Image URLs */}
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-lg font-semibold mb-2">Room Images</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={`imageUrl${num}`}>
                      Image URL {num}
                    </label>
                    <input
                      type="url"
                      id={`imageUrl${num}`}
                      name={`imageUrl${num}`}
                      value={formData[`imageUrl${num}`]}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                    {formData[`imageUrl${num}`] && (
                      <div className="mt-2">
                        <img 
                          src={formData[`imageUrl${num}`]} 
                          alt={`Preview ${num}`} 
                          className="h-24 w-full object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate('/rooms')}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoom;