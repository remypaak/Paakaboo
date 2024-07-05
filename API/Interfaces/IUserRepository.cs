namespace API.Interfaces;
using API.DTOs;
using API.Entities;
using API.Helpers;

public interface IUserRepository
{
    void Update(AppUser user);
    Task<AppUser?> GetUserByUsernameAsync(string username);
}
