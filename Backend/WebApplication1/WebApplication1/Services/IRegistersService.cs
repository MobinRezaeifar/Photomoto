using WebApplication1.Models;

namespace WebApplication1.Services
{
    public interface IRegistersService
    {
        List<Registers> Get();
        Registers Get(string id);
        Registers Create (Registers registers);
        void Update (string id, Registers registers);
        void Remove (string id);
    }
}
