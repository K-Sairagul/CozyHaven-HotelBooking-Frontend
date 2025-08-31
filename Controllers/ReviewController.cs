using CozyHavenStay.DTOs;
using Cozy_Haven___HotelBooking.DTO;
using CozyHavenStay.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace CozyHavenStay.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;
        private readonly ILogger<ReviewsController> _logger;

        public ReviewsController(IReviewService reviewService, ILogger<ReviewsController> logger)
        {
            _reviewService = reviewService;
            _logger = logger;
        }


        //GetReviewByHotelId

        [HttpGet("hotel/{hotelId}")]
        [AllowAnonymous]
        public async Task<ActionResult<List<ReviewResponseDto>>> GetHotelReviews(int hotelId)
        {
            try
            {
                var reviews = await _reviewService.GetHotelReviews(hotelId);
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting reviews for hotel {hotelId}");
                return StatusCode(500, "An error occurred while retrieving reviews");
            }
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<ReviewResponseDto>> GetReview(int id)
        {
            try
            {
                var review = await _reviewService.GetReviewById(id);
                if (review == null) return NotFound();
                return Ok(review);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting review {id}");
                return StatusCode(500, "An error occurred while retrieving the review");
            }
        }

        
        //Posting review for Hotel

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<ReviewResponseDto>> PostReview([FromBody] ReviewDto reviewDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                if (reviewDto.UserId != userId)
                    return Unauthorized("You can only create reviews for yourself");

                var createdReview = await _reviewService.AddReview(reviewDto);
                return CreatedAtAction(nameof(GetReview), new { id = createdReview.ReviewId }, createdReview);
            }
            catch (KeyNotFoundException ex)
            {
                _logger.LogWarning(ex, "User or Hotel not found");
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating review");
                return StatusCode(500, "An error occurred while creating the review");
            }
        }



        //Updating Review using review Id

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutReview(int id, [FromBody] ReviewDto reviewDto)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var review = await _reviewService.GetReviewById(id);

                if (review == null) return NotFound();
                if (review.UserId != userId) return Unauthorized("You can only update your own reviews");

                var updatedReview = await _reviewService.UpdateReview(id, reviewDto);
                return Ok(updatedReview);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error updating review {id}");
                return StatusCode(500, "An error occurred while updating the review");
            }
        }




        //Deleting Review using Delete ReviewId

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteReview(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                var review = await _reviewService.GetReviewById(id);

                if (review == null) return NotFound();
                if (review.UserId != userId && !User.IsInRole("Admin"))
                    return Unauthorized("You can only delete your own reviews");

                var result = await _reviewService.DeleteReview(id);
                if (!result) return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error deleting review {id}");
                return StatusCode(500, "An error occurred while deleting the review");
            }
        }


        //Getting AverageRating

        [HttpGet("average/{hotelId}")]
        [AllowAnonymous]
        public async Task<ActionResult<double>> GetAverageRating(int hotelId)
        {
            try
            {
                var average = await _reviewService.GetAverageRating(hotelId);
                return Ok(average);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting average rating for hotel {hotelId}");
                return StatusCode(500, "An error occurred while calculating average rating");
            }
        }


        // Add this to your ReviewsController.cs
        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<ActionResult<List<UserReviewResponseDto>>> GetUserReviews(int userId)
        {
            try
            {
                // Verify the requesting user can only access their own reviews
                var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
                if (userId != currentUserId && !User.IsInRole("Admin"))
                {
                    return Unauthorized("You can only view your own reviews");
                }

                var userReviews = await _reviewService.GetUserReviewsWithHotelInfo(userId);
                return Ok(userReviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting reviews for user {userId}");
                return StatusCode(500, "An error occurred while retrieving user reviews");
            }
        }


        [HttpGet("all")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<List<ReviewResponseDto>>> GetAllReviews()
        {
            try
            {
                var reviews = await _reviewService.GetAllReviews();
                return Ok(reviews);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting all reviews");
                return StatusCode(500, "An error occurred while retrieving all reviews");
            }
        }
    }
}