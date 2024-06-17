namespace Registers.Domain.Entities.Connections;

public class Connection
{
    public Connection(string id)
    {
        Id = id;
    }
    public string? Id { get; set; }
    public string? Sender { get; set; }
    public string? Receiver { get; set; }
    public string? Time { get; set; }
    public string? Status { get; set; }
    public string? Relation { get; set; }
} 