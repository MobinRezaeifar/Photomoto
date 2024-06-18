using PMC.Domain.Entities;
using PMC.Domain.Repositories.Interfaces;

namespace PMC.Application.Services;

public class MessagesServices
{
    private readonly IMessagesRepository _messagesRepository;

    public MessagesServices(IMessagesRepository messagesRepository)
    {
        _messagesRepository = messagesRepository;
    }
    public async Task<IEnumerable<Message>> GetAllMessagesAsync(int pageNumber = 1, int pageSize = 10)
    {
        return await _messagesRepository.GetAllAsync(pageNumber, pageSize);

    }

    public async Task AddMessage(Message message)
    {
        await _messagesRepository.AddAsync(message);
    }

    public async Task<Message> GetById(string id)
    {
        return await _messagesRepository.GetByIdAsync(id);
    }
    public async Task DeleteMessage(string id)
    {
        await _messagesRepository.DeleteAsync(id);
    }


    public async Task UpdateMessage(string id, Message message)
    {
        var result = await _messagesRepository.GetByIdAsync(id);
        if (result == null)
        {
            throw new KeyNotFoundException($"Message with Id = {id} not found");
        }

        result.Media = message.Media ?? result.Media;
        result.Sender = message.Sender ?? result.Sender;
        result.Recipient = message.Recipient ?? result.Recipient;
        result.Relationship = message.Relationship ?? result.Relationship;
        result.Type = message.Type ?? result.Type;
        result.Time = message.Time ?? result.Time;
        result.Size = message.Size ?? result.Size;
        await _messagesRepository.UpdateAsync(result);
    }

    public async Task<IEnumerable<Message>> GetMessagesByRelationshipAsync(string sender, string recipient, int pageNumber = 1, int pageSize = 10)
    {
        return await _messagesRepository.GetMessagesByRelationshipAsync(sender, recipient, pageNumber, pageSize);
    }



}