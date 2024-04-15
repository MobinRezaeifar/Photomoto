using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Services;

namespace WebApplication2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OnlineUsersController : ControllerBase
    {
        private readonly IOnlineUsersService _onlineUsers;

        public OnlineUsersController(IOnlineUsersService onlineUsers)
        {
            _onlineUsers = onlineUsers;
        }

        [HttpGet]
        public async Task<ActionResult<List<OnlineUser>>> GetUsers()
        {
            var users = await _onlineUsers.GetUsers();

            return users;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OnlineUser>> GetUser(string id)
        {
            var user = await _onlineUsers.GetUser(id);

            return user ?? new OnlineUser(id);
        }

        [HttpPost]
        public async Task<ActionResult<OnlineUser>> CreateUser(OnlineUser user)
        {
            var createdUser = await _onlineUsers.CteateUser(user);

            if (createdUser is null)
                return BadRequest("Failed TO Save");

            return createdUser;
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteUser(string userId)
        {
            var result = await _onlineUsers.DeleteUser(userId);

            if (result)
                return Ok("The user Has Been Deleted");

            return BadRequest("Failed To Delete user");
        }
    }
}
