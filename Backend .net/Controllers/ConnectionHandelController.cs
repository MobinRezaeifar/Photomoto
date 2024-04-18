using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConnectionHandelController : ControllerBase
    {
        private readonly IConnectionHandelService _ConnectionHandelService;

        public ConnectionHandelController(IConnectionHandelService ConnectionHandelService)
        {
            _ConnectionHandelService = ConnectionHandelService;
        }

        [HttpGet]
        public async Task<ActionResult<List<ConnectionHandel>>> GetConnections()
        {
            var connections = await _ConnectionHandelService.GetConnections();

            return connections;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ConnectionHandel>> GetConnection(string id)
        {
            var connection = await _ConnectionHandelService.GetConnection(id);

            return connection ?? new ConnectionHandel(id);
        }

        [HttpPost]
        public async Task<ActionResult<ConnectionHandel>> CteateConnection(
            ConnectionHandel connection
        )
        {
            var createdConnection = await _ConnectionHandelService.CteateConnection(connection);

            if (createdConnection is null)
                return BadRequest("Failed TO Save");

            return createdConnection;
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteConnection(string connectionId)
        {
            var result = await _ConnectionHandelService.DeleteConnection(connectionId);

            if (result)
                return Ok("The user Has Been Deleted");

            return BadRequest("Failed To Delete user");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateConnection(
            string id,
            ConnectionHandel updatedConnection
        )
        {
            _ConnectionHandelService.Update(id, updatedConnection);
            return NoContent();
        }
    }
}
