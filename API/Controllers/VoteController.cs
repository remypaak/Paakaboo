using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[Authorize]
public class VoteController(IUnitOfWork unitOfWork) : BaseApiController
{
    [HttpPost("submit-votes")]
    public async Task<ActionResult> SubmitVotes(List<VoteDto> voteDtos, UserManager<AppUser> userManager)
    {
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName());

        var votes = voteDtos.Select(v => new Vote
        {
            AppUserId = user.Id,
            PhotoId = v.PhotoId,
            Points = v.Points

        }).ToList();

        var nonZeroPoints = votes.Where(v => v.Points != 0).Select(v => v.Points).ToList();
        if (nonZeroPoints.Distinct().Count() != nonZeroPoints.Count)
        {
            return BadRequest("Each point value must be unique");
        }

        var photoIds = votes.Select(v => v.PhotoId).ToList();
        var existingVotes = await unitOfWork.VoteRepository.GetVotesByUserAndPhotos(user.Id, photoIds);
        unitOfWork.VoteRepository.RemoveVotes(existingVotes);

        await unitOfWork.VoteRepository.SubmitVotes(votes);

        foreach (var vote in votes)
        {
            await unitOfWork.PhotoRepository.UpdatePhotoScore(vote.PhotoId);
        }

        if (await unitOfWork.Complete())
        {
            return NoContent();
        }

        return BadRequest("Failed to submit voes");
    }

    [HttpGet("current-votes")]
    public async Task<IActionResult> GetCurrentVotes()
    {
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName());


        var votes = await unitOfWork.VoteRepository.GetVotesByUser(user.Id);
        var voteDtos = votes.Select(v => new VoteDto
        {
            PhotoId = v.PhotoId,
            Points = v.Points
        }).ToList();

        return Ok(voteDtos);
    }

    [HttpGet("{photoId}/votes")]
    public async Task<ActionResult<List<VoteDto>>> GetVotesForPhoto(int photoId)
    {
        var votes = await unitOfWork.VoteRepository.GetVotesForPhoto(photoId);

        var voteDtos = votes.Select(v => new VoteDto
        {
            PhotoId = v.PhotoId,
            Points = v.Points,
            UserName = v.AppUser.UserName
        }).ToList();

        return Ok(voteDtos);

    }
}
