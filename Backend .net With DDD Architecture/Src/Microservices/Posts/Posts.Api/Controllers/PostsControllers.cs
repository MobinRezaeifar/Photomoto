using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Posts.Application.Services;
using Posts.Domain.Entities;

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
    public async Task<IActionResult> GetPosts([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var post = await _postsService.GetAllRegistersAsync(pageNumber, pageSize);
        return Ok(post);
    }


    [Authorize]
    [HttpGet]
    [Route("GetById")]
    public async Task<IActionResult> GetByid(string id)
    {
        try
        {
            var post = await _postsService.GetById(id);
            if (post != null)
            {
                return Ok(post);
            }
            else
            {
                return BadRequest("post Not Found");
            }
        }
        catch (FormatException ex)
        {
            return BadRequest("Invalid post ID format");
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while processing the request");
        }
    }


    [Authorize]
    [HttpGet]
    [Route("Owner")]
    public async Task<IActionResult> GetByOwnerPost([FromQuery] string owner, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        if (page < 1 || pageSize < 1)
        {
            return BadRequest("Page and pageSize must be greater than 0.");
        }

        var post = await _postsService.GetByOwnerPost(owner, page, pageSize);
        return Ok(post);
    }
    // [Authorize]
    [HttpGet]
    [Route("tag")]
    public async Task<IActionResult> SearchByTagPost([FromQuery] string? tag)
    {
        var posts = await _postsService.SearchByTagPost(tag);
        if (posts == null || !posts.Any())
        {
            return NotFound("No posts found with the given tag.");
        }
        return Ok(posts);
    }


    [Authorize]
    [HttpDelete]
    [Route("DeletePost")]
    public async Task<IActionResult> DeletePost(string id)
    {
        try
        {
            var post = await _postsService.GetById(id);
            if (post != null)
            {
                await _postsService.DeletePost(id);
                return Ok();
            }
            else
            {
                return BadRequest("post Not Found");
            }
        }
        catch (FormatException ex)
        {
            return BadRequest("Invalid post ID format");
        }
        catch (Exception ex)
        {
            return StatusCode(500, "An error occurred while processing the request");
        }
    }

    [Authorize]
    [HttpPatch]
    [Route("UpdatePost")]
    public async Task<IActionResult> PatchAsync(string id, [FromBody] Post post)
    {
        var result = await _postsService.GetById(id);
        if (result != null)
        {
            try
            {
                _postsService.UpdatePost(id, post);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while updating the post.", Details = ex.Message });
            }
        }
        return BadRequest("post Not Found");
    }


    [Authorize]
    [HttpPost]
    [Route("CreatePost")]
    public async Task<IActionResult> CreatePost(Post post)
    {
        try
        {
            await _postsService.AddPost(post);
            return Ok();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }




}