using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using StackExchange.Redis;
using Swashbuckle.AspNetCore.SwaggerGen;
using WebApplication1.Configuration;
using WebApplication1.Hubs;
using WebApplication1.Modals;
using WebApplication1.Services;
using WebApplication1.Services.ManageFile;
using WebApplication1.Services.Post;
using WebApplication1.Services.Register;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc(
        "v1",
        new Microsoft.OpenApi.Models.OpenApiInfo { Title = "Photomoto", Version = "v85" }
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


builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddTransient<IManageFile, ManageFile>();

builder.Services.Configure<StoreDatabaseSettings>(
    builder.Configuration.GetSection("DatabaseSettings")
);

builder.Services.AddSingleton<IStoreDatabaseSettings>(sp =>
    sp.GetRequiredService<IOptions<StoreDatabaseSettings>>().Value
);

builder.Services.AddSingleton<IMongoClient>(s => new MongoClient(
    builder.Configuration.GetValue<string>("DatabaseSettings:ConnectionString")
));
builder.Services.AddGrpc().AddJsonTranscoding();

builder.Services.AddScoped<IRegistersService, RegistersService>();
builder.Services.AddScoped<IPostsService, PostsService>();
builder.Services.AddScoped<IMessagesService, MessagesService>();
builder.Services.AddScoped<ILoginService, LoginService>();

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder
            .WithOrigins("http://localhost:3000", "http://localhost:58734")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.Services.AddScoped<IConnectionHandelService, ConnectionHandelService>();

builder.Services.AddSingleton<IConnectionMultiplexer>(opt =>
{
    var redisUrl = builder.Configuration.GetConnectionString("Redis");
    return ConnectionMultiplexer.Connect(redisUrl);
});

builder
    .Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidIssuer = "admin@gmail.com",
            ValidAudience = "client@gmail.com",
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    "abcdefghijklomnpqrstuvwxyz12345678900987654321abcdefghijklomnpqrstuvwxyz12345678900987654321"
                )
            ),
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
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API Name v1");
    });
    app.UseDeveloperExceptionPage();
}

app.UseRouting();

app.UseCors();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapGrpcService<VideoCallDetailService>();

app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<ChangeHub>("/change");
    endpoints.MapHub<OnlineUserChatHub>("/onlineUsers");
    endpoints.MapControllers();

});

app.Run();
