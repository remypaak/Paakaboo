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
    
}
