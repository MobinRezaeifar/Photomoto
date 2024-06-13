
using MongoDB.Driver;
using Posts.Domain.Entities;
using Posts.Domain.Repositories.Interfaces;
using Posts.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace Posts.Infrastructure.Repositories;
public class PostsRepository : IPostsRepository
{
    private readonly IMongoCollection<Post> _posts;
    public PostsRepository(IOptions<MongoDBSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _posts = database.GetCollection<Post>("Posts");
    }
    public async Task<IEnumerable<Post>> GetAllAsync()
    {
        return await _posts.Find(p => true).ToListAsync();
    }
}