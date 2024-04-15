using WebApplication1.Models;

public interface IOnlineUsersService
{
    Task<List<OnlineUser>> GetUsers();
    Task<OnlineUser> GetUser(string userId);
    Task<OnlineUser> CteateUser(OnlineUser user);
    Task<bool> DeleteUser(string userId);
}
