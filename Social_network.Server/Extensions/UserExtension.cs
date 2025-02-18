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
                Roles = user.Roles.Select(r => r.Role).ToList(),
                State = user.State.State
            };
        }
    }

