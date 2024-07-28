using API.Entities;

namespace API.Interfaces;

public interface IThemeRepository
{
    void Update(Theme theme);

    Task<Theme?> GetThemeByName(string name);

    Task<Theme?> GetActiveTheme();

    Task AddTheme(Theme theme);

    void DeleteTheme(Theme theme);

    Task SetSubmitEndDateToNow(int themeId);
    Task SetVoteEndDateToNow(int themeId);
    Task SetTrophyEndDateToNow(int themeId);

} 