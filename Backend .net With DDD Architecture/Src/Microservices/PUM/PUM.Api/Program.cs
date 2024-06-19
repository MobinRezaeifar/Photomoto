using PUM.Infrastructure.Configuration;
using PUM.Application.Services.Registers;
using PUM.Infrastructure.Repositories.Registers;
using PUM.Domain.Repositories.Interfaces.Registers;
using PUM.Domain.Repositories.Interfaces.Connections;
using PUM.Infrastructure.Repositories.Connections;
using PUM.Application.Services.Connections;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using Microsoft.Extensions.Options;
using StackExchange.Redis;
using PUM.Utils;
using PUM.Api.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Configure JWT settings
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

// Configure MongoDB settings
builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection("MongoDBSettings"));

// Configure Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "PUM", Version = "v1" }); // PUM: Photomoto Users Management
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
    c.AddSecurityRequirement(new OpenApiSecurityRequirement { { securityScheme, new[] { "Bearer" } } });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder => builder.WithOrigins("http://localhost:3000") 
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials());
});

// Configure JWT token service
builder.Services.AddSingleton<ITokenService>(provider =>
{
    var jwtSettings = provider.GetRequiredService<IOptions<JwtSettings>>().Value;
    return new TokenService(jwtSettings.Key, jwtSettings.Issuer, jwtSettings.Audience);
});

// Configure MongoDB client
builder.Services.AddSingleton<IMongoClient, MongoClient>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MongoDBSettings>>().Value;
    return new MongoClient(settings.ConnectionString);
});

// Configure Redis connection
builder.Services.AddSingleton<IConnectionMultiplexer>(opt =>
{
    var redisUrl = builder.Configuration.GetConnectionString("Redis");
    return ConnectionMultiplexer.Connect(redisUrl);
});

// Configure repositories
builder.Services.AddScoped<IRegisterRepository, RegistersRepositories>();
builder.Services.AddScoped<IConnectionsRepository, ConnectionsRepositories>();

// Configure services
builder.Services.AddScoped<RegistersService>();
builder.Services.AddScoped<ConnectionService>();

// Configure controllers and endpoints
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure authentication with JWT
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
    app.UseSwaggerUI();
}
app.UseCors("AllowSpecificOrigin");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
