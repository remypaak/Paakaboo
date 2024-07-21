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

}
