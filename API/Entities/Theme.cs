namespace API.Entities;

public class Theme
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public DateTime EndDate { get; set; }

    public ICollection<Photo> Photos { get; set; } = [];

}
