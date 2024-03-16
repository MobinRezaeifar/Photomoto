using System.Linq;
using System.Runtime.InteropServices.JavaScript;
using System.Text.Json.Nodes;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Win32;
using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using WebApplication1.Models;
using WebApplication1.Services;

[Route("api/[controller]")]
[ApiController]
public class MessagesController : ControllerBase
{
    private readonly IMessagesService _messageService;

    public MessagesController(IMessagesService messageService)
    {
        _messageService = messageService;
    }

    [HttpGet]
    public ActionResult<List<Messages>> Get()
    {
        return _messageService.Get();
    }

    [HttpGet("{id}")]
    public ActionResult<Messages> Get(string id)
    {
        var message = _messageService.Get(id);

        if (message == null)
        {
            return NotFound($"message with Id = {id} not found");
        }

        return message;
    }

    [HttpPost]
    public ActionResult<Messages> Post([FromBody] Messages message)
    {
        _messageService.Create(message);

        return CreatedAtAction(nameof(Get), new { id = message.Id }, message);
    }

    [HttpPut("{id}")]
    public ActionResult Put(string id, [FromBody] Messages message)
    {
        var existingMessages = _messageService.Get(id);

        if (existingMessages == null)
        {
            return NotFound($"message with Id = {id} not found");
        }

        _messageService.Update(id, message);

        return NoContent();
    }

    [HttpPatch("api/messages/{id}")]
    public IActionResult Patch(string id, [FromBody] Messages message)
    {
        var existingMessages = _messageService.Get(id);

        var updatedMessages = new Messages()
        {
            Id = message.Id,
            Media = message.Media != null ? message.Media : existingMessages.Media,
            Sender = message.Sender != null ? message.Sender : existingMessages.Sender,
            Recipient = message.Recipient != null ? message.Recipient : existingMessages.Recipient,
            Relationship =
                message.Relationship != null ? message.Relationship : existingMessages.Relationship,
        };

        if (existingMessages == null)
        {
            return NotFound($"message with Id = {id} not found");
        }

        _messageService.Update(id, updatedMessages);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public ActionResult Delete(string id)
    {
        var message = _messageService.Get(id);

        if (message == null)
        {
            return NotFound($"message with Id = {id} not found");
        }

        _messageService.Remove(message.Id);

        return Ok($"message with Id = {id} deleted");
    }
}
