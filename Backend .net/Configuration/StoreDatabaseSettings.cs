﻿namespace WebApplication1.Configuration
{
    public class StoreDatabaseSettings : IStoreDatabaseSettings
    {
        public string RegistersCollection { get; set; } = string.Empty;
        public string MessagesCollection { get; set; } = string.Empty;
        public string LoginCollection { get; set; } = string.Empty;
        public string PostsCollection { get; set; } = string.Empty;
        public string ConnectionString { get; set; } = string.Empty;
        public string DatabaseName { get; set; } = string.Empty;
    }
}