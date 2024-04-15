using WebApplication1.Models;

public interface IConnectionHandelService
{
    Task<List<ConnectionHandel>> GetConnections();
    Task<ConnectionHandel> GetConnection(string connectionId);
    Task<ConnectionHandel> CteateConnection(ConnectionHandel connectionHandel);
    Task<bool> DeleteConnection(string connectionId);
}
