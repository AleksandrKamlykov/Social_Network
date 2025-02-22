using Social_network.Server.Models;
using System.Text.Json.Serialization;

public class UserDto
{
    public Guid Id { get; set; }
    public List<string> Roles { get; set; }
    public State State { get; set; }
    public string Name { get; set; }
    public string Nickname { get; set; }
    public string Email { get; set; }
    public string Bio { get; set; }
    public DateOnly BirthDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastModified { get; set; }


}
