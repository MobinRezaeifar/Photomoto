using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace PPM.Domain.Entities;

public class Comment
{

    [BsonElement("text")]
    public string? Text { get; set; }

    [BsonElement("owner")]
    public string? Owner { get; set; }

    [BsonElement("time")]
    public string? Time { get; set; }
}

