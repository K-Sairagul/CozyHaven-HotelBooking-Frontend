using Cozy_Haven___HotelBooking.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CozyHavenStay.Helpers
{
    public static class JwtHelper
    {
        public static string GenerateJwtToken(User user, IConfiguration config)
        {
            try
            {
                // Validate configuration
                if (string.IsNullOrEmpty(config["Jwt:Key"]))
                    throw new ArgumentNullException("JWT Key is missing in configuration");
                if (string.IsNullOrEmpty(config["Jwt:Issuer"]))
                    throw new ArgumentNullException("JWT Issuer is missing in configuration");
                if (string.IsNullOrEmpty(config["Jwt:Audience"]))
                    throw new ArgumentNullException("JWT Audience is missing in configuration");

                // Create claims identity
                var claims = new List<Claim>
                {
                    new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    new Claim(JwtRegisteredClaimNames.Email, user.Email),
                    new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
                    new Claim(ClaimTypes.Role, user.Role)
                };

                // Add additional claims if needed
                if (!string.IsNullOrEmpty(user.FullName))
                    claims.Add(new Claim(ClaimTypes.Name, user.FullName));

                // Create security key
                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["Jwt:Key"]));
                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

                // Get token expiration from config or use default
                var expires = DateTime.UtcNow.AddMinutes(
                    string.IsNullOrEmpty(config["Jwt:ExpiryInMinutes"]) ?
                    120 : // Default 2 hours
                    Convert.ToDouble(config["Jwt:ExpiryInMinutes"]));

                // Create token descriptor
                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims),
                    Expires = expires,
                    Issuer = config["Jwt:Issuer"],
                    Audience = config["Jwt:Audience"],
                    SigningCredentials = creds
                };

                // Generate token
                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.CreateToken(tokenDescriptor);

                return tokenHandler.WriteToken(token);
            }
            catch (Exception ex)
            {
                // Log the error (you might want to inject ILogger in a non-static context)
                throw new Exception("Failed to generate JWT token", ex);
            }
        }
    }
}