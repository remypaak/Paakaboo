using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class PhotoRepository(DataContext context) : IPhotoRepository
{
    public void Update(Photo photo)
    {
        context.Entry(photo).State = EntityState.Modified;
    }

    public async Task<Photo> GetPhotoByUserAndTheme(string userId, string themeName)
    {
        return await context.Photos
                        .Include(p => p.Theme)
                        .Where(p => p.AppUserId == userId && p.Theme.Name == themeName).FirstAsync();
    }

    

    public void DeletePhoto(Photo photo)
    {
        context.Photos.Remove(photo);
    }

    public async Task<IEnumerable<Photo>> GetAllPhotosFromTheme(string theme)
    {
        return await context.Photos
                        .Include( p => p.Theme)
                        .Where(p => p.Theme.Name == theme).ToListAsync();
    }
}
