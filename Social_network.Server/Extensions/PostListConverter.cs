using System.Text.Json;
using System.Text.Json.Serialization;
using Social_network.Server.Models;
using System.Collections.Generic;

//public class PostListConverter : JsonConverter<List<Post>>
//{
//    public override List<Post> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
//    {
//        var posts = new List<Post>();
//        while (reader.Read())
//        {
//            if (reader.TokenType == JsonTokenType.EndArray)
//                break;

//            if (reader.TokenType == JsonTokenType.StartObject)
//            {
//                var post = JsonSerializer.Deserialize<Post>(ref reader, options);
//                posts.Add(post);
//            }
//        }
//        return posts;
//    }

//    public override void Write(Utf8JsonWriter writer, List<Post> value, JsonSerializerOptions options)
//    {
//        writer.WriteStartArray();
//        foreach (var post in value)
//        {
//            JsonSerializer.Serialize(writer, post, options);
//        }
//        writer.WriteEndArray();
//    }
//}
