import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:7274/api/booking/user', { 
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const bookingsData = Array.isArray(response.data) ? response.data : [];
        setBookings(bookingsData);
        setFilteredBookings(bookingsData);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to fetch bookings');
        setBookings([]);
        setFilteredBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  useEffect(() => {
    let results = bookings;
    
    // Apply status filter
    if (statusFilter !== 'All') {
      results = results.filter(booking => 
        booking.bookingStatus.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(booking => 
        booking.hotel?.name?.toLowerCase().includes(term)
      );
    }
    
    setFilteredBookings(results);
  }, [searchTerm, statusFilter, bookings]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const canCancelBooking = (checkInDate) => {
    const now = new Date();
    const checkIn = new Date(checkInDate);
    const hoursBeforeCheckIn = (checkIn - now) / (1000 * 60 * 60);
    return hoursBeforeCheckIn > 24; // Can cancel if more than 24 hours before check-in
  };

  const handleCancelBooking = async (bookingId, checkInDate) => {
    if (!canCancelBooking(checkInDate)) {
      toast.error('Cancellation is not allowed within 24 hours of check-in');
      return;
    }

    try {
      setCancellingId(bookingId);
      const token = localStorage.getItem('token');
      
      const isConfirmed = window.confirm(
        'Are you sure you want to cancel this booking? ' +
        'A refund will be processed if payment was made.'
      );
      
      if (!isConfirmed) return;

      const response = await axios.put(
        `https://localhost:7274/api/booking/cancel/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.bookingId === bookingId 
              ? { ...booking, bookingStatus: 'Cancelled' } 
              : booking
          )
        );
        toast.success(response.data.message || 'Booking cancelled successfully');
      } else {
        toast.error(response.data.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      if (error.response?.status === 400) {
        toast.error(error.response.data || 'Booking cancellation failed');
      } else {
        toast.error(error.message || 'Failed to cancel booking');
      }
    } finally {
      setCancellingId(null);
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
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h1>
      
      {/* Filters and Search */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="w-full md:w-1/2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Hotels</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                placeholder="Search by hotel name..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select
              id="status"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Bookings</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredBookings.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          {bookings.length === 0 ? (
            <>
              <p className="text-gray-600 mb-4">You don't have any bookings yet.</p>
              <button 
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Book a Room
              </button>
            </>
          ) : (
            <p className="text-gray-600">No bookings match your search criteria.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.bookingId} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">
                    {booking.hotel?.name || 'Hotel Name Not Available'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Room: {booking.room?.roomId || 'Room Type Not Available'}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  booking.bookingStatus === 'Confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : booking.bookingStatus === 'Cancelled' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.bookingStatus}
                </span>
              </div>
              
              <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p className="font-medium">{formatDate(booking.checkInDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="font-medium">{formatDate(booking.checkOutDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="font-medium">${booking.totalAmount?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-100 flex justify-end space-x-3">
                {booking.bookingStatus === 'Confirmed' && (
                  <button
                    onClick={() => handleCancelBooking(booking.bookingId, booking.checkInDate)}
                    disabled={!canCancelBooking(booking.checkInDate) || cancellingId === booking.bookingId}
                    className={`px-4 py-2 rounded-md transition flex items-center justify-center min-w-[120px] ${
                      canCancelBooking(booking.checkInDate)
                        ? cancellingId === booking.bookingId
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    }`}
                    title={
                      canCancelBooking(booking.checkInDate)
                        ? 'Cancel this booking'
                        : 'Cancellation is not allowed within 24 hours of check-in'
                    }
                  >
                    {cancellingId === booking.bookingId ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Cancelling
                      </>
                    ) : (
                      'Cancel Booking'
                    )}
                  </button>
                )}
                <button
                  onClick={() => navigate(`/booking/${booking.bookingId}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage;