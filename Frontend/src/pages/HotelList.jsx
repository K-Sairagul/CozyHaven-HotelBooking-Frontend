import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StarRating from '../components/StarRating';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

// Tilt configuration
const ROTATION_RANGE = 12;
const TRANSITION_CONFIG = {
  type: "spring",
  stiffness: 300,
  damping: 20,
  mass: 0.5
};

export default function HotelList() {
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userName, setUserName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { auth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUserName(storedName);
        }

        if (!auth) return;

        const fetchHotels = async () => {
            try {
                const response = await axios.get('https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/Hotel', {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                setHotels(response.data);
                setFilteredHotels(response.data);
            } catch (error) {
                console.error("Error fetching hotels:", error);
                setError(error.response?.data?.message || "Failed to fetch hotels");
                if (error.response?.status === 401) {
                    navigate("/login", { state: { from: location }, replace: true });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, [auth, navigate, location]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredHotels(hotels);
        } else {
            const filtered = hotels.filter(hotel =>
                hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                hotel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (hotel.description && hotel.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
            setFilteredHotels(filtered);
        }
    }, [searchTerm, hotels]);

    const handleViewDetails = (hotelId) => {
        navigate(`/hotel/${hotelId}/rooms`);
    };

    const handleUpdate = (hotelId) => {
        navigate(`/update-hotel/${hotelId}`);
    };

    const handleDelete = async (hotelId) => {
        try {
            await axios.delete(`https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/Hotel/${hotelId}`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            const updatedHotels = hotels.filter(hotel => hotel.hotelId !== hotelId);
            setHotels(updatedHotels);
            setFilteredHotels(updatedHotels);
        } catch (error) {
            console.error("Error deleting hotel:", error);
            setError(error.response?.data?.message || "Failed to delete hotel");
        }
    };

    const handleManageRooms = (hotelId) => {
        navigate(`/hotel/${hotelId}/rooms`);
    };

    const handleProfileClick = () => {
        navigate('/userdashboard/dashboard/profile');
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const renderHotelActions = (hotelId) => {
        if (auth.role === "User") {
            return (
                <button
                    onClick={() => handleViewDetails(hotelId)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 shadow-sm"
                >
                    View Property
                </button>
            );
        }

        if (auth.role === "Admin" || auth.role === "HotelOwner") {
            return (
                <div className="grid grid-cols-2 gap-2 mt-4">
                    <button
                        onClick={() => handleUpdate(hotelId)}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-300 text-sm shadow-sm"
                    >
                        Update
                    </button>
                    <button
                        onClick={() => handleDelete(hotelId)}
                        className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-300 text-sm shadow-sm"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => handleManageRooms(hotelId)}
                        className="col-span-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-300 text-sm shadow-sm"
                    >
                        Manage Rooms
                    </button>
                </div>
            );
        }

        return null;
    };

    const TiltCard = ({ hotel }) => {
        const ref = useRef(null);
        const x = useMotionValue(0);
        const y = useMotionValue(0);
        
        const xSpring = useSpring(x, TRANSITION_CONFIG);
        const ySpring = useSpring(y, TRANSITION_CONFIG);
        
        const transform = useMotionTemplate`perspective(1000px) rotateX(${xSpring}deg) rotateY(${ySpring}deg) scale(1)`;

        const handleMouseMove = (e) => {
            if (!ref.current) return;
            
            const rect = ref.current.getBoundingClientRect();
            const width = rect.width;
            const height = rect.height;
            
            const mouseX = (e.clientX - rect.left - width/2) / (width/2);
            const mouseY = (e.clientY - rect.top - height/2) / (height/2);
            
            x.set(mouseY * ROTATION_RANGE * -1);
            y.set(mouseX * ROTATION_RANGE);
        };

        const handleMouseLeave = () => {
            x.set(0);
            y.set(0);
        };

        return (
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    transformStyle: "preserve-3d",
                    transform,
                }}
                className="relative h-full w-full rounded-xl bg-white shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
                <div className="h-full flex flex-col">
                    <div className="relative h-40 w-full overflow-hidden">
                        <img
                            src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=320&auto=format&fit=crop'}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=320&auto=format&fit=crop';
                            }}
                        />
                        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                            ★ {hotel.rating || '5.0'}
                        </div>
                    </div>
                    
                    <div className="p-4 flex-grow flex flex-col">
                        <h2 className="text-lg font-bold text-gray-800 mb-1 truncate">{hotel.name}</h2>
                        <p className="text-sm text-gray-600 mb-2">{hotel.location}</p>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                            <StarRating rating={hotel.rating || 5} size="small" />
                            <span className="mx-1">•</span>
                            <button 
                                onClick={() => navigate(`/hotel/${hotel.hotelId}/reviews`)}
                                className="text-blue-600 hover:underline"
                            >
                                {hotel.reviewCount || '100+'} reviews
                            </button>
                        </div>
                        
                        <p className="text-xs text-gray-700 mb-3 line-clamp-2">{hotel.description}</p>
                        
                        <div className="flex justify-between text-xs mb-2">
                            <span className="font-medium">Room Types:</span>
                            <span className="text-gray-600">{hotel.roomTypes || 'Deluxe, Suite'}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm mb-4">
                            <span className="font-medium">Price:</span>
                            <span className="text-blue-600 font-bold">${hotel.price || '150'}/night</span>
                        </div>
                        
                        {renderHotelActions(hotel.hotelId)}
                    </div>
                </div>
            </motion.div>
        );
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-md mx-auto mt-12 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="font-medium">Error loading hotels</p>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm py-4 px-4 sm:px-6 flex justify-between items-center sticky top-0 z-10">
                {/* Logo and mobile menu button */}
                <div className="flex items-center">
                    {/* Mobile menu button */}
                    <button 
                        onClick={toggleMobileMenu}
                        className="md:hidden mr-3 p-1 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                    
                    {/* Logo */}
                    <div className="text-xl sm:text-2xl font-bold text-blue-600 flex items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                            <span className="text-white font-bold text-xs sm:text-sm">CH</span>
                        </div>
                        <span className="hidden sm:inline">CozyHaven</span>
                    </div>
                </div>

                {/* Desktop Search and Profile */}
                <div className="hidden md:flex items-center space-x-4">
                    {/* Search Bar */}
                    <div className="w-64">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search hotels..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm shadow-sm"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* User Profile */}
                    <div 
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 px-3 py-1 rounded-lg transition-colors"
                        onClick={handleProfileClick}
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                            {userName ? userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <span className="font-medium text-gray-700 hidden lg:inline">{userName || 'User'}</span>
                    </div>
                </div>

                {/* Mobile profile icon (visible on small screens) */}
                <div className="md:hidden">
                    <div 
                        className="flex items-center cursor-pointer"
                        onClick={handleProfileClick}
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                            {userName ? userName.charAt(0).toUpperCase() : 'U'}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile menu (visible when toggled) */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white shadow-md px-4 py-3 border-t border-gray-200">
                    {/* Mobile search bar */}
                    <div className="mb-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search hotels..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm shadow-sm"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Mobile user info */}
                    <div className="pt-2 border-t border-gray-100">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium mr-3">
                                {userName ? userName.charAt(0).toUpperCase() : 'U'}
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">{userName || 'User'}</p>
                                <p className="text-xs text-gray-500">View Profile</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="py-6 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Mobile-only search bar (visible when menu is closed) */}
                    <div className="md:hidden mb-6">
                        {!isMobileMenuOpen && (
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search hotels..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm shadow-sm"
                                    onClick={toggleMobileMenu}
                                />
                            </div>
                        )}
                    </div>

                    {filteredHotels.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mx-auto mb-4 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-gray-800 mb-2">
                                {searchTerm ? 'No hotels match your search' : 'No hotels available'}
                            </h3>
                            <p className="text-gray-500">
                                {searchTerm 
                                    ? 'Try adjusting your search or browse all hotels'
                                    : 'Please check back later or contact support'}
                            </p>
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Clear Search
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                            {filteredHotels.map(hotel => (
                                <div key={hotel.hotelId} className="w-full h-full max-w-sm">
                                    <TiltCard hotel={hotel} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}