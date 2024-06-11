using Registers.Application.Configuration;
using Registers.Domain.Entities;
using Registers.Domain.Repositories.Interfaces;
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
        return await _registersRepositories.LoginAsync(username, encryptedPassword);
    }

    public async Task<Register> GetByIdRegisterAsync(string id)
    {
        return await _registersRepositories.GetByIdAsync(id);
    }

    public async Task AddRegister(Register register)
    {

        var validator = new RegisterValidator();
        var validationResult = await validator.ValidateAsync(register);

        if (!validationResult.IsValid)
        {
            var errors = validationResult.Errors.Select(e => e.ErrorMessage);
            throw new ArgumentException(string.Join(" ", errors));
        }
        var UsernameExists = await _registersRepositories.UsernameExists(register.Username);
        var EmailExists = await _registersRepositories.EmailExists(register.Email);

        if (EmailExists != null && UsernameExists != null)
        {
            throw new ArgumentException("Username And Email Already Exists.");
        }
        else if (EmailExists != null)
        {
            throw new ArgumentException("Email Already Exists.");
        }
        else if (UsernameExists != null)
        {
            throw new ArgumentException("Username Already Exists.");
        }
        else
        {
            await _registersRepositories.AddAsync(register);
        }

    }

}