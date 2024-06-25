using Microsoft.AspNetCore.SignalR;
using PMC.Domain.Entities.OnlineUsers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PMC.Application.Hubs
{
    public class Changes : Hub
    {
        private static List<Change> _changes;

        public Changes()
        {
            // Initialize the list of changes if it's null
            if (_changes == null)
                _changes = new List<Change>();
        }

        // Method to handle client connection
        public Task Connect(string change)
        {
            string ChangeId = Context.ConnectionId;

            // Add the change if it doesn't exist
            if (!_changes.Any(x => x.Id == ChangeId))
            {
                _changes.Add(new Change()
                {
                    Id = ChangeId,
                    change = change
                });
            }

            // Send the list of changes to all clients
            Clients.All.SendAsync("getChange", _changes);
            return Task.CompletedTask;
        }

        // Method to handle client disconnection
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            string ChangeId = Context.ConnectionId;

            // Remove the disconnected client from the list of changes
            var change = _changes.FirstOrDefault(x => x.Id == ChangeId);
            if (change != null)
            {
                _changes.Remove(change);
            }

            // Send the updated list of changes to all clients
            Clients.All.SendAsync("getChange", _changes);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
