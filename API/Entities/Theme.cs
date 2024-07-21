namespace API.Entities;

public class Theme
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public int WeekNumber { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime SubmitEndDate { get; set; }
    public DateTime VoteEndDate { get; set; }

    public List<Photo> Photos { get; set; } = [];

}
