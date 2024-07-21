namespace API.Entities;

public class Photo
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public required string Url { get; set; }
    public required string PublicId { get; set; }
    public int TotalScore { get; set; }

    //Navigation property
    public string? AppUserId { get; set; }
    public AppUser AppUser { get; set; } = null!;

    public int? ThemeId { get; set; }  // Foreign Key to Theme
    public Theme? Theme { get; set; } = null!;  // Navigation property

    public List<Vote> Votes { get; set; } = [];
}
