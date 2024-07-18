using API.Entities;

namespace API.Interfaces;

public interface IPhotoRepository
{
    void Update(Photo photo);
    void DeletePhoto(Photo photo);
    Task<Photo> GetPhotoByUserAndTheme(string userId, string theme);
    Task<IEnumerable<Photo>> GetAllPhotosFromTheme(string theme);
}
