﻿using API.Entities;

namespace API.Interfaces;

public interface IPhotoRepository
{
    void Update(Photo photo);
    void DeletePhoto(Photo photo);
    Task<IEnumerable<Photo>> GetPhotosWithVotesByTheme(int themeId);
    Task<Photo> GetPhotoByUserAndTheme(string userId, string theme);
    Task<IEnumerable<Photo>> GetAllPhotosFromTheme(string theme);
    Task UpdatePhotoScore(int photoId);
}
