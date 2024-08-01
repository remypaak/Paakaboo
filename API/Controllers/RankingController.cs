using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class RankingController(IUnitOfWork unitOfWork) : BaseApiController
{

    [HttpGet("ranking")]
    public async Task<ActionResult<RankingDto>> GetRanking()
    {
        var themesWithPoints = await unitOfWork.ThemeRepository.GetPastThemes();
        var activeTheme = await unitOfWork.ThemeRepository.GetActiveTheme();
        
        if (activeTheme.VoteEndDate < DateTime.UtcNow && activeTheme.TrophyEndDate > DateTime.UtcNow)
        {
            themesWithPoints.Add(activeTheme);
        }

        var userPoints = new Dictionary<string, int>();

        foreach (var theme in themesWithPoints)
        {
            var photos = await unitOfWork.PhotoRepository.GetAllPhotosFromTheme(theme.Id);
            var sortedPhotos = photos
           .OrderByDescending(photo => photo.TotalScore)
           .ThenByDescending(photo => photo.Votes.Count(v => v.Points == 10))
           .ThenByDescending(photo => photo.Votes.Count(v => v.Points == 9))
           .ThenByDescending(photo => photo.Votes.Count(v => v.Points == 8))
           .ThenByDescending(photo => photo.Votes.Count(v => v.Points == 7))
           .ThenByDescending(photo => photo.Votes.Count(v => v.Points == 6))
           .ThenByDescending(photo => photo.Votes.Count(v => v.Points == 5))
           .ThenByDescending(photo => photo.Votes.Count(v => v.Points == 4))
           .ThenByDescending(photo => photo.Votes.Count(v => v.Points == 3))
           .ThenByDescending(photo => photo.Votes.Count(v => v.Points == 2))
           .ThenByDescending(photo => photo.Votes.Count(v => v.Points == 1))
           .ToList();

            for (int i = 0; i < sortedPhotos.Count && i < 8; i++)
            {
                var points = 0;
                switch (i)
                {
                    case 0: points = 5; break;
                    case 1: points = 4; break;
                    case 2: points = 3; break;
                    case 3: points = 2; break;
                    case 4: points = 2; break;
                    case 5: points = 1; break;
                    case 6: points = 1; break;
                    case 7: points = 1; break;
                }

                if (points > 0)
                {
                    if (userPoints.ContainsKey(sortedPhotos[i].AppUser.UserName))
                    {
                        userPoints[sortedPhotos[i].AppUser.UserName] += points;
                    }
                    else
                    {
                        userPoints[sortedPhotos[i].AppUser.UserName] = points;
                    }
                }
            }
        }
        var rankingDto = new RankingDto
        {
            UserPoints = userPoints
           .OrderByDescending(kv => kv.Value)
           .Select(kv => new UserPointsDto { UserName = kv.Key, Points = kv.Value })
           .ToList()
        };

        return Ok(rankingDto);
    }


}
