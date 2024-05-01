using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace WebApplication1.Models
{
    public class Comment
    {

        [BsonElement("text")]
        public string? Text { get; set; } 
 
        [BsonElement("owner")]
        public string? Owner { get; set; }
        [BsonElement("profileImg")]
        public string? ProfileImg { get; set; }

        [BsonElement("time")]
        public string? Time { get; set; }
    }
}
