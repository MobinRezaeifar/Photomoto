using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using WebApplication1.Configuration;
using WebApplication1.Models;

namespace WebApplication1.Services

{
    public class RegistersService : IRegistersService
    {
        private readonly IMongoCollection<Registers> _register;

        public RegistersService(IStoreDatabaseSettings settings, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(settings.DatabaseName);
            _register = database.GetCollection<Registers>(settings.RegistersCollection);
        } 

        public Registers Create(Registers register)
        {
            _register.InsertOne(register);
            return register;
        }

        public List<Registers> Get()
        {
            return _register.Find(register => true).ToList();
        }

        public Registers Get(string id)
        {
            return _register.Find(register => register.Id == id).FirstOrDefault();
        }

        public void Remove(string id)
        {
            _register.DeleteOne(register => register.Id == id);
        }

        public void Update(string id, Registers register)
        {
            _register.ReplaceOne(register => register.Id == id, register);
        }

        public bool IsUsernameExists(string username)
        {
            bool exists = _register.Find(register => register.Username == username).Any();
            return exists;

        }

        public Task UpdateOne(BsonDocument bson, string id)
        {
            var filter = Builders<Registers>.Filter.Eq("_id", ObjectId.Parse(id));
            var update = new BsonDocument("$set", bson);
            return _register.UpdateOneAsync(filter, update);
        }
    }

}
