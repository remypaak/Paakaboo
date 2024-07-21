using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ThemeController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService) : BaseApiController
{

     [HttpPost("add-theme")]
        public async Task<IActionResult> AddTheme([FromForm] IFormFile file, [FromForm]ThemeDto themeDto)
        {
            var activeTheme = await unitOfWork.ThemeRepository.GetActiveTheme();
            if (activeTheme != null)
            {
                return BadRequest("There is already an active theme.");
            }

            var result = await photoService.AddPhotoAsync(file);

            if (result.Error != null)
        {
            return BadRequest(result.Error.Message + ", Not able to upload photo to Cloudinary");
        }


            var newTheme = new Theme
            {
                Name = themeDto.Name,
                WeekNumber = themeDto.WeekNumber,
                StartDate = themeDto.StartDate.ToUniversalTime(),
                SubmitEndDate = themeDto.SubmitEndDate.ToUniversalTime(),
                VoteEndDate = themeDto.VoteEndDate.ToUniversalTime(),
                ExampleUrl = result.SecureUrl.AbsoluteUri,
                ExamplePublicId = result.PublicId,
            };

            await unitOfWork.ThemeRepository.AddTheme(newTheme);

            // Save changes
            if (await unitOfWork.Complete())
            {
                return Ok( new {message = "Theme added successfully."});
            }

            return BadRequest("Failed to add the theme.");
        }


    [HttpGet("get-active-theme")]
    public async Task<ActionResult<ThemeDto>> GetActiveTheme()
    {
        var activeTheme = await unitOfWork.ThemeRepository.GetActiveTheme();
         if (activeTheme == null)
        {
            return NoContent();
        }
        var themeDto = mapper.Map<ThemeDto>(activeTheme);

        return Ok(themeDto);
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
