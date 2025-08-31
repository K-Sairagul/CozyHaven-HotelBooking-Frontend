using Cozy_Haven___HotelBooking.Data;
using Cozy_Haven___HotelBooking.DTO;
using Cozy_Haven___HotelBooking.Models;
using CozyHavenStay.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CozyHavenStay.Services
{
    public class ReviewService : IReviewService
    {
        private readonly CozyHavenDbContext _context;

        public ReviewService(CozyHavenDbContext context)
        {
            _context = context;
        }

        public async Task<List<ReviewResponseDto>> GetHotelReviews(int hotelId)
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Hotel)
                .Where(r => r.HotelId == hotelId)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewResponseDto
                {
                    ReviewId = r.ReviewId,
                    UserId = r.UserId,
                    UserName = r.User.FullName,
                    HotelId = r.HotelId,
                    HotelName = r.Hotel.Name,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                })
                .ToListAsync();
        }

        public async Task<ReviewResponseDto> GetReviewById(int reviewId)
        {
            return await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Hotel)
                .Where(r => r.ReviewId == reviewId)
                .Select(r => new ReviewResponseDto
                {
                    ReviewId = r.ReviewId,
                    UserId = r.UserId,
                    UserName = r.User.FullName,
                    HotelId = r.HotelId,
                    HotelName = r.Hotel.Name,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt
                })
                .FirstOrDefaultAsync();
        }

        public async Task<ReviewResponseDto> AddReview(ReviewDto reviewDto)
        {
            // Verify user and hotel exist
            var user = await _context.Users.FindAsync(reviewDto.UserId);
            var hotel = await _context.Hotels.FindAsync(reviewDto.HotelId);

            if (user == null || hotel == null)
            {
                throw new KeyNotFoundException("User or Hotel not found");
            }

            var review = new Review
            {
                UserId = reviewDto.UserId,
                HotelId = reviewDto.HotelId,
                Rating = reviewDto.Rating,
                Comment = reviewDto.Comment,
                CreatedAt = DateTime.UtcNow
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return new ReviewResponseDto
            {
                ReviewId = review.ReviewId,
                UserId = review.UserId,
                UserName = user.FullName,
                HotelId = review.HotelId,
                HotelName = hotel.Name,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            };
        }

        public async Task<ReviewResponseDto> UpdateReview(int reviewId, ReviewDto reviewDto)
        {
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null)
            {
                throw new KeyNotFoundException("Review not found");
            }

            review.Rating = reviewDto.Rating;
            review.Comment = reviewDto.Comment;

            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(review.UserId);
            var hotel = await _context.Hotels.FindAsync(review.HotelId);

            return new ReviewResponseDto
            {
                ReviewId = review.ReviewId,
                UserId = review.UserId,
                UserName = user.FullName,
                HotelId = review.HotelId,
                HotelName = hotel.Name,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt
            };
        }

        public async Task<bool> DeleteReview(int reviewId)
        {
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null)
            {
                return false;
            }

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<double> GetAverageRating(int hotelId)
        {
            return await _context.Reviews
                .Where(r => r.HotelId == hotelId)
                .AverageAsync(r => (double)r.Rating);
        }

        public async Task<List<UserReviewResponseDto>> GetUserReviewsWithHotelInfo(int userId)
        {
            return await _context.Reviews
                .Where(r => r.UserId == userId)
                .Include(r => r.Hotel)
                .Select(r => new UserReviewResponseDto
                {
                    ReviewId = r.ReviewId,
                    HotelId = r.HotelId,
                    HotelName = r.Hotel.Name,
                    HotelLocation = r.Hotel.Location,
                    HotelImageUrl = r.Hotel.ImageUrl,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    ReviewDate = r.CreatedAt
                })
                .OrderByDescending(r => r.ReviewDate)
                .ToListAsync();
        }


        public async Task<List<ReviewResponseDto>> GetAllReviews()
        {
            var reviews = await _context.Reviews
                .Include(r => r.User)
                .Include(r => r.Hotel)
                .ToListAsync();

            return reviews.Select(r => new ReviewResponseDto
            {
                ReviewId = r.ReviewId,
                UserId = r.UserId,
                UserName = r.User?.FullName ?? "Unknown User",
                HotelId = r.HotelId,
                HotelName = r.Hotel?.Name ?? "Unknown Hotel",
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            }).ToList();
        }
    }
}