using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Posts.Application.Services;

namespace Posts.Api.Controllers;

[ApiController]
[Route("Post/v1/api")]
public class PostsControllers : ControllerBase
{
    private readonly PostsService _postsService;

    public PostsControllers(PostsService postsService)
    {
        _postsService = postsService;
    }

    [Authorize]
    [HttpGet]
    [Route("GetAll")]
    public async Task<IActionResult> GetRegisters()
    {
        var post = await _postsService.GetAllRegistersAsync();
        return Ok(post);
    }

}