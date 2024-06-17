using Registers.Domain.Entities.Connections;
namespace Registers.Domain.Repositories.Interfaces.Connections;
public interface IConnectionsRepository
{
    Task<List<Connection>> GetConnections();
    Task<Connection> GetConnection(string connectionId);
    Task<Connection> CreateConnection(Connection connection);
    Task DeleteConnection(string connectionId);
    void Update(Connection connection);
}