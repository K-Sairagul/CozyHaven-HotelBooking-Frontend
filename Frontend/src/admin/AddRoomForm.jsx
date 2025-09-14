import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const RoomForm = ({ userId, onRoomAdded }) => {
  const { auth } = useAuth();
  const token = auth?.token;

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [selectedHotel, setSelectedHotel] = useState('');

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/Hotel');
        setHotels(response.data || []);
        setError(null);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setError('Failed to load hotels. Please try again later.');
        toast.error('Failed to load hotels');
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);

      const response = await axios.post(
        'https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/Room',
        { ...data, userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      toast.success('Room added successfully!', {
        position: "top-center",
        autoClose: 3000,
        pauseOnHover: true,
      });

      // Delay callback and reset so success message is visible
      setTimeout(() => {
        if (onRoomAdded && typeof onRoomAdded === 'function') {
          onRoomAdded(response.data);
        }

        reset();
        setSelectedHotel('');
      }, 1500); // ✅ Delay reset + callback to show toast

    } catch (error) {
      console.error('Error adding room:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add room';
      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add New Room</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Add New Room</h2>
        <div className="text-red-500 p-4 bg-red-50 rounded-md">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="mt-2 block text-blue-500 hover:text-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Room</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Hotel Select */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="hotelId">Select Hotel</label>
          <select
            id="hotelId"
            {...register('hotelId', { required: 'Hotel is required' })}
            className="w-full px-3 py-2 border rounded-md"
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            disabled={submitting}
          >
            <option value="">Select a hotel</option>
            {Array.isArray(hotels) && hotels.map((hotel) => (
              <option key={hotel.hotelId} value={hotel.hotelId}>{hotel.name}</option>
            ))}
          </select>
          {errors.hotelId && <p className="text-red-500 text-sm mt-1">{errors.hotelId.message}</p>}
        </div>

        {/* Room Size */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="roomSize">Room Size</label>
          <select
            id="roomSize"
            {...register('roomSize', { required: 'Room size is required' })}
            className="w-full px-3 py-2 border rounded-md"
            disabled={submitting}
          >
            <option value="">Select room size</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Suite">Suite</option>
            <option value="Executive">Executive</option>
            <option value="Presidential">Presidential</option>
          </select>
          {errors.roomSize && <p className="text-red-500 text-sm mt-1">{errors.roomSize.message}</p>}
        </div>

        {/* Bed Type */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="bedType">Bed Type</label>
          <select
            id="bedType"
            {...register('bedType', { required: 'Bed type is required' })}
            className="w-full px-3 py-2 border rounded-md"
            disabled={submitting}
          >
            <option value="">Select bed type</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Queen">Queen</option>
            <option value="King">King</option>
            <option value="Twin">Twin</option>
          </select>
          {errors.bedType && <p className="text-red-500 text-sm mt-1">{errors.bedType.message}</p>}
        </div>

        {/* Max People */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="maxPeople">Maximum People</label>
          <input
            id="maxPeople"
            type="number"
            min="1"
            max="10"
            {...register('maxPeople', {
              required: 'Maximum people is required',
              min: { value: 1, message: 'Minimum 1 person' },
              max: { value: 10, message: 'Maximum 10 people' }
            })}
            className="w-full px-3 py-2 border rounded-md"
            disabled={submitting}
          />
          {errors.maxPeople && <p className="text-red-500 text-sm mt-1">{errors.maxPeople.message}</p>}
        </div>

        {/* Base Fare */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="baseFare">Base Fare ($)</label>
          <div className="relative">
            <span className="absolute left-3 top-2">$</span>
            <input
              id="baseFare"
              type="number"
              step="0.01"
              min="0"
              {...register('baseFare', {
                required: 'Base fare is required',
                min: { value: 0, message: 'Must be positive' }
              })}
              className="w-full pl-8 px-3 py-2 border rounded-md"
              disabled={submitting}
            />
          </div>
          {errors.baseFare && <p className="text-red-500 text-sm mt-1">{errors.baseFare.message}</p>}
        </div>

        {/* AC Checkbox */}
        <div className="mb-4 flex items-center">
          <input
            id="isAC"
            type="checkbox"
            {...register('isAC')}
            className="mr-2 h-5 w-5"
            disabled={submitting}
          />
          <label htmlFor="isAC" className="text-gray-700">Air Conditioning</label>
        </div>

        {/* Image URLs */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Room Images (URLs)</label>
          {[1, 2, 3, 4].map((index) => (
            <input
              key={index}
              {...register(`imageUrl${index}`)}
              className="w-full px-3 py-2 border rounded-md mb-2"
              placeholder={`Image URL ${index}`}
              type="url"
              disabled={submitting}
            />
          ))}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition disabled:bg-blue-300"
          disabled={submitting}
        >
          {submitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Room...
            </span>
          ) : 'Add Room'}
        </button>
      </form>
    </div>
  );
};

export default RoomForm;
