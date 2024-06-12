using MongoDB.Bson.Serialization.Attributes;

namespace WebApplication1.Models
{
    public class Like
    {
        [BsonElement("username")]
        public string? Username { get; set; }
        [BsonElement("profileImg")]
        public string? ProfileImg { get; set; }

    
    }
}
