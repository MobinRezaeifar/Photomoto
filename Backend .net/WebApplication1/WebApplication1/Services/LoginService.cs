using MongoDB.Bson;
using MongoDB.Driver;
using Newtonsoft.Json.Linq;
using WebApplication1.Configuration;
using WebApplication1.Models;

public class LoginService : ILoginService
{
    private readonly IMongoCollection<Login> _login;

    public LoginService(IStoreDatabaseSettings settings, IMongoClient mongoClient)
    {
        var database = mongoClient.GetDatabase(settings.DatabaseName);
        _login = database.GetCollection<Login>(settings.LoginCollection);
    }

    public Login Create(Login login)
    {
        _login.InsertOne(login);
        return login;
    }
    

}
