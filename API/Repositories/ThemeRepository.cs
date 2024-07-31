using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class ThemeRepository(DataContext context) : IThemeRepository
{
    public void Update(Theme theme)
    {
        context.Entry(theme).State = EntityState.Modified;
    }

    public async Task<Theme?> GetThemeByName(string name)
    {
        return await context.Themes.FirstOrDefaultAsync(t => t.Name == name);
    }

    public async Task AddTheme(Theme theme)
    {
        await context.Themes.AddAsync(theme);
    }


    public async Task<Theme?> GetActiveTheme()
    {
        var activeTheme = await context.Themes
                                       .FirstOrDefaultAsync(t => t.TrophyEndDate >= DateTime.UtcNow);
        if (activeTheme == null)
        {
            return null;
        }

        return activeTheme;
    }
    public async Task<List<Theme>> GetPastThemes()
{
    return await context.Themes
                        .Where(t => t.TrophyEndDate < DateTime.UtcNow)
                        .Include(t => t.Photos)
                        .ThenInclude(p => p.AppUser)
                        .OrderByDescending(t => t.TrophyEndDate)
                        .ToListAsync();
}

    public void DeleteTheme(Theme theme)
    {
        context.Themes.Remove(theme);
    }

    // Remove after testing period
    public async Task SetSubmitEndDateToNow(int themeId)
    {
        var theme = await context.Themes.FindAsync(themeId);
        if (theme != null)
        {
            theme.SubmitEndDate = DateTime.UtcNow;
        }
    }

    // Remove after testing period
    public async Task SetVoteEndDateToNow(int themeId)
    {
        var theme = await context.Themes.FindAsync(themeId);
        if (theme != null)
        {
            theme.VoteEndDate = DateTime.UtcNow;
        }
    }

    // Remove after testing period
    public async Task SetTrophyEndDateToNow(int themeId)
    {
        var theme = await context.Themes.FindAsync(themeId);
        if (theme != null)
        {
            theme.TrophyEndDate = DateTime.UtcNow;
        }
    }

}
