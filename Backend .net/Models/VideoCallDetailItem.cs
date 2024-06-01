using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


[BsonIgnoreExtraElements]
public class VideoCallDetailItem
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = String.Empty;

    [BsonElement("applicant")]
    public string? Applicant { get; set; }

    [BsonElement("recipient")]
    public string? Recipient { get; set; }

    [BsonElement("status")]
    public string? Status { get; set; }

    [BsonElement("room")]
    public string? Room { get; set; }


}