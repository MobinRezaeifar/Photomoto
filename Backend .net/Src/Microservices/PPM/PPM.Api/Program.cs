
using System.Text;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using PPM.Api.Configuration;
using PPM.Infrastructure.Configuration;
using PPM.Domain.Repositories.Interfaces;
using PPM.Infrastructure.Repositories;
using PPM.Application.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using PPM.Utils;


var builder = WebApplication.CreateBuilder(args);

// Configure JwtSettings from appsettings.json
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

// Swagger configuration
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc(
        "v1",
        new Microsoft.OpenApi.Models.OpenApiInfo { Title = "PPM", Version = "v1" } //Photomoto Posts Management
    );
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Enter 'Bearer {token}'",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
    };
    c.AddSecurityDefinition("Bearer", securityScheme);
    c.AddSecurityRequirement(
        new OpenApiSecurityRequirement { { securityScheme, new[] { "Bearer" } } }
    );
});


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("http://localhost:3000", "https://symmetrical-waffle-9p7jxvp5w5ph7gvg-3000.app.github.dev/")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials());
});



builder.Services.AddSingleton<ITokenService>(provider =>
{
    var jwtSettings = provider.GetRequiredService<IOptions<JwtSettings>>().Value;
    return new TokenService(jwtSettings.Key, jwtSettings.Issuer, jwtSettings.Audience);
});

// Configure MongoDB settings
builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection("MongoDBSettings"));

// Connect to MongoDB
builder.Services.AddSingleton<IMongoClient, MongoClient>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MongoDBSettings>>().Value;
    return new MongoClient(settings.ConnectionString);
});

builder.Services.AddScoped<IPostsRepository, PostsRepository>();
builder.Services.AddScoped<PostsService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure JWT authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Key)),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true
    };
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
   {
       c.SwaggerEndpoint("/swagger/v1/swagger.json", "PPM v1");
       c.DocumentTitle = "PPM";
   });
}

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin");
app.UseAuthentication();
app.UseAuthorization();


app.MapControllers();

app.Run();
