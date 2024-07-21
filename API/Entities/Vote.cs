namespace API.Entities;

public class Vote
{
    public int Id { get; set; }
    public int Points { get; set; }

    //navigation
    public string AppUserId { get; set; } = null!;
    public AppUser AppUser { get; set; } = null!;
    public int PhotoId { get; set; }
    public Photo Photo { get; set; } = null!;

}
