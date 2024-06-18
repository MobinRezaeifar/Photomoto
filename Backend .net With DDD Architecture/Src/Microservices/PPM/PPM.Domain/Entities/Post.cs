using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PPM.Domain.Entities
{
    [BsonIgnoreExtraElements]
    public class Post
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = String.Empty;

        [BsonElement("postMedia")]
        public string? PostMedia { get; set; }

        [BsonElement("disc")]
        public string? Disc { get; set; }

        [BsonElement("owner")]
        public string? Owner { get; set; }

        [BsonElement("likes")]
        public List<Like> Likes { get; set; } = new List<Like>();

        [BsonElement("type")]
        public string? Type { get; set; }

        [BsonElement("time")]
        public string? Time { get; set; }

        [BsonElement("comment")]
        public List<Comment> Comment { get; set; } = new List<Comment>();

        [BsonElement("tags")]
        public List<string> Tags { get; set; } = new List<string>();

        [BsonElement("profileImg")]
        public string? ProfileImg { get; set; }
    }
}
