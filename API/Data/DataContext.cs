using API.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext(DbContextOptions options) : IdentityDbContext<AppUser>(options)
{
    public DbSet<Photo> Photos { get; set; }
    public DbSet<Theme> Themes { get; set; }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Photo>()
        .HasOne(p => p.Theme)
        .WithMany(t => t.Photos)
        .HasForeignKey(p => p.ThemeId)
        .OnDelete(DeleteBehavior.SetNull); 
    }
}
