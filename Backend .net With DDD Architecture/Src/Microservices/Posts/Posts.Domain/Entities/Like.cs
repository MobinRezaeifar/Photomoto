using MongoDB.Bson.Serialization.Attributes;

namespace Posts.Domain.Entities;

    public class Like
    {
        [BsonElement("username")]
        public string? Username { get; set; }
        [BsonElement("profileImg")]
        public string? ProfileImg { get; set; }

    
    }

