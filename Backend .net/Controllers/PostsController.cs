using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using WebApplication1.Models;
using WebApplication1.Services.Post;

namespace WebApplication1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IPostsService _postsService;

        public PostsController(IPostsService postsService)
        {
            _postsService = postsService;
        }

        [HttpGet]
        public ActionResult<List<Posts>> Get([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            return _postsService.Get(pageNumber, pageSize);
        }

        [HttpGet("{id}")]
        public ActionResult<Posts> Get(string id)
        {
            var post = _postsService.Get(id);

            if (post == null)
            {
                return NotFound($"post with Id = {id} not found");
            }

            return post;
        }

        [HttpPost]
        public ActionResult<Posts> Post([FromBody] Posts posts)
        {
            _postsService.Create(posts);

            return CreatedAtAction(nameof(Get), new { id = posts.Id }, posts);
        }

        [HttpPut("{id}")]
        public ActionResult Put(string id, [FromBody] Posts posts)
        {
            var existingRegister = _postsService.Get(id);

            if (existingRegister == null)
            {
                return NotFound($"post with Id = {id} not found");
            }

            _postsService.Update(id, posts);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var post = _postsService.Get(id);

            if (post == null)
            {
                return NotFound($"post with Id = {id} not found");
            }

            _postsService.Remove(post.Id);

            return Ok($"post with Id = {id} deleted");
        }

        [HttpGet("search")]
        public ActionResult<List<Posts>> SearchByTag([FromQuery] string? tag)
        {
            var posts = _postsService.SearchByTag(tag);

            if (posts == null || posts.Count == 0)
            {
                return NotFound(new { Message = "No posts found with the given tag." });
            }

            return Ok(posts);
        }
    }
}
