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

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RegistersController : ControllerBase
    {
        private readonly IRegistersService _registersService;

        public RegistersController(IRegistersService registersService)
        {
            _registersService = registersService;
        }

        [HttpGet]
        public ActionResult<List<Registers>> Get()
        {
            return _registersService.Get();
        }

        [HttpGet("{id}")]
        public ActionResult<Registers> Get(string id)
        {
            var register = _registersService.Get(id);

            if (register == null)
            {
                return NotFound($"register with Id = {id} not found");
            }

            return register;
        }

        [HttpPost]
        public IActionResult Register([FromBody] Registers register)
        {
            bool isUsernameExists = _registersService.IsUsernameExists(register.Username);

            if (isUsernameExists)
            {
                return BadRequest("این username قبلا با یک نفر دیگر ثبت نام کرده است.");
            }

            _registersService.Create(register);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, register.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, register.Username)
            };

            var token = new JwtSecurityToken(
                issuer: "admin@gmail.com",
                audience: "client@gmail.com",
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(60),
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

        [HttpPut("{id}")]
        public ActionResult Put(string id, [FromBody] Registers register)
        {
            var existingRegister = _registersService.Get(id);

            if (existingRegister == null)
            {
                return NotFound($"register with Id = {id} not found");
            }

            _registersService.Update(id, register);

            return NoContent();
        }

        [HttpPatch("api/registers/{id}")]
        public IActionResult Patch(string id, [FromBody] Registers register)
        {
            var existingRegister = _registersService.Get(id);

            var updatedRegister = new Registers()
            {
                Id = register.Id,
                Username =
                    register.Username != null ? register.Username : existingRegister.Username,
                Bio = register.Bio != null ? register.Bio : existingRegister.Bio,
                Connection =
                    register.Connection != null ? register.Connection : existingRegister.Connection,
                FullName =
                    register.FullName != null ? register.FullName : existingRegister.FullName,
                Password =
                    register.Password != null ? register.Password : existingRegister.Password,
                ProfileImg =
                    register.ProfileImg != null ? register.ProfileImg : existingRegister.ProfileImg,
                Hash = register.Hash != null ? register.Hash : existingRegister.Hash,
                Gender = register.Gender != null ? register.Gender : existingRegister.Gender,
                Post = register.Post != null ? register.Post : existingRegister.Post,
                Email = register.Email != null ? register.Email : existingRegister.Email
            };

            if (existingRegister == null)
            {
                return NotFound($"register with Id = {id} not found");
            }

            _registersService.Update(id, updatedRegister);

            return NoContent();
        }

        // [HttpPatch("api/registers/{id}")]
        // public IActionResult Patch(string id, [FromBody] JsonPatchDocument<Registers> patchDoc)
        // {
        //     var existingRegister = _registersService.Get(id);

        //     if (existingRegister == null)
        //     {
        //         return NotFound($"Register with ID {id} not found.");
        //     }

        //     var updatedRegister = new Registers()
        //     {
        //         Id = existingRegister.Id,
        //         Username = existingRegister.Username,
        //         Bio = existingRegister.Bio,
        //         Connection = existingRegister.Connection,
        //         FullName = existingRegister.FullName,
        //         Password = existingRegister.Password,
        //         ProfileImg = existingRegister.ProfileImg,
        //         Hash = existingRegister.Hash,
        //         Gender = existingRegister.Gender,
        //         Post = existingRegister.Post,
        //         Email = existingRegister.Email
        //     };

        //     patchDoc.ApplyTo(updatedRegister);

        //     if (!TryValidateModel(updatedRegister))
        //     {
        //         return BadRequest(ModelState);
        //     }

        //     _registersService.Update(id, updatedRegister);

        //     return NoContent();
        // }

        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var register = _registersService.Get(id);

            if (register == null)
            {
                return NotFound($"register with Id = {id} not found");
            }

            _registersService.Remove(register.Id);

            return Ok($"register with Id = {id} deleted");
        }
    }
}
