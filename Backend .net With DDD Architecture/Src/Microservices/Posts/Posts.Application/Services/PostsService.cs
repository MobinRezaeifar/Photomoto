using Posts.Domain.Entities;
using Posts.Domain.Repositories.Interfaces;

namespace Posts.Application.Services;
public class PostsService
{
    private readonly IPostsRepository _postsRepository;
    public PostsService(IPostsRepository postsRepository)
    {
        _postsRepository = postsRepository;
    }
    public async Task<IEnumerable<Post>> GetAllRegistersAsync()
    {
        return await _postsRepository.GetAllAsync();
    }
}