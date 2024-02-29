﻿using MongoDB.Driver;
using WebApplication1.Configuration;
using WebApplication1.Models;

namespace WebApplication1.Services
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

        public List<Posts> Get()
        {
            return _posts.Find(posts => true).ToList();
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
    }
}
