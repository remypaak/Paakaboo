namespace API.Interfaces;

public interface IUnitOfWork
{
    IUserRepository UserRepository { get; }
    IThemeRepository ThemeRepository { get; }
    IPhotoRepository PhotoRepository { get; }
    IVoteRepository VoteRepository  { get; }
    Task<bool> Complete();

}
