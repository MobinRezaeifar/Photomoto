using Microsoft.AspNetCore.SignalR;
using PMC.Domain.Entities.OnlineUsers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PMC.Application.Hubs
{
    public class OnlineUsers : Hub
    {
        private static List<OnlineUser> _onlineUserChat;

        public OnlineUsers()
        {
            // Initialize the list if it's null
            if (_onlineUserChat == null)
                _onlineUserChat = new List<OnlineUser>();
        }

        // Method to handle client connection
        public Task Connect(string userName)
        {
            string clientId = Context.ConnectionId;

            // Add user if not already added
            if (!_onlineUserChat.Any(x => x.Id == clientId))
            {
                _onlineUserChat.Add(new OnlineUser()
                {
                    Id = clientId,
                    Username = userName,
                });
            }

            // Send updated online users list to all clients
            Clients.All.SendAsync("getOnlineUsers", _onlineUserChat);
            return Task.CompletedTask;
        }

        // Method to handle client disconnection
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            string clientId = Context.ConnectionId;
            var user = _onlineUserChat.FirstOrDefault(x => x.Id == clientId);
            if (user != null)
                _onlineUserChat.Remove(user);

            // Send updated online users list to all clients
            Clients.All.SendAsync("getOnlineUsers", _onlineUserChat);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
