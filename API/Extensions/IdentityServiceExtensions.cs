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
            .AddPolicy("AdminRole", policy => policy.RequireRole("Admin"));

        return services;
    }
}
