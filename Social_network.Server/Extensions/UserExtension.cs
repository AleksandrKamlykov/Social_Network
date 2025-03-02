using Social_network.Server.Models;


public static class UserExtension
{
    public static UserDto ToDto(this User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Nickname = user.Nickname,
            Email = user.Email,
            Bio = user.Bio,
            BirthDate = user.BirthDate,
            CreatedAt = user.CreatedAt,
            LastModified = user.LastModified,
            Roles = user.UserRoles?.Where(ur => ur.Role != null).Select(ur => ur.Role.Name).ToList() ?? new List<string>(),
            State = user.State.State.ToString(),
            Avatar = user.Avatar?.Attachments?.Base64Data ?? null,
            AvatarId = user.Avatar?.AttachmentId.ToString() ?? null
        };
    }
}

