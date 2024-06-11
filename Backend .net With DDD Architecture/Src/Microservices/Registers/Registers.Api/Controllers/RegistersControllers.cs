using Registers.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Registers.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Registers.Utils;

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


    [Authorize]
    [HttpPost]
    [Route("CreateRegister")]

    public async Task<IActionResult> PostRegister(Register register)
    {
        try
        {
            await _registersService.AddRegister(register);
            return CreatedAtAction(nameof(GetByid), new { id = register.Id }, register);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }

    }

}