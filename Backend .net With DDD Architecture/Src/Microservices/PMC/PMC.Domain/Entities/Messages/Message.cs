using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace PMC.Domain.Entities.Messages;

[BsonIgnoreExtraElements]
public class Message
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

    [BsonElement("time")]
    public string? Time { get; set; }

    [BsonElement("size")]
    public float? Size { get; set; }
}