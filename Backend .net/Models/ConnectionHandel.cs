public class ConnectionHandel
{
    public ConnectionHandel(string id)
    {
        Id = id;
    }

    public string Id { get; set; }
    public string Sender { get; set; }
    public string Receiver { get; set; }
    public string Time { get; set; }
    public string Status { get; set; }
}
