using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

[BsonIgnoreExtraElements]
public class Login()
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = String.Empty;

    [BsonElement("username")]
    public string? Username { get; set; }

    [BsonElement("password")]
    public string? Password { get; set; }
}
