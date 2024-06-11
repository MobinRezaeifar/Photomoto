using Registers.Domain.Entities;

namespace Registers.Domain.Repositories.Interfaces;

public interface IRegisterRepository
{
    Task<IEnumerable<Register>> GetAllAsync();
    Task<Register> FindByUsernameAndPasswordAsync(string username, string encryptedPassword);


}