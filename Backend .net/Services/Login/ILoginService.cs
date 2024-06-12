using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using WebApplication1.Models;

public interface ILoginService
{
    Login Create(Login login);
}
