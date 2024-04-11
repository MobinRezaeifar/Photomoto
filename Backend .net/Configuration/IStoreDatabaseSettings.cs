namespace WebApplication1.Configuration
{
    public interface IStoreDatabaseSettings
    {
        string RegistersCollection { get; set; }
        string PostsCollection { get; set; }
        string LoginCollection { get; set; }
        string MessagesCollection { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}
