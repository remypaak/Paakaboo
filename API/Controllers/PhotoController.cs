using API.DTOs;
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
    [HttpPost("submit-photo")]
    public async Task<ActionResult<PhotoDto>> AddPhoto([FromForm] IFormFile file)
    {
        var user = await unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName());

        if (user == null)
        {
            return BadRequest("Username not present in token");
        }

        var result = await photoService.AddPhotoAsync(file);

        if (result.Error != null)
        {
            return BadRequest(result.Error.Message + ", Not able to upload photo to Cloudinary");
        }

        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };

        user.Photos.Add(photo);

        if (await unitOfWork.Complete())
        {
            return Ok(new PhotoDto());
        }

        return BadRequest("Problem adding photo");
    }
}
