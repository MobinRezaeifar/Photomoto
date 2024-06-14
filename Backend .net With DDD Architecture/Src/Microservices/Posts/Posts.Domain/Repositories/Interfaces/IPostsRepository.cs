using Posts.Domain.Entities;

namespace Posts.Domain.Repositories.Interfaces;

public interface IPostsRepository
{
    Task<IEnumerable<Post>> GetAllAsync();
    Task AddAsync(Post post);
    Task DeleteAsync(string id);
    Task UpdateAsync(Post post);
    Task<Post> GetByIdAsync(string id);

}