using System.Text.Json;
using StackExchange.Redis;
using WebApplication1.Models;

public class ConnectionHandelService : IConnectionHandelService
{
    private readonly IDatabase _redisDb;

    public ConnectionHandelService(IConnectionMultiplexer redis)
    {
        _redisDb = redis.GetDatabase();
    }

    public async Task<List<ConnectionHandel>> GetConnections()
    {
        var keys = await _redisDb.ExecuteAsync("KEYS", "*");
        var connections = new List<ConnectionHandel>();

        foreach (var key in (string[])keys)
        {
            var connectionJson = await _redisDb.StringGetAsync(key);
            var connection = JsonSerializer.Deserialize<ConnectionHandel>(connectionJson);
            connections.Add(connection);
        }

        return connections;
    }

    public async Task<ConnectionHandel> GetConnection(string connectionId)
    {
        var connection = await _redisDb.StringGetAsync(connectionId);
        return connection.IsNull ? null : JsonSerializer.Deserialize<ConnectionHandel>(connection);
    }

    public async Task<ConnectionHandel> CteateConnection(ConnectionHandel connection)
    {
        var updateOrCreateBasket = await _redisDb.StringSetAsync(
            connection.Id,
            JsonSerializer.Serialize(connection),
            TimeSpan.FromDays(30)
        );
        if (updateOrCreateBasket)
            return await GetConnection(connection.Id);
        return null;
    }

    public async Task<bool> DeleteConnection(string connectionId)
    {
        return await _redisDb.KeyDeleteAsync(connectionId);
    }
}
