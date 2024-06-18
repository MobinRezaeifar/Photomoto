using MongoDB.Driver;
using Microsoft.Extensions.Options;
using PUM.Domain.Entities.Registers;
using PUM.Infrastructure.Configuration;
using PUM.Domain.Repositories.Interfaces.Registers;

namespace PUM.Infrastructure.Repositories.Registers;

public class RegistersRepositories : IRegisterRepository
{
    private readonly IMongoCollection<Register> _register;

    // Constructor to initialize MongoDB connection and get the collection
    public RegistersRepositories(IOptions<MongoDBSettings> settings)
    {
        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.DatabaseName);
        _register = database.GetCollection<Register>("Registers");
    }

    // Retrieve all register records
    public async Task<IEnumerable<Register>> GetAllAsync()
    {
        return await _register.Find(p => true).ToListAsync();
    }

    // Authenticate user by username and password
    public async Task<Register> LoginAsync(string username, string encryptedPassword)
    {
        return await _register.Find(user => user.Username == username && user.Password == encryptedPassword).FirstOrDefaultAsync();
    }

    // Check if a username exists
    public async Task<Register> UsernameExists(string username)
    {
        return await _register.Find(r => r.Username == username).FirstOrDefaultAsync();
    }

    // Check if an email exists
    public async Task<Register> EmailExists(string email)
    {
        return await _register.Find(r => r.Email == email).FirstOrDefaultAsync();
    }

    // Add a new register record
    public async Task AddAsync(Register register)
    {
        await _register.InsertOneAsync(register);
    }

    // Retrieve a register record by ID
    public async Task<Register> GetByIdAsync(string id)
    {
        return await _register.Find(x => x.Id == id).FirstOrDefaultAsync();
    }

    // Retrieve a register record by username
    public async Task<Register> GetByUsernameAsync(string username)
    {
        return await _register.Find(x => x.Username == username).FirstOrDefaultAsync();
    }

    // Delete a register record by ID
    public async Task DeleteAsync(string id)
    {
        await _register.DeleteOneAsync(x => x.Id == id);
    }

    // Update an existing register record
    public async Task UpdateAsync(Register register)
    {
        await _register.ReplaceOneAsync(x => x.Id == register.Id, register);
    }
}

