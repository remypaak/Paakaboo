using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ThemeController(IUnitOfWork unitOfWork) : BaseApiController
{

     [HttpPost("add-theme")]
        public async Task<IActionResult> AddTheme(ThemeDto themeDto)
        {
            var hasActiveTheme = await unitOfWork.ThemeRepository.HasActiveTheme();
            if (hasActiveTheme == true)
            {
                return BadRequest("There is already an active theme.");
            }

            var newTheme = new Theme
            {
                Name = themeDto.Name,
                EndDate = themeDto.EndDate,
            };

            await unitOfWork.ThemeRepository.AddTheme(newTheme);

            // Save changes
            if (await unitOfWork.Complete())
            {
                return Ok( new {message = "Theme added successfully."});
            }

            return BadRequest("Failed to add the theme.");
        }

    [HttpGet("has-active-theme")]
    public async Task<ActionResult<HasActiveThemeResponseDto>> HasActiveTheme()
    {
        var hasActiveTheme = await unitOfWork.ThemeRepository.HasActiveTheme();
        return Ok(new { hasActiveTheme });
    }

    [HttpGet("active-theme-end-date")]
    public async Task<ActionResult<ActiveThemeEndDateResponseDto>> GetActiveThemeEndDate()
    {
        var activeThemeEndDate = await unitOfWork.ThemeRepository.GetActiveThemeEndDate();

        return Ok(new ActiveThemeEndDateResponseDto {
            ActiveThemeEndDate = activeThemeEndDate
        });
    }
    
    [HttpDelete("{name}")]
        public async Task<IActionResult> DeleteTheme(string name)
        {
            var theme = await unitOfWork.ThemeRepository.GetThemeByName(name);
            if (theme == null) return NotFound("Theme not found");

            unitOfWork.ThemeRepository.DeleteTheme(theme);

            if (await unitOfWork.Complete())
            {
                return Ok("Theme deleted successfully.");
            }

            return BadRequest("Failed to delete the theme.");
        }
}
