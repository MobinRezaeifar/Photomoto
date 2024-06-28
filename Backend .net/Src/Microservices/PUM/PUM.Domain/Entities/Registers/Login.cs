using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace PUM.Domain.Entities.Registers;

[BsonIgnoreExtraElements]
public class Login()
{
    [BsonElement("username")]
    public string? Username { get; set; }

    [BsonElement("password")]
    public string? Password { get; set; }
}