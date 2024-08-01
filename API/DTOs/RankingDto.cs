namespace API.DTOs;

public class RankingDto
{
    public List<UserPointsDto> UserPoints { get; set; } = [];
}

public class UserPointsDto
{
    public string UserName { get; set; }
    public int Points { get; set; }
}