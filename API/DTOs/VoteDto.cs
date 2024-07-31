namespace API.DTOs;

public class VoteDto
{
    public required int  PhotoId { get; set; }
    public required int Points { get; set; }
    public string UserName { get; set; } = "";
}
