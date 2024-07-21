using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IVoteRepository
{
    Task SubmitVotes(List<Vote> votes);
    Task<IEnumerable<Vote>> GetVotesByUser(string userId);
    Task<IEnumerable<Vote>> GetVotesByUserAndPhotos(string userId, List<int> photoIds);
    void RemoveVotes(IEnumerable<Vote> votes);
}
