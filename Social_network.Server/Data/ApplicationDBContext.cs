using Microsoft.EntityFrameworkCore;
using Social_network.Server.Models;

namespace Social_network.Server.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Picture> Pictures { get; set; }
        public DbSet<Post> Posts { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserState> UserStates { get; set; }
        public DbSet<Followers> Followers { get; set; }
        public DbSet<Role> AllRoles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<Avatar> Avatars { get; set; }
        public DbSet<Audio> Audios { get; set; }
        public DbSet<Attachment> Attachments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Nickname)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasMany(u => u.Posts)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId);

            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);

            modelBuilder.Entity<Picture>()
                .HasOne(p => p.User)
                .WithMany(u => u.Pictures)
                .HasForeignKey(p => p.UserId);

            modelBuilder.Entity<Avatar>()
                .HasOne(a => a.User)
                .WithOne(u => u.Avatar)
                .HasForeignKey<Avatar>(a => a.UserId);

            modelBuilder.Entity<Audio>()
                .HasOne(a => a.User)
                .WithMany(u => u.Audios)
                .HasForeignKey(a => a.UserId);

            modelBuilder.Entity<Post>()
                .HasOne(p => p.User)
                .WithMany(u => u.Posts)
                .HasForeignKey(p => p.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.Post)
                .WithMany(p => p.Comments)
                .HasForeignKey(c => c.PostId);

            modelBuilder.Entity<Comment>()
                .HasOne(c => c.User)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Followers>()
                .HasOne(f => f.Followed)
                .WithMany()
                .HasForeignKey(f => f.FollowedId);

            modelBuilder.Entity<Followers>()
                .HasOne(f => f.User)
                .WithMany()
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Followers>()
                .HasIndex(f => new { f.UserId, f.FollowedId })
                .IsUnique();

            modelBuilder.Entity<Role>()
                .HasIndex(r => r.Name)
                .IsUnique();

            modelBuilder.Entity<Followers>()
                .HasOne(f => f.Followed)
                .WithMany()
                .HasForeignKey(f => f.FollowedId)
                .OnDelete(DeleteBehavior.Restrict);

            // Use static, hardcoded values for seeding data
            var userRoleUserId = new Guid("1f18d0df-eaaa-412b-b4fa-62f935cef147");
            var userRoleAdminId = new Guid("70939c48-5ded-40e7-8646-a6ce6c989c3c");
            var userStateActiveId = new Guid("19e8c336-a7f0-4b63-b31c-8c0feefa0312");
            var userStateInactiveId = new Guid("3d1df7fc-8d73-4ca0-ab38-63d3f0960539");

            modelBuilder.Entity<Role>().HasData(
                new Role { Id = userRoleUserId, Name = "user" },
                new Role { Id = userRoleAdminId, Name = "admin" }
            );

            modelBuilder.Entity<UserState>().HasData(
                new UserState { Id = userStateActiveId, State = State.Active },
                new UserState { Id = userStateInactiveId, State = State.Inactive }
            );
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
                });

            // Other service configurations...
        }
    }
  
}
