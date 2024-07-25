using API.DTOs;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

// [Authorize]
public class AdminController(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager) : BaseApiController
{

    [HttpPost("assign-role")]
    public async Task<ActionResult> AssignRole([FromBody] AssignRoleDto assignRoleDto)
    {
        if (string.IsNullOrEmpty(assignRoleDto.Role)) return BadRequest("You must select at least one role");

        var user = await userManager.FindByNameAsync(assignRoleDto.Username);

        if (user == null) return BadRequest("User not found");

        var roleExists = await roleManager.RoleExistsAsync(assignRoleDto.Role);
        if (!roleExists)
        {
            var roleResult = await roleManager.CreateAsync(new IdentityRole(assignRoleDto.Role));
            if (!roleResult.Succeeded) return BadRequest("Failed to create role");
        }

        var result = await userManager.AddToRoleAsync(user, assignRoleDto.Role);
        if (!result.Succeeded) return BadRequest("Failed to add as admin");

        return Ok(await userManager.GetRolesAsync(user));
    }

    [HttpGet("non-moderators")]
    public async Task<ActionResult<IEnumerable<AppUser>>> GetNonModerators()
    {
        var allUsers = await userManager.Users.ToListAsync();
        var moderators = await userManager.GetUsersInRoleAsync("Moderator");

        var nonModerators = allUsers.Except(moderators);

        return Ok(nonModerators.Select(user => new
        {
            user.UserName
        }));
    }
}
