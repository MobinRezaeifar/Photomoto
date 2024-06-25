using PPM.Domain.Entities;
using PPM.Domain.Repositories.Interfaces;

namespace PPM.Application.Services;
public class PostsService
{
    private readonly IPostsRepository _postsRepository;
    public PostsService(IPostsRepository postsRepository)
    {
        _postsRepository = postsRepository;
    }
    public async Task<IEnumerable<Post>> GetAllRegistersAsync(int pageNumber = 1, int pageSize = 10)
    {
        return await _postsRepository.GetAllAsync(pageNumber, pageSize);
    }
    public async Task<Post> GetById(string id)
    {
        return await _postsRepository.GetByIdAsync(id);
    }

    public async Task AddPost(Post post)
    {
        await _postsRepository.AddAsync(post);
    }

    public async Task UpdatePost(string id, Post post)
    {
        var result = await GetById(id);
        if (result == null)
        {
            throw new KeyNotFoundException($"post with Id = {id} not found");
        }

        result.PostMedia = post.PostMedia ?? result.PostMedia;
        result.Disc = post.Disc ?? result.Disc;
        result.Owner = post.Owner ?? result.Owner;

        if (post.Likes != null && post.Likes.Any())
        {
            result.Likes = post.Likes;
        }

        result.Type = post.Type ?? result.Type;
        result.Time = post.Time ?? result.Time;

        if (post.Comment != null && post.Comment.Any())
        {
            result.Comment = post.Comment;
        }

        if (post.Tags != null && post.Tags.Any())
        {
            result.Tags = post.Tags;
        }

        await _postsRepository.UpdateAsync(result);
    }


    public async Task DeletePost(string id)
    {
        await _postsRepository.DeleteAsync(id);
    }

    public async Task<IEnumerable<Post>> GetByOwnerPost(string owner, int pageNumber = 1, int pageSize = 10)
    {
        return await _postsRepository.GetByOwner(owner, pageNumber, pageSize);
    }


    public async Task<int> GetCountPost(string owner)
    {
        return await _postsRepository.GetCountPost(owner);
    }
    public async Task<IEnumerable<Post>> SearchByTagPost(string? tag)
    {
        return await _postsRepository.SearchByTag(tag);
    }


    public async Task DeleteAllAsync()
    {
        await _postsRepository.DeleteAllAsync();
    }

}