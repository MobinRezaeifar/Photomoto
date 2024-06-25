using PMC.Domain.Entities.Messages;
using PMC.Domain.Repositories.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PMC.Application.Services.Messages
{
    /// Service for managing messages.
    public class MessagesServices
    {
        private readonly IMessagesRepository _messagesRepository;

        public MessagesServices(IMessagesRepository messagesRepository)
        {
            _messagesRepository = messagesRepository;
        }

        /// Get all messages asynchronously with pagination.
        public async Task<IEnumerable<Message>> GetAllMessagesAsync(int pageNumber = 1, int pageSize = 10)
        {
            return await _messagesRepository.GetAllAsync(pageNumber, pageSize);
        }

        /// Add a new message asynchronously.
        public async Task AddMessage(Message message)
        {
            await _messagesRepository.AddAsync(message);
        }

        /// Get a message by its id asynchronously.
        public async Task<Message> GetById(string id)
        {
            return await _messagesRepository.GetByIdAsync(id);
        }

        /// Delete a message by its id asynchronously.
        public async Task DeleteMessage(string id)
        {
            await _messagesRepository.DeleteAsync(id);
        }

        /// Update a message asynchronously.
        public async Task UpdateMessage(string id, Message message)
        {
            var result = await _messagesRepository.GetByIdAsync(id);
            if (result == null)
            {
                throw new KeyNotFoundException($"Message with Id = {id} not found");
            }

            // Update message properties if provided
            result.Media = message.Media ?? result.Media;
            result.Sender = message.Sender ?? result.Sender;
            result.Recipient = message.Recipient ?? result.Recipient;
            result.Relationship = message.Relationship ?? result.Relationship;
            result.Type = message.Type ?? result.Type;
            result.Time = message.Time ?? result.Time;
            result.Size = message.Size ?? result.Size;

            await _messagesRepository.UpdateAsync(result);
        }

        /// Get messages by sender and recipient asynchronously with pagination.
        public async Task<IEnumerable<Message>> GetMessagesByRelationshipAsync(string sender, string recipient, int pageNumber = 1, int pageSize = 10)
        {
            return await _messagesRepository.GetMessagesByRelationshipAsync(sender, recipient, pageNumber, pageSize);
        }

        public async Task DeleteAllAsync()
        {
            await _messagesRepository.DeleteAllAsync();
        }
    }
}
