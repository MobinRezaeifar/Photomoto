using PUM.Domain.Entities.Connections;
namespace PUM.Domain.Repositories.Interfaces.Connections;
public interface IConnectionsRepository
{
    Task<List<Connection>> GetConnections();
    Task<List<RecommendationConnection>> GetRecommendationConnection(string username);
    Task<Connection> GetConnection(string connectionId);
    Task<Connection> CreateConnection(Connection connection);
    Task DeleteConnection(string connectionId);
    void Update(Connection connection);
}