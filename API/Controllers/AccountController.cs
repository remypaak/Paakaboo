using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

public class AccountController(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<AppUser> signInManager,
             ITokenService tokenService) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        var user = new AppUser
        {
            UserName = registerDto.UserName
        };

        var result = await userManager.CreateAsync(user, registerDto.Password);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        if (!await roleManager.RoleExistsAsync("Member"))
        {
            var roleResult = await roleManager.CreateAsync(new IdentityRole("Member"));
            if (!roleResult.Succeeded)
            {
                return BadRequest(result.Errors + " , Failed to create role");
            }
        }

        var token = await tokenService.CreateToken(user);

        return Ok(new UserDto {
            Username = user.UserName,
            Token = token
        });


    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LoginDto loginDto) 
    {
        var user = await userManager.Users.Include(p => p.Photos)
                        .FirstOrDefaultAsync(x => x.NormalizedUserName == loginDto.Username.ToUpper());
        
        if (user == null || user.UserName == null)
        {
            return Unauthorized("Invalid username");
        }

        var result = await signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

        if (!result.Succeeded)
        {
            return Unauthorized("Invalid Password");
        }

        return new UserDto
        {
            Username = user.UserName,
            Token = await tokenService.CreateToken(user)
        };
    }

}
