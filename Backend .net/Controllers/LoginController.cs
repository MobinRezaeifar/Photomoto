using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Runtime.InteropServices.JavaScript;
using System.Security.Claims;
using System.Text;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Win32;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WebApplication1.Models;
using WebApplication1.Services;

[Route("api/[controller]")]
[ApiController]
public class LoginController : ControllerBase
{
    [HttpPost]
    public IActionResult Login([FromBody] Login login)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub,  login.Username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Name, login.Username)
        };

        var token = new JwtSecurityToken(
            issuer: "admin@gmail.com",
            audience: "client@gmail.com",
            claims: claims,
            expires: DateTime.MaxValue,
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        "abcdefghijklomnpqrstuvwxyz12345678900987654321abcdefghijklomnpqrstuvwxyz12345678900987654321"
                    )
                ),
                SecurityAlgorithms.HmacSha256
            )
        );

        var tokenHandler = new JwtSecurityTokenHandler();
        var writtenToken = tokenHandler.WriteToken(token);

        return Ok(new { token = writtenToken });
    }
}
