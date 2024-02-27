namespace WebApplication1.Configuration
{
    public class StoreDatabaseSettings : IStoreDatabaseSettings
    {
        public string RegistersCollection { get; set; } = string.Empty;
        public string ListNotesCollection { get; set; } = string.Empty;
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName { get; set; } = string.Empty;
    }
}
