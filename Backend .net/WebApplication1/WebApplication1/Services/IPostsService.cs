using WebApplication1.Models;

namespace WebApplication1.Services
{
    public interface IPostsService
    {
        List<Posts> Get();
        Posts Get(string id);
        Posts Create(Posts posts);
        void Update(string id, Posts posts);
        void Remove(string id);
    }
}
