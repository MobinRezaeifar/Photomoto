using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace PMC.Utils
{
    /// <summary>
    /// Service for JWT token generation and validation
    /// </summary>
    public interface ITokenService
    {
        /// <summary>
        /// Generates a JWT token based on provided claims
        /// </summary>
        /// <param name="claims">Claims to be included in the token</param>
        /// <returns>Generated JWT token</returns>
        string GenerateJwtToken(IEnumerable<Claim> claims);
    }

    public class TokenService : ITokenService
    {
        private readonly string _key;
        private readonly string _issuer;
        private readonly string _audience;

        public TokenService(string key, string issuer, string audience)
        {
            _key = key;
            _issuer = issuer;
            _audience = audience;
        }

        /// <summary>
        /// Generates a JWT token based on provided claims
        /// </summary>
        /// <param name="claims">Claims to be included in the token</param>
        /// <returns>Generated JWT token</returns>
        public string GenerateJwtToken(IEnumerable<Claim> claims)
        {
            var key = Encoding.UTF8.GetBytes(_key);
            var creds = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _issuer,
                audience: _audience,
                claims: claims,
                expires: DateTime.MaxValue, // Token never expires (replace with desired expiration time)
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
