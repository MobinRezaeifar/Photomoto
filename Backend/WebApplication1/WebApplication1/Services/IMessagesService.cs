using WebApplication1.Models;

public interface IMessagesService
{
    List<Messages> Get();
    Messages Get(string id);
    Messages Create(Messages messages);
    void Update(string id, Messages messages);
    void Remove(string id);
}
