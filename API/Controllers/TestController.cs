using System;
using System.Drawing;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class TestController(IUnitOfWork unitOfWork) : BaseApiController
{

    [HttpPost("end-submit-period")]
    public async Task<ActionResult> EndSubmitPeriod()
    {
        var activeTheme = await unitOfWork.ThemeRepository.GetActiveTheme();
        if (activeTheme == null)
        {
            return Ok(new { message = "There is no active theme" });
        }

        await unitOfWork.ThemeRepository.SetSubmitEndDateToNow(activeTheme.Id);
        if (await unitOfWork.Complete())
        {
            return Ok(new { message = "Submit period ended successfully" });
        }

        return BadRequest(new { message = "Something went wrong while submitting the new enddate" });
    }

    [HttpPost("end-vote-period")]
    public async Task<ActionResult> EndVotePeriod()
    {
        var activeTheme = await unitOfWork.ThemeRepository.GetActiveTheme();
        if (activeTheme == null)
        {
            return Ok(new { message = "There is no active theme" });
        }

        if (DateTime.UtcNow <= activeTheme.SubmitEndDate)
        {
            return Ok(new { message = "Cannot end the vote period as the submit period is not yet over" });
        }

        await unitOfWork.ThemeRepository.SetVoteEndDateToNow(activeTheme.Id);
        if (await unitOfWork.Complete())
        {
            return Ok(new { message = "Vote period ended successfully" });
        }

        return BadRequest(new { message = "Something went wrong while submitting the new enddate" });
    }

    [HttpPost("end-challenge")]
    public async Task<ActionResult> EndChallenge()
    {
        var activeTheme = await unitOfWork.ThemeRepository.GetActiveTheme();
        if (activeTheme == null)
        {
            return Ok(new { message = "There is no active theme" });
        }

        // Get the photos from test users for the active theme
        await unitOfWork.ThemeRepository.SetSubmitEndDateToNow(activeTheme.Id);
        await unitOfWork.ThemeRepository.SetVoteEndDateToNow(activeTheme.Id);
        await unitOfWork.ThemeRepository.SetTrophyEndDateToNow(activeTheme.Id);

        if (await unitOfWork.Complete())
        {
            return Ok(new { message = "Challenge ended successfully" });
        }
        return BadRequest(new { message = "Something went wrong while ending the challenge" });
    }

    [HttpPost("generate-submissions")]
    public async Task<ActionResult> GenerateSubmissions()
    {
        var users = new List<string>(){
            "Tester1",
            "Tester2",
            "Tester3",
            "Tester4",
            "Tester5",
            "Tester6",
            "Tester7",
            "Tester8",
            "Tester9",
            "Tester10",
            "Tester11",
            "Tester12",
        };

        var activeTheme = await unitOfWork.ThemeRepository.GetActiveTheme();
        if (activeTheme == null)
        {
            return Ok(new { message = "There is no active theme" });
        }

        if (DateTime.UtcNow > activeTheme.SubmitEndDate)
        {
            return Ok(new { message = "Cannot generate submissions after submissionperiod ended" });
        }


        foreach (var userName in users)
        {
            var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(userName);



            var existingPhoto = user.Photos.FirstOrDefault(p => p.ThemeId == activeTheme.Id);
            if (existingPhoto != null)
            {
                return Ok(new { message = "Submissions are already generated" });
            }

            var photo = user.Photos.FirstOrDefault();
            var newPhoto = new Photo
            {
                Title = photo.Title,
                Url = photo.Url,
                PublicId = photo.PublicId,
                ThemeId = activeTheme.Id,
                TotalScore = 0,
                Theme = activeTheme
            };
            user.Photos.Add(newPhoto);
        }

        if (await unitOfWork.Complete())
        {
            return Ok(new { message = "Submissions generated successfully" });
        }

        return BadRequest(new { message = "Something went wrong while generating submissions" });
    }


    [HttpPost("generate-votes")]
    public async Task<ActionResult> GenerateVotes()
    {
        var users = new List<string>(){
            "Tester1",
            "Tester2",
            "Tester3",
            "Tester4",
            "Tester5",
            "Tester6",
            "Tester7",
            "Tester8",
            "Tester9",
            "Tester10",
            "Tester11",
            "Tester12",
        };



        var activeTheme = await unitOfWork.ThemeRepository.GetActiveTheme();
        if (activeTheme == null)
        {
            return Ok(new { message = "There is no active theme" });
        }

        if (DateTime.UtcNow <= activeTheme.SubmitEndDate)
        {
            return Ok(new { message = "Cannot generate votes before the submission period is over" });
        }

        var photos = await unitOfWork.PhotoRepository.GetAllPhotosFromTheme(activeTheme.Id);

        var existingVotes = await unitOfWork.VoteRepository.GetVotesByThemeAndUsers(activeTheme.Id, users);
        if (existingVotes.Any())
        {
            return Ok(new { message = "Votes are already generated" });
        }

        var random = new Random();
        foreach (var userName in users)
        {
            var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(userName);

            var existingPoints = new List<int>();
            foreach (var photo in photos)
            {


                int points;
                do
                {
                    points = random.Next(0, 11);

                } while (points != 0 && existingPoints.Contains(points));
                existingPoints.Add(points);

                var newVote = new Vote
                {
                    Points = points,
                    AppUserId = user.Id,
                    PhotoId = photo.Id
                };
                await unitOfWork.VoteRepository.AddVoteAsync(newVote);
                photo.TotalScore += points;
            }
        }

        if (await unitOfWork.Complete())
        {
            return Ok(new { message = "Votes generated successfully" });
        }

        return BadRequest(new { message = "Something went wrong while generating votes" });
    }
}
