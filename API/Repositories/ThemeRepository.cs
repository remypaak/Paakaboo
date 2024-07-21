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
                                   .FirstOrDefaultAsync(t => t.VoteEndDate >= DateTime.UtcNow);
    if (activeTheme == null)
        {
            return null;
        }

    return activeTheme;
}

    public void DeleteTheme(Theme theme)
    {
        context.Themes.Remove(theme);
    }

}
