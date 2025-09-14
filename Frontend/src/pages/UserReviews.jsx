import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import StarRating from '../components/StarRating';

const UserReviews = () => {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newReview, setNewReview] = useState({
        rating: 5,
        comment: '',
        userId: auth?.userId || 0,
        hotelId: parseInt(hotelId)
    });
    const [editingReview, setEditingReview] = useState(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const [reviewsRes, ratingRes] = await Promise.all([
                    axios.get(`https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/Reviews/hotel/${hotelId}`),
                    axios.get(`https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/Reviews/average/${hotelId}`)
                ]);
                
                setReviews(reviewsRes.data);
                setAverageRating(ratingRes.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
                setError("Failed to load reviews");
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [hotelId]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!auth) {
            navigate('/login', { state: { from: `/hotel/${hotelId}/reviews` } });
            return;
        }

        try {
            setError('');

            if (editingReview) {
                // Update existing review
                const response = await axios.put(
                    `https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/Reviews/${editingReview.reviewId}`,
                    {
                        rating: newReview.rating,
                        comment: newReview.comment,
                        userId: auth.userId,
                        hotelId: parseInt(hotelId)
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${auth.token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                setReviews(reviews.map(r => 
                    r.reviewId === editingReview.reviewId ? response.data : r
                ));
                setEditingReview(null);
            } else {
                // Create new review
                const response = await axios.post(
                    'https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/Reviews',
                    {
                        rating: newReview.rating,
                        comment: newReview.comment,
                        userId: auth.userId,
                        hotelId: parseInt(hotelId)
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${auth.token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setReviews([response.data, ...reviews]);
            }

            // Recalculate average rating
            const newAvgResponse = await axios.get(
                `https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/Reviews/average/${hotelId}`
            );
            setAverageRating(newAvgResponse.data);
            
            // Reset form
            setNewReview({
                rating: 5,
                comment: '',
                userId: auth.userId,
                hotelId: parseInt(hotelId)
            });
        } catch (error) {
            console.error("Error submitting review:", error);
            setError(error.response?.data?.message || "Failed to submit review");
        }
    };

    const handleRatingChange = (rating) => {
        setNewReview({...newReview, rating});
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setNewReview({
            rating: review.rating,
            comment: review.comment,
            userId: review.userId,
            hotelId: review.hotelId
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;

        try {
            await axios.delete(`https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/Reviews/${reviewId}`, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });

            setReviews(reviews.filter(r => r.reviewId !== reviewId));
            
            // Recalculate average rating
            const newAvgResponse = await axios.get(
                `https://cozyhavenapi-hccchdhha4c8hjg3.southindia-01.azurewebsites.net/api/Reviews/average/${hotelId}`
            );
            setAverageRating(newAvgResponse.data);
        } catch (error) {
            console.error("Error deleting review:", error);
            setError("Failed to delete review");
        }
    };

    const handleCancelEdit = () => {
        setEditingReview(null);
        setNewReview({
            rating: 5,
            comment: '',
            userId: auth?.userId || 0,
            hotelId: parseInt(hotelId)
        });
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="max-w-md mx-auto mt-12 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="font-medium">Error loading reviews</p>
            <p>{error}</p>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <button 
                onClick={() => navigate(-1)} 
                className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
            >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Hotel
            </button>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Customer Reviews</h1>
                <div className="flex items-center mb-6">
                    <div className="text-4xl font-bold mr-4">{averageRating.toFixed(1)}</div>
                    <div>
                        <StarRating rating={averageRating} size="large" />
                        <p className="text-gray-600 mt-1">{reviews.length} reviews</p>
                    </div>
                </div>

                {auth && (
                    <div className="bg-gray-50 p-4 rounded-lg mb-8">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingReview ? 'Edit Your Review' : 'Write a Review'}
                        </h2>
                        <form onSubmit={handleSubmitReview}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-2">Your Rating</label>
                                <StarRating 
                                    rating={newReview.rating} 
                                    editable={true}
                                    onRatingChange={handleRatingChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="comment" className="block text-gray-700 mb-2">Your Review</label>
                                <textarea
                                    id="comment"
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                    required
                                ></textarea>
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                                >
                                    {editingReview ? 'Update Review' : 'Submit Review'}
                                </button>
                                {editingReview && (
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {!auth && (
                    <div className="bg-blue-50 p-4 rounded-lg mb-8 text-center">
                        <p className="text-blue-800 mb-2">Want to share your experience?</p>
                        <button
                            onClick={() => navigate('/login', { state: { from: `/hotel/${hotelId}/reviews` } })}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Sign in to write a review
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                    </div>
                ) : (
                    reviews.map(review => (
                        <div key={review.reviewId} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 relative">
                            {auth?.userId === review.userId && (
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <button
                                        onClick={() => handleEditReview(review)}
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
                            )}
                            <div className="flex items-center mb-3">
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-medium mr-3">
                                    {review.userName?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h3 className="font-medium">{review.userName || 'Anonymous'}</h3>
                                    <div className="flex items-center">
                                        <StarRating rating={review.rating} size="small" />
                                        <span className="text-gray-500 text-sm ml-2">
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserReviews;