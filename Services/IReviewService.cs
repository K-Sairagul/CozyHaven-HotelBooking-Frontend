// Services/IReviewService.cs
using Cozy_Haven___HotelBooking.DTO;
using CozyHavenStay.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CozyHavenStay.Services
{
    public interface IReviewService
    {
        Task<List<ReviewResponseDto>> GetHotelReviews(int hotelId);
        Task<ReviewResponseDto> GetReviewById(int reviewId);
        Task<ReviewResponseDto> AddReview(ReviewDto reviewDto);
        Task<bool> DeleteReview(int reviewId);
        Task<ReviewResponseDto> UpdateReview(int reviewId, ReviewDto reviewDto);
        Task<double> GetAverageRating(int hotelId);

        Task<List<UserReviewResponseDto>> GetUserReviewsWithHotelInfo(int userId);

        Task<List<ReviewResponseDto>> GetAllReviews();

    }
}