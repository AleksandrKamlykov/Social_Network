using System.Text.Json;
using System.Text.Json.Serialization;
using Social_network.Server.Models;
using System.Collections.Generic;

public class RoleListConverter : JsonConverter<List<UserRole>>
{
    public override List<UserRole> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var roles = new List<UserRole>();
        while (reader.Read())
        {
            if (reader.TokenType == JsonTokenType.EndArray)
                break;

            if (reader.TokenType == JsonTokenType.String)
            {
                var role = (UserRole)Enum.Parse(typeof(UserRole), reader.GetString());
                roles.Add(role);
            }
        }
        return roles;
    }

    public override void Write(Utf8JsonWriter writer, List<UserRole> value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        foreach (var role in value)
        {
            writer.WriteStringValue(role.ToString());
        }
        writer.WriteEndArray();
    }
}

public class StateListConverter : JsonConverter<List<State>>
{
    public override List<State> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var roles = new List<State>();
        while (reader.Read())
        {
            if (reader.TokenType == JsonTokenType.EndArray)
                break;

            if (reader.TokenType == JsonTokenType.String)
            {
                var role = (State)Enum.Parse(typeof(State), reader.GetString());
                roles.Add(role);
            }
        }
        return roles;
    }

    public override void Write(Utf8JsonWriter writer, List<State> value, JsonSerializerOptions options)
    {
        writer.WriteStartArray();
        foreach (var role in value)
        {
            writer.WriteStringValue(role.ToString());
        }
        writer.WriteEndArray();
    }
}