using MongoDB.Driver;
using Microsoft.Extensions.Options;
using Registers.Domain.Entities;
using Registers.Infrastructure.Configuration;
using Registers.Domain.Repositories.Interfaces;
using Registers.Utils;
namespace Registers.Infrastructure.Repositories;

public class RegistersRepositories : IRegisterRepository
{
    private readonly IMongoCollection<Register> _register;
    public RegistersRepositories(IOptions<MongoDBSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _register = database.GetCollection<Register>("Registers");
    }

    public async Task<IEnumerable<Register>> GetAllAsync()
    {
        return await _register.Find(p => true).ToListAsync();
    }

    public async Task<Register> LoginAsync(string username, string encryptedPassword)
    {
        return await _register.Find(user => user.Username == username && user.Password == encryptedPassword).FirstOrDefaultAsync();
    }

    public async Task<Register> UsernameExists(string username)
    {
        return await _register
            .Find(r => r.Username == username)
            .FirstOrDefaultAsync();
    }
    public async Task<Register> EmailExists(string email)
    {
        return await _register
           .Find(r => r.Email == email)
           .FirstOrDefaultAsync();
    }

    public async Task AddAsync(Register register)
    {
        await _register.InsertOneAsync(register);
    }

    public async Task<Register> GetByIdAsync(string id)
    {
        return await _register.Find(x => x.Id == id).FirstOrDefaultAsync();
    }


    public async Task<Register> GetByUsernameAsync(string username)
    {
        return await _register.Find(x => x.Username == username).FirstOrDefaultAsync();
    }

    public async Task DeleteAsync(string id)
    {
        await _register.DeleteOneAsync(x => x.Id == id);
    }

    public async Task UpdateAsync(Register register)
    {
        await _register.ReplaceOneAsync(x => x.Id == register.Id, register);
    }


}