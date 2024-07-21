namespace API.DTOs;

public class PhotoDto
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Url { get; set; }
    public int TotalScore { get; set; }
}
