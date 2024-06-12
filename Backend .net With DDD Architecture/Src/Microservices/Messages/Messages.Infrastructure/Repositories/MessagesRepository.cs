using Messages.Domain.Repositories.Interfaces;
using Messages.Domain.Entities;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using Messages.Infrastructure.Configuration;

namespace Messages.Infrastructure.Repositories;

public class MessagesRepository : IMessagesRepository
{
    private readonly IMongoCollection<Message> _messages;

    public MessagesRepository(IOptions<MongoDBSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _messages = database.GetCollection<Message>("Messages");
    }

    public async Task<IEnumerable<Message>> GetAllAsync(int pageNumber, int pageSize)
    {
        return await _messages.Find(messages => true)
                 .Skip((pageNumber - 1) * pageSize)
                 .Limit(pageSize)
                 .ToListAsync();
    }

    public async Task AddAsync(Message message)
    {
        await _messages.InsertOneAsync(message);
    }

    public async Task<Message> GetByIdAsync(string id)
    {
        return await _messages.Find(x => x.Id == id).FirstOrDefaultAsync();
    }

    public async Task UpdateAsync(Message message)
    {
        await _messages.ReplaceOneAsync(x => x.Id == message.Id, message);
    }

    public async Task DeleteAsync(string id)
    {
        await _messages.DeleteOneAsync(x => x.Id == id);
    }

}