public class PostDto
{
    public Guid Id { get; set; }
    public string Content { get; set; }
    public DateTime Date { get; set; }
    public uint Likes { get; set; }
    public Guid UserId { get; set; }

}
