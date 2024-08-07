using Microsoft.IdentityModel.Tokens;
using PUM.Application.Configuration;
using PUM.Domain.Entities.Registers;
using PUM.Domain.Repositories.Interfaces.Registers;
using PUM.Utils;

namespace PUM.Application.Services.Registers;
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
    public async Task<Register> GetByUsernameAsync(string username)
    {
        return await _registersRepositories.GetByUsernameAsync(username);
    }

    public async Task DeleteUser(string id)
    {
        await _registersRepositories.DeleteAsync(id);
    }

    public async Task UpdateRegisterById(string id, Register register)
    {
        var result = await GetByIdRegisterAsync(id);
        if (result == null)
        {
            throw new KeyNotFoundException($"Register with Id = {id} not found");
        }

        result.Username = register.Username ?? result.Username;
        result.Bio = register.Bio ?? result.Bio;
        result.FullName = register.FullName ?? result.FullName;
        result.Password = AesEncryption.Encrypt(register.Password) ?? result.Password;
        result.ProfileImg = register.ProfileImg ?? result.ProfileImg;
        result.Gender = register.Gender ?? result.Gender;
        result.Email = register.Email ?? result.Email;
        await _registersRepositories.UpdateAsyncById(result);
    }
    public async Task UpdateRegisterByUsername(string username, Register register)
    {
        var result = await GetByUsernameAsync(username);
        if (result == null)
        {
            throw new KeyNotFoundException($"Register with username = {username} not found");
        }

        result.Username = register.Username ?? result.Username;
        result.Bio = register.Bio ?? result.Bio;
        result.FullName = register.FullName ?? result.FullName;
        result.Password = AesEncryption.Encrypt(register.Password) ?? result.Password;
        result.ProfileImg = register.ProfileImg ?? result.ProfileImg;
        result.Gender = register.Gender ?? result.Gender;
        result.Email = register.Email ?? result.Email;
        await _registersRepositories.UpdateAsyncByUsername(result);
    }

    public async Task AddRegister(Register register)
    {
        if (register.Gender.IsNullOrEmpty())
        {
            throw new ArgumentException("Choose your gender.");
        }
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
            register.Password = AesEncryption.Encrypt(register.Password);
            await _registersRepositories.AddAsync(register);
        }

    }


    public async Task DeleteAllRegistersAsync()
    {
        await _registersRepositories.DeleteAllRegistersAsync();
    }

}