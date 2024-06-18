using PMC.Domain.Repositories.Interfaces;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using PMC.Infrastructure.Configuration;
using PMC.Domain.Entities.Messages;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PMC.Infrastructure.Repositories
{
    // Implementation of IMessagesRepository
    public class MessagesRepository : IMessagesRepository
    {
        private readonly IMongoCollection<Message> _messages;

        // Constructor for MessagesRepository
        public MessagesRepository(IOptions<MongoDBSettings> settings)
        {
            // Initializing MongoDB client and getting collection
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.DatabaseName);
            _messages = database.GetCollection<Message>("Messages");
        }

        // Get all messages with pagination
        public async Task<IEnumerable<Message>> GetAllAsync(int pageNumber, int pageSize)
        {
            return await _messages.Find(messages => true)
                                  .Skip((pageNumber - 1) * pageSize)
                                  .Limit(pageSize)
                                  .ToListAsync();
        }

        // Add a new message
        public async Task AddAsync(Message message)
        {
            await _messages.InsertOneAsync(message);
        }

        // Get message by ID
        public async Task<Message> GetByIdAsync(string id)
        {
            return await _messages.Find(x => x.Id == id).FirstOrDefaultAsync();
        }

        // Update a message
        public async Task UpdateAsync(Message message)
        {
            await _messages.ReplaceOneAsync(x => x.Id == message.Id, message);
        }

        // Delete a message by ID
        public async Task DeleteAsync(string id)
        {
            await _messages.DeleteOneAsync(x => x.Id == id);
        }

        // Get messages by sender and recipient with pagination
        public async Task<IEnumerable<Message>> GetMessagesByRelationshipAsync(string sender, string recipient, int page, int pageSize)
        {
            var filter = Builders<Message>.Filter.Or(
                Builders<Message>.Filter.Eq(m => m.Relationship, $"{sender},{recipient}"),
                Builders<Message>.Filter.Eq(m => m.Relationship, $"{recipient},{sender}")
            );

            return await _messages.Find(filter)
                                  .Skip((page - 1) * pageSize)
                                  .Limit(pageSize)
                                  .ToListAsync();
        }
    }
}
