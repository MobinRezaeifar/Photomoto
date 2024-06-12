using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using WebApplication1.Models;
using WebApplication1.Services.Register;

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

        [Authorize]
        [HttpGet]
        public ActionResult<List<Registers>> Get()
        {
            return _registersService.Get();
        }

        [Authorize]
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
                return BadRequest("This username is already registered with another person.");
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

        [HttpPost("login")]
        public IActionResult Login([FromBody] Login loginRequest)
        {
            var user = _registersService.GetUserByUsernameAndPassword(loginRequest.Username, loginRequest.Password);

            if (user == null)
            {
                return Unauthorized("The username or password is incorrect.");
            }

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, loginRequest.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, loginRequest.Username)
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
