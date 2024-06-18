﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace PUM.Domain.Entities.Registers;

[BsonIgnoreExtraElements]
public class Register
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = String.Empty;

    [BsonElement("username")]
    public string? Username { get; set; }

    [BsonElement("fullname")]
    public string? FullName { get; set; }

    [BsonElement("password")]
    public string? Password { get; set; }

    [BsonElement("profileImg")]
    public string? ProfileImg { get; set; }

    [BsonElement("email")]
    public string? Email { get; set; }

    [BsonElement("gender")]
    public string? Gender { get; set; }

    [BsonElement("bio")]
    public string? Bio { get; set; }
}