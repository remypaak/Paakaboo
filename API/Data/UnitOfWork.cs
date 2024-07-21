using API.Interfaces;

namespace API.Data;

public class UnitOfWork(DataContext context, IUserRepository userRepository, IThemeRepository themeRepository, IPhotoRepository photoRepository,
IVoteRepository voteRepository) : IUnitOfWork
{
    public IUserRepository UserRepository => userRepository;
    public IThemeRepository ThemeRepository => themeRepository;
    public IPhotoRepository PhotoRepository => photoRepository;
    public IVoteRepository VoteRepository => voteRepository;

    public async Task<bool> Complete()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public bool HasChanged()
    {
        return context.ChangeTracker.HasChanges();
    }
}
