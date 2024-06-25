using PUM.Domain.Entities.Registers;

namespace PUM.Domain.Repositories.Interfaces.Registers;

public interface IRegisterRepository
{
    Task<IEnumerable<Register>> GetAllAsync();
    Task<Register> LoginAsync(string username, string encryptedPassword);
    Task AddAsync(Register register);
    Task<Register> UsernameExists(string username);
    Task<Register> EmailExists(string email);
    Task<Register> GetByIdAsync(string id);
    Task<Register> GetByUsernameAsync(string username);
    Task DeleteAsync(string id);
    Task UpdateAsyncById(Register register);
    Task UpdateAsyncByUsername(Register register);
    Task DeleteAllRegistersAsync();

}