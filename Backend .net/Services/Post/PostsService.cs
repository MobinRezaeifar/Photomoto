using MongoDB.Driver;
using WebApplication1.Configuration;
using WebApplication1.Models;

namespace WebApplication1.Services.Post
{
    public class PostsService : IPostsService
    {
        private readonly IMongoCollection<Posts> _posts;

        public PostsService(IStoreDatabaseSettings settings, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(settings.DatabaseName);
            _posts = database.GetCollection<Posts>(settings.PostsCollection);
        }

        public Posts Create(Posts posts)
        {
            _posts.InsertOne(posts);
            return posts;
        }

        public List<Posts> Get(int pageNumber = 1, int pageSize = 10)
        {
            return _posts.Find(posts => true)
                         .Skip((pageNumber - 1) * pageSize)
                         .Limit(pageSize)
                         .ToList();
        }



        public Posts Get(string id)
        {
            return _posts.Find(posts => posts.Id == id).FirstOrDefault();
        }

        public void Remove(string id)
        {
            _posts.DeleteOne(posts => posts.Id == id);
        }

        public void Update(string id, Posts posts)
        {
            _posts.ReplaceOne(posts => posts.Id == id, posts);
        }
        public List<Posts> SearchByTag(string? tag)
        {
            var filter = Builders<Posts>.Filter.Regex("Tags", new MongoDB.Bson.BsonRegularExpression($"^{tag}"));
            if (filter != null)
            {
                return _posts.Find(filter).ToList();
            }
            return new List<Posts>();
        }
        public List<Posts> SearchByOwner(string owner)
        {
            var filter = Builders<Posts>.Filter.Eq("Owner", owner);
            return _posts.Find(filter).ToList();
        }
    }
}
