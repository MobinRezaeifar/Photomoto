using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Messages
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = String.Empty;

    [BsonElement("media")]
    public string? Media { get; set; }

    [BsonElement("sender")]
    public string? Sender { get; set; }

    [BsonElement("recipient")]
    public string? Recipient { get; set; }

    [BsonElement("relationship")]
    public string? Relationship { get; set; }

    [BsonElement("type")]
    public string? Type { get; set; }
}
