using System.Text.Json;
using PUM.Domain.Entities.Connections;
using PUM.Domain.Repositories.Interfaces.Connections;
using StackExchange.Redis;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using PUM.Domain.Entities.Registers;
using Microsoft.Extensions.Options;
using PUM.Infrastructure.Configuration;

namespace PUM.Infrastructure.Repositories.Connections;

public class ConnectionsRepositories : IConnectionsRepository
{
    private readonly ConnectionMultiplexer _redis;
    private readonly IDatabase _db;
    private readonly IMongoCollection<Register> _register;
    // Constructor to initialize Redis connection
    public ConnectionsRepositories(IConfiguration configuration, IOptions<MongoDBSettings> settings)
    {
        var connectionString = configuration.GetConnectionString("Redis");
        _redis = ConnectionMultiplexer.Connect(connectionString);
        _db = _redis.GetDatabase();
        // 
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _register = database.GetCollection<Register>("Registers");
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

        // Sort connections by time
        connections = connections.OrderBy(c => DateTime.Parse(c.Time)).ToList();

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

    public async Task<List<RecommendationConnection>> GetRecommendationConnection(string username)
    {
        var allConnections = await GetConnections();
        var allRegisters = await _register.Find(_ => true).ToListAsync();
        var result = await _register.Find(r => r.Username == username).FirstOrDefaultAsync();
        if (result == null)
        {
            throw new Exception("User not found");
        }
        var connectedUsers = new HashSet<string>();

        foreach (var connection in allConnections)
        {
            var relation = connection.Relation.Split(',');
            if (relation[0] == username)
            {
                connectedUsers.Add(relation[1]);
            }
            else if (relation[1] == username)
            {
                connectedUsers.Add(relation[0]);
            }
        }

        var recommendedUsers = allRegisters
            .Where(register => register.Username != username && !connectedUsers.Contains(register.Username))
            .Select(register => new RecommendationConnection
            {
                Username = register.Username,
                ProfileImg = register.ProfileImg
            })
            .ToList();

        return recommendedUsers;
    }

}

