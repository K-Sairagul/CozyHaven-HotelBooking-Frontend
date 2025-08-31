using Cozy_Haven___HotelBooking.DTOs;
using Cozy_Haven___HotelBooking.Interfaces;
using Cozy_Haven___HotelBooking.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cozy_Haven___HotelBooking.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(IPaymentService paymentService, ILogger<PaymentController> logger)
        {
            _paymentService = paymentService;
            _logger = logger;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<PaymentResultDTO>> ProcessPayment([FromBody] PaymentDTO paymentDTO)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(new PaymentResultDTO { Success = false, Message = "Invalid request" });

                var result = await _paymentService.ProcessPayment(paymentDTO);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing payment");
                return BadRequest(new PaymentResultDTO { Success = false, Message = ex.Message });
            }
        }

        [Authorize]
        [HttpGet("{paymentId}")]
        public async Task<ActionResult<Payment>> GetPayment(int paymentId)
        {
            try
            {
                var payment = await _paymentService.GetPayment(paymentId);
                if (payment == null) return NotFound();
                return Ok(payment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting payment {paymentId}");
                return StatusCode(500, "Internal server error");
            }
        }

        // Add this method to PaymentController.cs
        [Authorize]
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<List<PaymentHistoryDTO>>> GetUserPaymentHistory(int userId)
        {
            try
            {
                var payments = await _paymentService.GetUserPaymentHistory(userId);
                return Ok(payments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error getting payment history for user {userId}");
                return StatusCode(500, "Internal server error");
            }
        }


        [Authorize(Roles = "Admin")]
        [HttpGet("history")]
        public async Task<ActionResult<List<PaymentHistoryDTO>>> GetPaymentHistory()
        {
            try
            {
                var paymentHistory = await _paymentService.GetPaymentHistory();
                return Ok(paymentHistory);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting payment history");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}