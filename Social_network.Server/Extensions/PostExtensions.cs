using Social_network.Server.Models;

public static class PostExtensions
{
    public static PostDto ToDto(this Post post)
    {
        return new PostDto
        {
            Id = post.Id,
            Content = post.Content,
            Date = post.Date,
            Likes = post.Likes,
            UserId = post.UserId
        };
    }
}
