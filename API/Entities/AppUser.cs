using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class AppUser : IdentityUser
{

    //Navigation property
    public List<Photo> Photos { get; set; } = [];
    public List<Vote> Votes { get; set; } = [];
}
