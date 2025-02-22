using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Social_network.Server.Auth;
using Social_network.Server.Data;
using Social_network.Server.Interfaces;
using Social_network.Server.Repository;
using System.Text;
using System.Text.Json.Serialization;
using Social_network.Server.Controllers;

var builder = WebApplication.CreateBuilder(args);

//builder.Services.AddControllers()
//    .AddJsonOptions(options =>
//    {
//        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
//    });

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDBContext>(opts => {
    opts.UseSqlServer(
    builder.Configuration["ConnectionStrings:DefaultConnection"]);
});



var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey))
{
    throw new ArgumentNullException(nameof(jwtKey), "JWT key cannot be null or empty.");
}
builder.Services.AddSingleton(new TokenService(jwtKey));
builder.Services.AddSingleton<PasswordHasherService>();

// Configure JWT authentication
var keyBytes = Encoding.ASCII.GetBytes(jwtKey);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes),
        ValidateLifetime = true
    };
})
.AddCookie(options =>
{
    options.Cookie.Name = "AuthToken";
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
    options.Events.OnRedirectToLogin = context =>
    {
        context.Response.StatusCode = 401;
        return Task.CompletedTask;
    };
});

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowCredentials", builder =>
    {
        builder.WithOrigins("https://localhost:55488") // Вкажіть дозволені джерела
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPost, PostRepository>();
builder.Services.AddScoped<IComment, CommentsRepository>();
builder.Services.AddScoped<IFollowers, FollowersRepository>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS policy
app.UseCors("AllowCredentials");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseRouting();

app.MapFallbackToFile("/index.html");

//app.MapCommentEndpoints();

app.Run();

