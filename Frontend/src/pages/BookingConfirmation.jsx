import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7274';

export default function BookingConfirmation() {
    const { bookingId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const token = localStorage.getItem("token");
                
                await axios.post(
                    `${API_BASE_URL}/api/payment/confirm?sessionId=${sessionId}`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                const response = await axios.get(
                    `${API_BASE_URL}/api/Booking/${bookingId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                setBooking(response.data);
            } catch (err) {
                console.error("Payment verification failed:", err);
                navigate(`/booking/${bookingId}?payment_error=true`);
            } finally {
                setLoading(false);
            }
        };

        if (sessionId) {
            verifyPayment();
        } else {
            setLoading(false);
        }
    }, [sessionId, bookingId, navigate]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
            <div className="bg-white rounded-xl shadow-md p-8">
                <div className="mb-6">
                    <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Booking Confirmed! 🎉</h1>
                <p className="text-gray-600 mb-8">Thank you for your booking. A confirmation has been sent to your email.</p>
                
                {booking && (
                    <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Details</h2>
                        <div className="space-y-3">
                            <p className="flex justify-between">
                                <span className="text-gray-600">Booking ID:</span>
                                <span className="font-medium">{booking.bookingId}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Room:</span>
                                <span>{booking.room?.roomSize}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Dates:</span>
                                <span>
                                    {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}
                                </span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Total Paid:</span>
                                <span className="font-bold text-blue-600">${booking.totalAmount.toFixed(2)}</span>
                            </p>
                            <p className="flex justify-between">
                                <span className="text-gray-600">Status:</span>
                                <span className="capitalize">{booking.bookingStatus.toLowerCase()}</span>
                            </p>
                        </div>
                    </div>
                )}
                
                <button
                    onClick={() => navigate('/userdashboard/dashboard/bookings')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-300"
                >
                    View My Bookings
                </button>
            </div>
        </div>
    );
}