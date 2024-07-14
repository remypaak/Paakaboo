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

    public async Task<bool> HasActiveTheme()
    {
        return await context.Themes
                     .AnyAsync(t => t.EndDate.Date >= DateTime.Now.Date);
    }

    public async Task<DateTime?> GetActiveThemeEndDate()
    {
        var activeTheme = await context.Themes.FirstOrDefaultAsync(t => t.EndDate.Date >= DateTime.Now.Date);
        if (activeTheme == null)
        {
            return null;
        }
        return activeTheme.EndDate;
    }

    public void DeleteTheme(Theme theme)
    {
        context.Themes.Remove(theme);
    }

}
