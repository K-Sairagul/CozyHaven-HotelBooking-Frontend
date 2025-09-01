import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RoomList() {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [mainImages, setMainImages] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const userRole = localStorage.getItem("userRole") || "User";

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`https://localhost:7274/api/Room/hotel/${hotelId}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });
                const fetchedRooms = response.data;
                setRooms(fetchedRooms);

                // Set default main image for each room
                const defaultImages = {};
                fetchedRooms.forEach(room => {
                    defaultImages[room.roomId] = room.imageUrl1 || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop';
                });
                setMainImages(defaultImages);

            } catch (err) {
                setError("Failed to load rooms. Please try again later.");
                console.error("Error fetching rooms:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [hotelId]);

    const handleBookNow = (roomId) => {
        navigate(`/booking/${roomId}`);
    };

    const handleManageRoom = (roomId) => {
        navigate(`/manage-room/${roomId}`);
    };

    const handleThumbnailClick = (roomId, imageUrl) => {
        setMainImages(prev => ({
            ...prev,
            [roomId]: imageUrl
        }));
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-md mx-auto mt-12 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="font-medium">Error loading rooms</p>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Available Rooms</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map(room => {
                    const thumbnails = [room.imageUrl1, room.imageUrl2, room.imageUrl3, room.imageUrl4].filter(Boolean);
                    return (
                        <div 
                            key={room.roomId} 
                            className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100 transform hover:-translate-y-1 hover:scale-[1.02]"
                        >
                            {/* Main Image with Rating Badge */}
                            <div className="relative overflow-hidden">
                                <img
                                    src={mainImages[room.roomId] || thumbnails[0]}
                                    alt="Room"
                                    className="w-full h-64 object-cover transition-all duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm flex items-center">
                                    <span className="text-yellow-500 mr-1">★</span>
                                    <span className="font-semibold text-gray-800">4.4</span>
                                </div>
                            </div>

                            {/* Thumbnail Gallery */}
                            {thumbnails.length > 1 && (
                                <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto bg-gray-50">
                                    {thumbnails.map((img, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleThumbnailClick(room.roomId, img)}
                                            className={`flex-shrink-0 w-14 h-14 rounded-md overflow-hidden border-2 transition-all ${
                                                mainImages[room.roomId] === img
                                                    ? 'border-blue-500 scale-105'
                                                    : 'border-gray-200 hover:border-blue-300'
                                            }`}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Room Details */}
                            <div className="p-5">
                                <div className="mb-4">
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 text-left">{room.roomSize} Room</h3>
                                    <p className="text-blue-600 font-medium text-sm mb-3 text-left">
                                        {/* <span className="text-gray-500">Location:</span> {room.location || 'Hotel Location'} */}
                                    </p>
                                    <div className="flex items-center text-sm text-gray-600 mb-3 text-left">
                                        <span className="mr-2">🛏️ {room.bedType}</span>
                                        <span className="mx-1">•</span>
                                        <span>👥 Sleeps {room.maxPeople}</span>
                                    </div>
                                </div>

                                {/* Amenities Tags */}
                                <div className="flex flex-wrap gap-2 mb-4 justify-start">
                                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">Couple Friendly</span>
                                    {room.isAC && <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">AC Available</span>}
                                    <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">Free WiFi</span>
                                </div>

                                {/* Highlights */}
                                <ul className="space-y-2 mb-5 text-left">
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2 mt-0.5">✓</span>
                                        <span className="text-sm text-gray-700">Book with $0 Payment</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2 mt-0.5">✓</span>
                                        <span className="text-sm text-gray-700">10% Off on Meal Upgrade</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2 mt-0.5">✓</span>
                                        <span className="text-sm text-gray-700">Excellent staff & free breakfast</span>
                                    </li>
                                </ul>

                                {/* Price and CTA */}
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                    <div className="text-left">
                                        <p className="text-xs text-gray-500 line-through">${Math.round(room.baseFare * 6)}</p>
                                        <p className="text-2xl font-bold text-green-600">${room.baseFare}</p>
                                        <p className="text-xs text-gray-500">+ taxes & fees</p>
                                    </div>
                                    <div>
                                        {userRole === "User" ? (
                                            <button
                                                onClick={() => handleBookNow(room.roomId)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                                            >
                                                Book Now
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleManageRoom(room.roomId)}
                                                className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                                            >
                                                Manage
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}