using System.Text.Json;
using StackExchange.Redis;
using WebApplication1.Models;

public class OnlineUsersService : IOnlineUsersService
{
    private readonly IDatabase _redisDb;

    public OnlineUsersService(IConnectionMultiplexer redis)
    {
        _redisDb = redis.GetDatabase();
    }

    public async Task<List<OnlineUser>> GetUsers()
    {
        var keys = await _redisDb.ExecuteAsync("KEYS", "*");
        var users = new List<OnlineUser>();

        foreach (var key in (string[])keys)
        {
            var userJson = await _redisDb.StringGetAsync(key);
            var user = JsonSerializer.Deserialize<OnlineUser>(userJson);
            users.Add(user);
        }

        return users;
    }

    public async Task<OnlineUser> GetUser(string userId)
    {
        var user = await _redisDb.StringGetAsync(userId);
        return user.IsNull ? null : JsonSerializer.Deserialize<OnlineUser>(user);
    }

    public async Task<OnlineUser> CteateUser(OnlineUser user)
    {
        var updateOrCreateBasket = await _redisDb.StringSetAsync(
            user.Id,
            JsonSerializer.Serialize(user),
            TimeSpan.FromDays(30)
        );
        if (updateOrCreateBasket)
            return await GetUser(user.Id);
        return null;
    }

    public async Task<bool> DeleteUser(string userId)
    {
        return await _redisDb.KeyDeleteAsync(userId);
    }
}
