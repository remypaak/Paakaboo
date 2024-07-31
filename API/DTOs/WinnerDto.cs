namespace API.DTOs;

public class WinnerDto
{
    public required string Name { get; set; }
    public required string PhotoUrl { get; set; }
    public required int TotalScore { get; set; }
}