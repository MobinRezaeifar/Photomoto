using System.Text.Json;
using PUM.Domain.Entities.Connections;
using PUM.Domain.Repositories.Interfaces.Connections;
using StackExchange.Redis;
using Microsoft.Extensions.Configuration;

namespace PUM.Infrastructure.Repositories.Connections;

public class ConnectionsRepositories : IConnectionsRepository
{
    private readonly ConnectionMultiplexer _redis;
    private readonly IDatabase _db;

    // Constructor to initialize Redis connection
    public ConnectionsRepositories(IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Redis");
        _redis = ConnectionMultiplexer.Connect(connectionString);
        _db = _redis.GetDatabase();
    }

    // Retrieve all connections from Redis
    public async Task<List<Connection>> GetConnections()
    {
        var server = _redis.GetServer(_redis.GetEndPoints()[0]);
        var keys = server.Keys();
        var connections = new List<Connection>();

        // Iterate through all keys and retrieve connections
        foreach (var key in keys)
        {
            var connectionJson = await _db.StringGetAsync(key);
            if (connectionJson.HasValue)
            {
                var connection = JsonSerializer.Deserialize<Connection>(connectionJson);
                connections.Add(connection);
            }
        }

        return connections;
    }

    // Retrieve a specific connection by ID
    public async Task<Connection> GetConnection(string connectionId)
    {
        var connectionJson = await _db.StringGetAsync(connectionId);
        return connectionJson.HasValue ? JsonSerializer.Deserialize<Connection>(connectionJson) : null;
    }

    // Create a new connection and store it in Redis
    public async Task<Connection> CreateConnection(Connection connection)
    {
        var connectionJson = JsonSerializer.Serialize(connection);
        await _db.StringSetAsync(connection.Id, connectionJson);
        return connection;
    }

    // Delete a connection by ID from Redis
    public async Task DeleteConnection(string connectionId)
    {
        await _db.KeyDeleteAsync(connectionId);
    }

    // Update an existing connection in Redis
    public async void Update(Connection connection)
    {
        var connectionJson = JsonSerializer.Serialize(connection);
        await _db.StringSetAsync(connection.Id, connectionJson);
    }
}

