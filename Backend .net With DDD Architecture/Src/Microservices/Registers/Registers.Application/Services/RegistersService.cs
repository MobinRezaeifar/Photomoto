using Registers.Domain.Entities;
using Registers.Domain.Repositories.Interfaces;
using Registers.Infrastructure.Repositories;
using Registers.Utils;
namespace Registers.Application.Services;
public class RegistersService
{
    private readonly IRegisterRepository _registersRepositories;
    public RegistersService(IRegisterRepository registersRepositories)
    {
        _registersRepositories = registersRepositories;
    }

    public async Task<IEnumerable<Register>> GetAllRegistersAsync()
    {
        return await _registersRepositories.GetAllAsync();
    }
    public async Task<Register> Login(string username, string password)
    {
        var encryptedPassword = AesEncryption.Encrypt(password);
        return await _registersRepositories.FindByUsernameAndPasswordAsync(username, encryptedPassword);
    }
}