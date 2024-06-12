public class Token
{
    public string Id { get; set; }
    public string Username { get; set; }
    public IEnumerable<string> Roles { get; set; }
    public DateTime ExpiresAt { get; set; }
}
