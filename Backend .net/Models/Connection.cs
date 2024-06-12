using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace WebApplication1.Models
{
    public class Connection
    {

        [BsonElement("username")]
        public string? Username { get; set; }
        
        [BsonElement("profileImg")]
        public string? ProfileImg { get; set; }


    }
}
