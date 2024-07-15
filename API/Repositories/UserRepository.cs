using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class UserRepository(DataContext context) : IUserRepository
{
    public async Task<AppUser?> GetUserByUsernameAsync(string username) => await context.Users.Include(x => x.Photos).SingleOrDefaultAsync(x => x.UserName == username);

    public Task GetUserByUsernameAsync(object value)
    {
        throw new NotImplementedException();
    }

    public void Update(AppUser user) => context.Entry(user).State = EntityState.Modified;
}
