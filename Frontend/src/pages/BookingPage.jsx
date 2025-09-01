import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function BookingPage() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bookingDetails, setBookingDetails] = useState({
        checkInDate: null,
        checkOutDate: null,
        numberOfGuests: 1,
    });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        const fetchRoomDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`https://localhost:7274/api/Room/${roomId}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                setRoom(response.data);
            } catch (err) {
                setError("Failed to load room details. Please try again later.");
                console.error("Error fetching room:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRoomDetails();
    }, [roomId]);

    useEffect(() => {
        if (bookingDetails.checkInDate && bookingDetails.checkOutDate && room) {
            const nights = Math.ceil((bookingDetails.checkOutDate - bookingDetails.checkInDate) / (1000 * 60 * 60 * 24));
            setTotalAmount(nights * room.baseFare);
        }
    }, [bookingDetails.checkInDate, bookingDetails.checkOutDate, room]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDateChange = (date, field) => {
        setBookingDetails(prev => ({
            ...prev,
            [field]: date
        }));
    };

    const handleBookNow = (e) => {
        e.preventDefault();
        if (!bookingDetails.checkInDate || !bookingDetails.checkOutDate) {
            setError("Please select check-in and check-out dates");
            return;
        }
        setShowConfirmation(true);
    };

    const handleConfirmBooking = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate('/login');
                return;
            }

            const bookingData = {
                roomId: parseInt(roomId),
                hotelId: room.hotelId,
                checkInDate: bookingDetails.checkInDate.toISOString(),
                checkOutDate: bookingDetails.checkOutDate.toISOString(),
                numberOfGuests: parseInt(bookingDetails.numberOfGuests),
            };

            const response = await axios.post('https://localhost:7274/api/Booking', bookingData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigate(`/payment/${response.data.bookingId}`);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create booking. Please try again.");
            console.error("Booking error:", err);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-md mx-auto mt-12 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="font-medium">Error loading room</p>
            <p>{error}</p>
        </div>
    );

    if (!room) return <div className="text-center mt-12">Room not found</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Book Your Stay</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Room Details */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <img
                        src={room.imageUrl1 || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop'}
                        alt="Room"
                        className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{room.roomSize} Room</h2>
                        <p className="text-gray-600 mb-4">{room.bedType} • Sleeps {room.maxPeople}</p>
                        
                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-800 mb-2">Amenities</h3>
                            <ul className="grid grid-cols-2 gap-2">
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>{room.isAC ? 'AC' : 'Non-AC'}</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Free WiFi</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>TV</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✓</span>
                                    <span>Attached Bathroom</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-4">
                            <p className="text-2xl font-bold text-blue-600">${room.baseFare} <span className="text-sm font-normal text-gray-500">per night</span></p>
                        </div>
                    </div>
                </div>
                
                {/* Booking Form */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    {!showConfirmation ? (
                        <>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Details</h2>
                            
                            <form onSubmit={handleBookNow}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Check-in Date</label>
                                    <DatePicker
                                        selected={bookingDetails.checkInDate}
                                        onChange={(date) => handleDateChange(date, 'checkInDate')}
                                        minDate={new Date()}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Check-out Date</label>
                                    <DatePicker
                                        selected={bookingDetails.checkOutDate}
                                        onChange={(date) => handleDateChange(date, 'checkOutDate')}
                                        minDate={bookingDetails.checkInDate || new Date()}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Number of Guests</label>
                                    <select
                                        name="numberOfGuests"
                                        value={bookingDetails.numberOfGuests}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                        required
                                    >
                                        {[...Array(room.maxPeople)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                                        {error}
                                    </div>
                                )}
                                
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300"
                                    disabled={!bookingDetails.checkInDate || !bookingDetails.checkOutDate}
                                >
                                    Book Now
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="booking-confirmation">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Your Booking</h2>
                            
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-800 mb-2">Booking Summary</h3>
                                <div className="space-y-2">
                                    <p className="flex justify-between">
                                        <span>Room Type:</span>
                                        <span>{room.roomSize}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Check-in:</span>
                                        <span>{bookingDetails.checkInDate.toLocaleDateString()}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Check-out:</span>
                                        <span>{bookingDetails.checkOutDate.toLocaleDateString()}</span>
                                    </p>
                                    <p className="flex justify-between">
                                        <span>Guests:</span>
                                        <span>{bookingDetails.numberOfGuests}</span>
                                    </p>
                                </div>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-4 mb-6">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-700">Room Price</span>
                                    <span>${room.baseFare} x {Math.ceil((bookingDetails.checkOutDate - bookingDetails.checkInDate) / (1000 * 60 * 60 * 24))} nights</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg">
                                    <span>Total Amount</span>
                                    <span>${totalAmount.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setShowConfirmation(false)}
                                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-md transition duration-300"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleConfirmBooking}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition duration-300"
                                >
                                    Confirm & Pay
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}