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
    public async Task<IEnumerable<Post>> GetAllAsync(int pageNumber, int pageSize)
    {
        return await _posts.Find(post => true)
                 .Skip((pageNumber - 1) * pageSize)
                 .Limit(pageSize)
                 .ToListAsync();
    }
    public async Task AddAsync(Post post)
    {
        await _posts.InsertOneAsync(post);
    }
    public async Task<Post> GetByIdAsync(string id)
    {
        return await _posts.Find(x => x.Id == id).FirstOrDefaultAsync();
    }
    public async Task DeleteAsync(string id)
    {
        await _posts.DeleteOneAsync(x => x.Id == id);
    }
    public async Task UpdateAsync(Post post)
    {
        await _posts.ReplaceOneAsync(x => x.Id == post.Id, post);
    }

    public async Task<IEnumerable<Post>> GetByOwner(string owner, int page, int pageSize)
    {
        return await _posts.Find(post => post.Owner == owner)
                           .Skip((page - 1) * pageSize)
                           .Limit(pageSize)
                           .ToListAsync();
    }


    public async Task<IEnumerable<Post>> SearchByTag(string? tag)
    {
        var filter = Builders<Post>.Filter.Regex("Tags", new MongoDB.Bson.BsonRegularExpression($"^{tag}"));
        if (filter != null)
        {
            return _posts.Find(filter).ToList();
        }
        return new List<Post>();
    }
}