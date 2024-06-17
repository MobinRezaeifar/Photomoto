using Registers.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Registers.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Registers.Utils;
using MongoDB.Bson;

namespace Registers.Api.Controllers;
[ApiController]
[Route("Register/v1/api")]
public class RegistersControllers : ControllerBase
{
    private readonly RegistersService _registersService;
    private readonly ITokenService _tokenService;

    public RegistersControllers(RegistersService registersService, ITokenService tokenService)
    {
        _registersService = registersService;
        _tokenService = tokenService;
    }

    [Authorize]
    [HttpGet]
    [Route("GetAll")]
    public async Task<IActionResult> GetRegisters()
    {
        var registers = await _registersService.GetAllRegistersAsync();
        return Ok(registers);
    }

    [Authorize]
    [HttpGet]
    [Route("GetById")]
    public async Task<IActionResult> GetByid(string id)
    {
        try
        {
            var register = await _registersService.GetByIdRegisterAsync(id);
            if (register != null)
            {
                return Ok(register);
            }
            else
            {
                return BadRequest("User Not Found");
            }
        }
        catch (FormatException ex)
        {
            return BadRequest("Invalid user ID format");
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while processing the request");
        }
    }

    [Authorize]
    [HttpGet]
    [Route("GetByUsername")]
    public async Task<IActionResult> GetByUsername(string username)
    {

        var register = await _registersService.GetByUsernameAsync(username);
        if (register != null)
        {
            return Ok(register);
        }
        else
        {
            return BadRequest("User Not Found");
        }


    }

    [Authorize]
    [HttpGet]
    [Route("ProfileImg")]
    public async Task<IActionResult> CreatePost(string username)
    {
        var User = await _registersService.GetByUsernameAsync(username);
        if (User == null) return NotFound("User Not Found");
        return Ok(User.ProfileImg);
    }

    [Authorize]
    [HttpDelete]
    [Route("DeleteRegister")]

    public async Task<IActionResult> DeleteRegister(string id)
    {
        try
        {
            var register = await _registersService.GetByIdRegisterAsync(id);
            if (register != null)
            {
                await _registersService.DeleteUser(id);
                return Ok();
            }
            else
            {
                return BadRequest("User Not Found");
            }
        }
        catch (FormatException ex)
        {
            return BadRequest("Invalid user ID format");
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while processing the request");
        }
    }

    [Authorize]
    [HttpPatch]
    [Route("UpdateRegister")]
    public async Task<IActionResult> PatchAsync(string id, [FromBody] Register register)
    {
        var result = await _registersService.GetByIdRegisterAsync(id);
        if (result != null)
        {
            try
            {
                _registersService.UpdateRegister(id, register);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while updating the register.", Details = ex.Message });
            }
        }
        return BadRequest("User Not Found");
    }



    [Authorize]
    [HttpPost]
    [Route("CreateRegister")]

    public async Task<IActionResult> PostRegister(Register register)
    {
        try
        {
            await _registersService.AddRegister(register);
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, register.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, register.Username)
            };

            var token = _tokenService.GenerateJwtToken(claims);

            return Ok(new { token });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> LoginUser([FromBody] Login login)
    {
        var user = await _registersService.Login(login.Username, login.Password);

        if (user == null)
        {
            return Unauthorized("The username or password is incorrect.");
        }


        var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, login.Username),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.Name, login.Username)
            };

        var token = _tokenService.GenerateJwtToken(claims);

        return Ok(new { token });
    }





}