using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using WebApplication1.Configuration;
using WebApplication1.Models;

namespace WebApplication1.Services.Register
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

        public void Patch(string id, JObject changes)
        {
            var filter = Builders<Registers>.Filter.Eq("Id", ObjectId.Parse(id));
            var update = Builders<Registers>.Update.Set(
                "Username",
                changes["Username"]?.ToString()
            );
            _register.UpdateOne(filter, update);
        }
        public Registers GetUserByUsernameAndPassword(string username, string password)
        {
            return _register.Find(user => user.Username == username && user.Password == password).FirstOrDefault();
        }
    }
}
