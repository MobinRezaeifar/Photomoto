﻿using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace WebApplication1.Models
{
    public class Comment
    {
        [BsonElement("id")]
        public string? Id { get; set; }

        [BsonElement("text")]
        public string? Text { get; set; }

        [BsonElement("owner")]
        public string? Owner { get; set; }
    }
}