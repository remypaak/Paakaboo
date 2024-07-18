namespace API.Interfaces;

public interface IUnitOfWork
{
    IUserRepository UserRepository { get; }
    IThemeRepository ThemeRepository { get; }
    IPhotoRepository PhotoRepository { get; }
    Task<bool> Complete();

}
