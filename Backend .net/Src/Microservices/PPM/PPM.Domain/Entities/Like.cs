using MongoDB.Bson.Serialization.Attributes;

namespace PPM.Domain.Entities;

    public class Like
    {
        [BsonElement("username")]
        public string? Username { get; set; }
    }

