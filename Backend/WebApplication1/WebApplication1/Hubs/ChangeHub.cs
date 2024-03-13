using Microsoft.AspNetCore.SignalR;
using WebApplication1.Modals;

namespace WebApplication1.Hubs
{
    public class ChangeHub : Hub
    {
        private static List<Change> _changes;

        public ChangeHub()
        {
            if (_changes == null) _changes = new List<Change>();

        }
        public Task Connect(string change)
        {
            string ChangeId = Context.ConnectionId;
            if (!_changes.Any(x => x.Id == ChangeId))
            {
                _changes.Add(new Change()
                {
                    Id = ChangeId,
                    change = change
                });
            }
            Clients.All.SendAsync("getChange", _changes);
            return Task.CompletedTask;
        }
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            string ChangeId = Context.ConnectionId;
            var change = _changes.FirstOrDefault(x => x.Id == ChangeId);
            if (change != null)
            {
                _changes.Remove(change);
            }
            Clients.All.SendAsync("getChange", _changes);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
