using Microsoft.AspNetCore.SignalR;
using PMC.Domain.Entities.OnlineUsers;


namespace PMC.Application.Hubs
{
    public class OnlineUsers : Hub
    {
        private static List<OnlineUser> _onlineUserChat;
        public OnlineUsers()
        {
            if (_onlineUserChat == null) _onlineUserChat = new List<OnlineUser>();
        }

        public Task Connect(string userName)
        {
            string clientId = Context.ConnectionId;

            if (!_onlineUserChat.Any(x => x.Id == clientId))
            {
                _onlineUserChat.Add(new OnlineUser()
                {
                    Id = clientId,
                    Username = userName,
                });
            }

            Clients.All.SendAsync("getOnlineUsers", _onlineUserChat);
            return Task.CompletedTask;
        }
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            string clientId = Context.ConnectionId;
            var user = _onlineUserChat.FirstOrDefault(x => x.Id == clientId);
            if (user != null)
                _onlineUserChat.Remove(user);

            Clients.All.SendAsync("getOnlineUsers", _onlineUserChat);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
