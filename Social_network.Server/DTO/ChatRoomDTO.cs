using Social_network.Server.DTO;

namespace Social_network.Server.DTO
{
    public class ChatRoomDTO
    {
        public Guid Id { get; set; }
        public List<UserDto> Participants { get; set; }
    }
}
