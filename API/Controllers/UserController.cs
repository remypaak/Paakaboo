using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class UserController(IUnitOfWork unitOfWork, IPhotoService photoService, RoleManager<IdentityRole> roleManager, UserManager<AppUser> userManager) : BaseApiController
{


    //TODO: MAP TO PHOTODTO
    [HttpPost("add-photo")]
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
            PublicId = result.PublicId,
        };

        user.Photos.Add(photo);

        if (await unitOfWork.Complete())
        {
            return Ok(new PhotoDto());
        }

        return BadRequest("Problem adding photo");
    }
}
