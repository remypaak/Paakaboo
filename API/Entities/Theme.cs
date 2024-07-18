namespace API.Entities;

public class Theme
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public DateTime StartDate { get; set; }
    public DateTime SubmitEndDate { get; set; }
    public DateTime VoteEndDate { get; set; }

    public ICollection<Photo> Photos { get; set; } = [];

}
