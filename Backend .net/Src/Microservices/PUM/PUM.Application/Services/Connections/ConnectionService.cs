using PUM.Domain.Entities.Connections;
using PUM.Domain.Entities.Registers;
using PUM.Domain.Repositories.Interfaces.Connections;

namespace PUM.Application.Services.Connections;
public class ConnectionService
{
    private readonly IConnectionsRepository _connectionRepository;

    public ConnectionService(IConnectionsRepository connectionRepository)
    {
        _connectionRepository = connectionRepository;
    }

    public async Task<List<Connection>> GetConnections()
    {
        return await _connectionRepository.GetConnections();
    }

    public async Task<Connection> GetConnection(string connectionId)
    {
        return await _connectionRepository.GetConnection(connectionId);
    }

    public async Task<Connection> CreateConnection(Connection connection)
    {
        return await _connectionRepository.CreateConnection(connection);
    }

    public async Task DeleteConnection(string connectionId)
    {
        await _connectionRepository.DeleteConnection(connectionId);
    }

    public async Task UpdateConnection(Connection connection)
    {
        var result = await GetConnection(connection.Id);
        if (result == null)
        {
            throw new KeyNotFoundException($"connection with Id = {connection.Id} not found");
        }
        result.Sender = connection.Sender ?? result.Sender;
        result.Receiver = connection.Receiver ?? result.Receiver;
        result.Time = connection.Time ?? result.Time;
        result.Status = connection.Status ?? result.Status;
        result.Relation = connection.Relation ?? result.Relation;
        _connectionRepository.Update(result);
    }
    public async Task<List<RecommendationConnection>> GetRecommendationConnection(string username)
    {
        return await _connectionRepository.GetRecommendationConnection(username);
    }

    public async Task<List<Connection>> GetRelationConnection(string username, string status)
    {
        return await _connectionRepository.GetRelationConnection(username, status);
    }
}