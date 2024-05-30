using WebApplication1.Models;

namespace WebApplication1.Services.Post
{
    public interface IPostsService
    {
        List<Posts> Get();
        Posts Get(string id);
        Posts Create(Posts posts);
        void Update(string id, Posts posts);
        void Remove(string id);
        List<Posts> SearchByTag(string tag); 
    }
}
