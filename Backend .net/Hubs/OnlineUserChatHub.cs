using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebApplication1.Models;

namespace WebApplication1.Hubs
{
    public class OnlineUserChatHub : Hub
    {
        private static List<OnlineUserChat> _onlineUserChat;
        public OnlineUserChatHub()
        {
            if (_onlineUserChat == null) _onlineUserChat = new List<OnlineUserChat>();
        }

        public Task Connect(string userName)
        {
            string clientId = Context.ConnectionId;

            if (!_onlineUserChat.Any(x => x.Id == clientId))
            {
                _onlineUserChat.Add(new OnlineUserChat()
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
