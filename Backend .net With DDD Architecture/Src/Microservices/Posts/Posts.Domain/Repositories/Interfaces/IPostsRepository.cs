using Posts.Domain.Entities;

namespace Posts.Domain.Repositories.Interfaces;

public interface IPostsRepository
{
    Task<IEnumerable<Post>> GetAllAsync();

}