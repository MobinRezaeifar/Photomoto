using Posts.Domain.Entities;

namespace Posts.Domain.Repositories.Interfaces;

public interface IPostsRepository
{
    Task<IEnumerable<Post>> GetAllAsync(int pageNumber, int pageSize);
    Task AddAsync(Post post);
    Task DeleteAsync(string id);
    Task UpdateAsync(Post post);
    Task<Post> GetByIdAsync(string id);
    Task<IEnumerable<Post>> GetByOwner(string owner, int page, int pageSize);
    Task<IEnumerable<Post>> SearchByTag(string tag);



}