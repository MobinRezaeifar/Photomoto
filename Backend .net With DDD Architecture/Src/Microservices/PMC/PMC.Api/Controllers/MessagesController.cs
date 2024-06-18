using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using PMC.Application.Services;
using PMC.Domain.Entities.Messages;

namespace PMC.Api.Controllers
{
    [ApiController]
    [Route("Message/v1/api")]
    public class MessagesController : ControllerBase
    {
        private readonly MessagesServices _messagesServices;

        public MessagesController(MessagesServices messagesServices)
        {
            _messagesServices = messagesServices;
        }

        // Get all messages paginated.
        [Authorize]
        [HttpGet]
        [Route("GetAll")]
        public async Task<IActionResult> GetMessages([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            var messages = await _messagesServices.GetAllMessagesAsync(pageNumber, pageSize);
            return Ok(messages);
        }

        // Get message by its ID.
        [Authorize]
        [HttpGet]
        [Route("GetById")]
        public async Task<IActionResult> GetMessageById(string id)
        {
            try
            {
                var message = await _messagesServices.GetById(id);
                if (message != null)
                {
                    return Ok(message);
                }
                else
                {
                    return BadRequest("Message not found");
                }
            }
            catch (FormatException ex)
            {
                return BadRequest("Invalid message ID format");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing the request");
            }
        }

        // Get messages between two users paginated.
        [Authorize]
        [HttpGet]
        [Route("relationship")]
        public async Task<IActionResult> GetMessagesByRelationship([FromQuery] string sender, [FromQuery] string recipient, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            if (page < 1 || pageSize < 1)
            {
                return BadRequest("Page and pageSize must be greater than 0.");
            }

            var messages = await _messagesServices.GetMessagesByRelationshipAsync(sender, recipient, page, pageSize);
            return Ok(messages);
        }

        // Delete a message by its ID.
        [Authorize]
        [HttpDelete]
        [Route("DeleteMessage")]
        public async Task<IActionResult> DeleteMessage(string id)
        {
            try
            {
                var message = await _messagesServices.GetById(id);
                if (message != null)
                {
                    await _messagesServices.DeleteMessage(id);
                    return Ok();
                }
                else
                {
                    return BadRequest("Message not found");
                }
            }
            catch (FormatException ex)
            {
                return BadRequest("Invalid message ID format");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while processing the request");
            }
        }

        // Update a message by its ID.
        [Authorize]
        [HttpPatch]
        [Route("UpdateMessage")]
        public async Task<IActionResult> UpdateMessage(string id, [FromBody] Message message)
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
                    return StatusCode(500, new { Message = "An error occurred while updating the record.", Details = ex.Message });
                }
            }
            return BadRequest("Message not found");
        }

        // Create a new message.
        [Authorize]
        [HttpPost]
        [Route("CreateMessage")]
        public async Task<IActionResult> CreateMessage(Message message)
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
}
