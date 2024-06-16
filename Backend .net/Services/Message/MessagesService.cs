using MongoDB.Driver;
using WebApplication1.Configuration;
using WebApplication1.Models;

public class MessagesService : IMessagesService
{
    private readonly IMongoCollection<Messages> _messages;

    public MessagesService(IStoreDatabaseSettings settings, IMongoClient mongoClient)
    {
        var database = mongoClient.GetDatabase(settings.DatabaseName);
        _messages = database.GetCollection<Messages>(settings.MessagesCollection); 
    }

    public Messages Create(Messages messages)
    {
        _messages.InsertOne(messages);
        return messages;
    }

    public List<Messages> Get(int pageNumber = 1, int pageSize = 10)
    {
        return _messages.Find(messages => true)
                         .Skip((pageNumber - 1) * pageSize)
                         .Limit(pageSize)
                         .ToList();
    }

    public Messages Get(string id)
    {
        return _messages.Find(messages => messages.Id == id).FirstOrDefault();
    }

    public void Remove(string id)
    {
        _messages.DeleteOne(messages => messages.Id == id);
    }

    public void Update(string id, Messages messages)
    {
        _messages.ReplaceOne(messages => messages.Id == id, messages);
    }
}
