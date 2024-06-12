using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Messages.Application.Services;
using Messages.Domain.Entities;

namespace Messages.Api.Controllers;

[ApiController]
[Route("Message/v1/api")]
public class MessagesController : ControllerBase
{
    private readonly MessagesServices _messagesServices;

    public MessagesController(MessagesServices messagesServices)
    {
        _messagesServices = messagesServices;
    }

    [Authorize]
    [HttpGet]
    [Route("GetAll")]
    public async Task<IActionResult> GetMessages([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var messages = await _messagesServices.GetAllMessagesAsync(pageNumber, pageSize);
        return Ok(messages);
    }


    [HttpGet]
    [Route("GetById")]
    public async Task<IActionResult> GetByidMessage(string id)
    {
        try
        {
            var messages = await _messagesServices.GetById(id);
            if (messages != null)
            {
                return Ok(messages);
            }
            else
            {
                return BadRequest("messages Not Found");
            }
        }
        catch (FormatException ex)
        {
            return BadRequest("Invalid messages ID format");
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while processing the request");
        }
    }


    [HttpDelete]
    [Route("DeleteMessage")]
    public async Task<IActionResult> DeleteMessage(string id)
    {
        try
        {
            var messages = await _messagesServices.GetById(id);
            if (messages != null)
            {
                await _messagesServices.DeleteMessage(id);
                return Ok();
            }
            else
            {
                return BadRequest("messages Not Found");
            }
        }
        catch (FormatException ex)
        {
            return BadRequest("Invalid messages ID format");
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while processing the request");
        }
    }

    [HttpPatch]
    [Route("UpdateMessage")]
    public async Task<IActionResult> PatchAsync(string id, [FromBody] Message message)
    {
        var result = await _messagesServices.GetById(id);
        if (result != null)
        {
            try
            {
                _messagesServices.UpdateMessage(id, message);
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
        return BadRequest("message Not Found");
    }


    [HttpPost]
    [Route("CreateMessage")]

    public async Task<IActionResult> PostMessage(Message message)
    {
        try
        {
            await _messagesServices.AddMessage(message);
            return Ok();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

}