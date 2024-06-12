using Messages.Domain.Entities;
namespace Messages.Domain.Repositories.Interfaces;

public interface IMessagesRepository
{
    Task<IEnumerable<Message>> GetAllAsync(int pageNumber, int pageSize);
    Task AddAsync(Message message);
    Task<Message> GetByIdAsync(string id);
    Task UpdateAsync(Message message);
    Task DeleteAsync(string id);
    Task<IEnumerable<Message>> GetMessagesByRelationshipAsync(string sender, string recipient, int page, int pageSize);

}

