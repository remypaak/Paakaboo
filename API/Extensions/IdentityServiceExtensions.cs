using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Extensions;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
    {
         services.AddIdentityApiEndpoints<AppUser>()
            .AddRoles<IdentityRole>()
            .AddRoleManager<RoleManager<IdentityRole>>()
            .AddEntityFrameworkStores<DataContext>();
        
        services.AddAuthorizationBuilder()
            .AddPolicy("RequireModeratorRole", policy => policy.RequireRole("Moderator"));

        return services;
    }
}
