using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PUM.Application.Services.Connections;
using PUM.Domain.Entities.Connections;
using PUM.Domain.Entities.Registers;

namespace PUM.Api.Controllers.Connections;

[Route("Connection/v1/api")]
[ApiController]
public class ConnectionsController : ControllerBase
{
    private readonly ConnectionService _connectionService;

    public ConnectionsController(ConnectionService connectionService)
    {
        _connectionService = connectionService;
    }

    [Authorize]
    [HttpGet]
    [Route("GetAll")]
    public async Task<IActionResult> GetConnections()
    {
        var connections = await _connectionService.GetConnections();
        return Ok(connections);
    }

    [Authorize]
    [HttpGet]
    [Route("GetById")]
    public async Task<IActionResult> GetConnection(string id)
    {
        var connection = await _connectionService.GetConnection(id);
        if (connection == null)
            return NotFound();
        return Ok(connection);
    }


    [Authorize]
    [HttpGet]
    [Route("recommendation")]
    public async Task<ActionResult<List<RecommendationConnection>>> GetRecommendationConnection(string username)
    {
        try
        {
            var recommendedConnections = await _connectionService.GetRecommendationConnection(username);
            return Ok(recommendedConnections);
        }
        catch (Exception ex)
        {
            if (ex.Message == "User not found")
            {
                return NotFound(ex.Message);
            }
            return StatusCode(500, "Internal server error");
        }
    }

    [Authorize]
    [HttpGet]
    [Route("relations")]
    public async Task<IActionResult> GetRelationConnection(string username)
    {
        var relations = await _connectionService.GetRelationConnection(username);
        return Ok(relations);
    }

    [Authorize]
    [HttpPost]
    [Route("CreateConnection")]
    public async Task<IActionResult> CreateConnection(Connection connection)
    {
        var createdConnection = await _connectionService.CreateConnection(connection);
        return CreatedAtAction(nameof(GetConnection), new { id = createdConnection.Id }, createdConnection);
    }

    [Authorize]
    [HttpDelete]
    [Route("DeleteConnection")]
    public async Task<IActionResult> DeleteConnection(string id)
    {
        var result = await _connectionService.GetConnection(id);
        if (result == null)
        {
            return NotFound("Connection Not Found");
        }

        await _connectionService.DeleteConnection(id);
        return Ok();

    }

    [Authorize]
    [HttpPatch]
    [Route("UpdateConnection")]
    public async Task<IActionResult> UpdateConnection(string id, Connection connection)
    {
        if (id != connection.Id)
            return BadRequest();

        await _connectionService.UpdateConnection(connection);
        return NoContent();
    }
}