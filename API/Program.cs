using System.Text;
using API.Data;
using API.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
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
    options.AddPolicy("CorsPolicy",
    builder => builder
    .WithOrigins("http://localhost:4200")
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials());
    });
var app = builder.Build();


app.UseCors("CorsPolicy");


app.UseAuthentication();
app.UseAuthorization();
app.MapDefaultControllerRoute();
app.MapControllers();
app.MapIdentityApi<IdentityUser>();

app.Run();
