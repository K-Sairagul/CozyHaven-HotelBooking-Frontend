import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const UserPayments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserPayments = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/Payment/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setPayments(response.data);
        setFilteredPayments(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch payment history');
        toast.error('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchUserPayments();
  }, [navigate]);

  useEffect(() => {
    let results = payments;
    
    // Apply status filter
    if (statusFilter !== 'All') {
      results = results.filter(payment => 
        payment.paymentStatus.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(payment => 
        payment.hotelName?.toLowerCase().includes(term)
      );
    }
    
    setFilteredPayments(results);
  }, [searchTerm, statusFilter, payments]);

  const handleCancelPayment = async (paymentId, bookingId) => {
    try {
      setCancellingId(paymentId);
      const token = localStorage.getItem('token');
      
      const isConfirmed = window.confirm(
        'Are you sure you want to cancel this payment? ' +
        'This will cancel your booking and process a refund.'
      );
      
      if (!isConfirmed) return;

      const response = await axios.put(
        `https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/booking/cancel/${bookingId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setPayments(prevPayments => 
          prevPayments.map(payment => 
            payment.paymentId === paymentId
              ? { ...payment, paymentStatus: 'Refunded' }
              : payment
          )
        );
        toast.success('Payment cancelled and refund processed successfully');
      } else {
        toast.error(response.data.message || 'Failed to cancel payment');
      }
    } catch (error) {
      console.error('Error cancelling payment:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel payment');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
      <div className="max-w-md mx-auto mt-12 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
        <p className="font-medium">Error loading payment history</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Your Payment History</h2>
            <p className="text-gray-600">All your completed payments</p>
            
            {/* Filters and Search */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Payments</label>
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
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                <select
                  id="status"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Payments</option>
                  <option value="Completed">Completed</option>
                  <option value="Refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="text-xl font-medium text-gray-800 mt-4">
                {payments.length === 0 ? 'No payment history found' : 'No matching payments found'}
              </h3>
              <p className="text-gray-500 mt-2">
                {payments.length === 0 ? "You haven't made any payments yet" : "Try adjusting your search or filter"}
              </p>
              {payments.length === 0 && (
                <button
                  onClick={() => navigate('/')}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Book a Room
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hotel
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.paymentId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{payment.hotelName}</div>
                        <div className="text-sm text-gray-500">Booking :{payment.bookingId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Room #{payment.roomId}</div>
                        <div className="text-sm text-gray-500">{payment.roomType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 font-semibold">
                          ${payment.amountPaid?.toFixed(2) || '0.00'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(payment.paymentDate)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(payment.paymentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            payment.paymentStatus === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {payment.paymentStatus}
                        </span>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {payment.paymentStatus === 'Completed' && (
                          <button
                            onClick={() => handleCancelPayment(payment.paymentId, payment.bookingId)}
                            disabled={cancellingId === payment.paymentId}
                            className={`text-red-600 hover:text-red-900 ${
                              cancellingId === payment.paymentId ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            {cancellingId === payment.paymentId ? 'Processing...' : 'Request Refund'}
                          </button>
                        )}
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPayments;