namespace API.DTOs;

public class ThemeDto
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required int WeekNumber { get; set; }
    public required DateTime StartDate { get; set; }
    public required DateTime SubmitEndDate { get; set; }
    public required DateTime VoteEndDate { get; set; }
}
