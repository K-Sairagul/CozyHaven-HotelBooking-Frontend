import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';

const UserReviewsPage = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [userReviews, setUserReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState({
        rating: null,
        search: ''
    });

    useEffect(() => {
        if (!auth) {
            navigate('/login');
            return;
        }

        const fetchUserReviews = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/Reviews/user/${auth.userId}`, {
                    headers: {
                        Authorization: `Bearer ${auth.token}`
                    }
                });
                setUserReviews(response.data);
            } catch (error) {
                console.error("Error fetching user reviews:", error);
                setError(error.response?.data?.message || "Failed to load your reviews");
            } finally {
                setLoading(false);
            }
        };

        fetchUserReviews();
    }, [auth, navigate]);

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            await axios.delete(`https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/Reviews/${reviewId}`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            setUserReviews(userReviews.filter(review => review.reviewId !== reviewId));
        } catch (error) {
            console.error("Error deleting review:", error);
            setError("Failed to delete review");
        }
    };

    const handleEditReview = (reviewId) => {
        navigate(`/edit-review/${reviewId}`);
    };

    const handleNavigateToHotel = (hotelId) => {
        navigate(`/hotel/${hotelId}`);
    };

    const filteredReviews = userReviews.filter(review => {
        // Filter by rating if specified
        if (filter.rating !== null && review.rating !== filter.rating) {
            return false;
        }
        // Filter by search term if specified
        if (filter.search && 
            !review.hotelName.toLowerCase().includes(filter.search.toLowerCase()) &&
            !review.comment.toLowerCase().includes(filter.search.toLowerCase())) {
            return false;
        }
        return true;
    });

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-md mx-auto mt-12 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="font-medium">Error loading reviews</p>
            <p>{error}</p>
            <button 
                onClick={() => window.location.reload()}
                className="mt-2 text-blue-600 hover:underline"
            >
                Try again
            </button>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Your Reviews</h1>
                <button 
                    onClick={() => navigate(-1)} 
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-700 mb-1">
                            Filter by Rating
                        </label>
                        <select
                            id="rating-filter"
                            value={filter.rating || ''}
                            onChange={(e) => setFilter({...filter, rating: e.target.value ? parseInt(e.target.value) : null})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Ratings</option>
                            <option value="5">5 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="2">2 Stars</option>
                            <option value="1">1 Star</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                            Search Reviews
                        </label>
                        <input
                            type="text"
                            id="search"
                            placeholder="Search by hotel or comment..."
                            value={filter.search}
                            onChange={(e) => setFilter({...filter, search: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {filteredReviews.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto mb-4 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">
                            {filter.rating || filter.search ? 'No matching reviews found' : 'You haven\'t reviewed any hotels yet'}
                        </h3>
                        <p className="text-gray-500">
                            {filter.rating || filter.search 
                                ? 'Try adjusting your filters'
                                : 'Your reviews will appear here after you submit them'}
                        </p>
                        {(filter.rating || filter.search) && (
                            <button
                                onClick={() => setFilter({ rating: null, search: '' })}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredReviews.map(review => (
                            <div key={review.reviewId} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 relative">
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <button
                                        onClick={() => handleEditReview(review.reviewId)}
                                        className="text-blue-600 hover:text-blue-800"
                                        title="Edit review"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteReview(review.reviewId)}
                                        className="text-red-600 hover:text-red-800"
                                        title="Delete review"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-shrink-0">
                                        <img
                                            src={review.hotelImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=320&auto=format&fit=crop'}
                                            alt={review.hotelName}
                                            className="w-40 h-40 object-cover rounded-lg cursor-pointer"
                                            onClick={() => handleNavigateToHotel(review.hotelId)}
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=320&auto=format&fit=crop';
                                            }}
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <h2 
                                            className="text-xl font-bold text-gray-800 mb-1 hover:text-blue-600 cursor-pointer"
                                            onClick={() => handleNavigateToHotel(review.hotelId)}
                                        >
                                            {review.hotelName}
                                        </h2>
                                        <p className="text-sm text-gray-600 mb-2">{review.hotelLocation}</p>
                                        
                                        <div className="flex items-center mb-3">
                                            <StarRating rating={review.rating} size="small" />
                                            <span className="text-gray-500 text-sm ml-2">
                                                {new Date(review.reviewDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        
                                        <p className="text-gray-700 mb-4">{review.comment}</p>
                                        
                                        <button
                                            onClick={() => handleNavigateToHotel(review.hotelId)}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            View Hotel Details →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserReviewsPage;