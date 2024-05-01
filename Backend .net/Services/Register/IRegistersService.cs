using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using WebApplication1.Models;

namespace WebApplication1.Services.Register
{
    public interface IRegistersService
    {
        List<Registers> Get();
        Registers Get(string id);
        Registers Create(Registers registers);
        void Update(string id, Registers registers);
        void Remove(string id);
        bool IsUsernameExists(string username);
        void Patch(string id, JObject changes);
    }
}
