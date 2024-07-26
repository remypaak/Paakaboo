using System.Text;
using API.Data;
using API.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MySqlConnector;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var connectionString1 = Environment.GetEnvironmentVariable("ConnectionStrings_DefaultConnection");
Console.WriteLine($"Retrieved connection string (length {connectionString1?.Length ?? 0}): '{connectionString1}'");
var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings_DefaultConnection")
                              ?? builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<DataContext>(opt =>
{
    opt.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 32)));
});
builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        ValidateLifetime = false,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["TokenKey"]))


                    };
                });

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: "MyAllowSpecificOrigins",
                      builder =>
                      {
                          builder.WithOrigins("https://www.paakaboo.nl", "https://paakaboo.nl").AllowAnyHeader().AllowAnyMethod().AllowCredentials();
                      });
});


var app = builder.Build();
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<DataContext>();
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        // Log or handle the error as needed
        Console.WriteLine(ex.Message);
    }
}
app.UseCors("MyAllowSpecificOrigins");


app.UseAuthentication();
app.UseAuthorization();
app.MapDefaultControllerRoute();
app.MapControllers();
app.MapIdentityApi<IdentityUser>();

app.Run();
