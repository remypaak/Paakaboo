﻿using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[Authorize]
public class PhotoController(IUnitOfWork unitOfWork, IPhotoService photoService, RoleManager<IdentityRole> roleManager, UserManager<AppUser> userManager) : BaseApiController
{
    [HttpGet("photos-with-votes/{themeId}")]
    public async Task<ActionResult<List<PhotoWithVotesDto>>> GetPhotosWithVotes(int themeId)
    {
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName());


        var photos = await unitOfWork.PhotoRepository.GetPhotosWithVotesByTheme(themeId);
        var photoDtos = photos.Select(photo => new PhotoWithVotesDto
        {
            Id = photo.Id,
            Title = photo.Title,
            Url = photo.Url,
            Points = photo.Votes.FirstOrDefault(v => v.AppUserId == user.Id)?.Points ?? 0,
            IsUserPhoto = photo.AppUserId == user.Id
        }).ToList();

        return Ok(photoDtos);
    }
    [HttpPost("submit-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto([FromForm] IFormFile file, [FromForm] string title, [FromForm] string theme)
    {
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName());

        if (user == null)
        {
            return BadRequest("Username not present in token");
        }

        var themeEntity = await unitOfWork.ThemeRepository.GetThemeByName(theme);

        if (themeEntity == null)
        {
            return BadRequest("Theme not found");
        }

        var photosToDelete = user.Photos.Where(p => p.ThemeId == themeEntity.Id).ToList();

        foreach (var p in photosToDelete)
        {
            var deleteResult = await photoService.DeletePhotoAsync(p.PublicId);

            if (deleteResult.Error != null)
            {
                return BadRequest(deleteResult.Error.Message + ", Not able to delete photo from Cloudinary");
            }

            unitOfWork.PhotoRepository.DeletePhoto(p);
        }

        if (photosToDelete.Count != 0 && !await unitOfWork.Complete())
        {
            return BadRequest("Failed to delete existing photos");
        }

        var result = await photoService.AddPhotoAsync(file);

        if (result.Error != null)
        {
            return BadRequest(result.Error.Message + ", Not able to upload photo to Cloudinary");
        }

        var photo = new Photo
        {
            Title = title,
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId,
            ThemeId = themeEntity.Id,
            Theme = themeEntity
        };

        user.Photos.Add(photo);

        if (await unitOfWork.Complete())
        {
            var photoDto = new PhotoDto
            {
                Id = photo.Id,
                Title = photo.Title,
                Url = photo.Url
            };

            return Ok(photoDto);
        }

        return BadRequest("Problem adding photo");
    }

    [HttpGet("{theme}")]
    public async Task<ActionResult<PhotoDto>> GetUserThemePhoto(string theme)
    {
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName());

        if (user == null)
        {
            return BadRequest("Username not present in token");
        }

        var photo = await unitOfWork.PhotoRepository.GetPhotoByUserAndTheme(user.Id, theme);

        if (photo == null)
        {
            return Ok(new { message = "geen foto ingediend" });
        }
        
        var photoDto = new PhotoDto
        {
            Title = photo.Title,
            Url = photo.Url
        };

        return Ok(photoDto);
    }
    
    [HttpGet("all/{theme}")]
    public async Task<ActionResult<IEnumerable<PhotoDto>>> GetAllPhotosFromTheme(int theme)
    {
        var photos = await unitOfWork.PhotoRepository.GetAllPhotosFromTheme(theme);

        if (photos == null || !photos.Any())
        {
            return NotFound("No photos found for the given theme");
        }

        var photoDtos = photos.Select(photo => new PhotoDto
        {
            Id = photo.Id,
            Title = photo.Title,
            Url = photo.Url,
            TotalScore = photo.TotalScore,
            UserName = photo.AppUser?.UserName
        }).ToList();

        return Ok(photoDtos);
    }

    
}
