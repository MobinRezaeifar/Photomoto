namespace WebApplication1.Configuration
{
    public interface IStoreDatabaseSettings
    {
        string RegistersCollection { get; set; }
        string ListNotesCollection { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}
