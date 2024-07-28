using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories;

public class VoteRepository(DataContext context) : IVoteRepository
{
    public async Task<IEnumerable<Vote>> GetVotesByUserAndPhotos(string userId, List<int> photoIds)
    {
        return await context.Votes
                             .Where(v => v.AppUserId == userId && photoIds.Contains(v.PhotoId)).ToListAsync();
    }

    public async Task<IEnumerable<Vote>> GetVotesByUser(string userId)
    {
        return await context.Votes
                             .Where(v => v.AppUserId == userId)
                             .ToListAsync();
    }

    public void RemoveVotes(IEnumerable<Vote> votes)
    {
        context.Votes.RemoveRange(votes);
    }

    public async Task SubmitVotes(List<Vote> votes)
    {
        await context.Votes.AddRangeAsync(votes);
    }

    public async Task<IEnumerable<Vote>> GetVotesByUserAndPhoto(string userId, int photoId)
    {
        return await context.Votes
            .Where(v => v.AppUserId == userId && v.PhotoId == photoId)
            .ToListAsync();
    }

    public async Task AddVoteAsync(Vote vote)
    {
        await context.Votes.AddAsync(vote);
    }
    public async Task DeleteVotesByUser(string userId)
    {
        var votes = await context.Votes.Where(v => v.AppUserId == userId).ToListAsync();
        context.Votes.RemoveRange(votes);
    }

    public async Task DeleteVotesByPhotoId(int photoId)
{
    var votes = await context.Votes.Where(v => v.PhotoId == photoId).ToListAsync();
    context.Votes.RemoveRange(votes);
}

}
