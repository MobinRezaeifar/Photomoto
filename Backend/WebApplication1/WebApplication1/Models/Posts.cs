using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace WebApplication1.Models
{
    public class Posts
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = String.Empty;

        [BsonElement("postImg")]
        public string? PostImg { get; set; }

        [BsonElement("disc")]
        public string? Disc { get; set; }

        [BsonElement("owner")]
        public string? Owner { get; set; }

        [BsonElement("like")]
        public int Like { get; set; }
        
    }
}
