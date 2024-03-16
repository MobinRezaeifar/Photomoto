using Microsoft.Extensions.Options;
using MongoDB.Driver;
using WebApplication1.Configuration;
using WebApplication1.Hubs;
using WebApplication1.Modals;
using WebApplication1.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSignalR();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddTransient<IManageImage, ManageImage>();

builder.Services.Configure<StoreDatabaseSettings>(
    builder.Configuration.GetSection("DatabaseSettings")
);

builder.Services.AddSingleton<IStoreDatabaseSettings>(sp =>
    sp.GetRequiredService<IOptions<StoreDatabaseSettings>>().Value
);

builder.Services.AddSingleton<IMongoClient>(s => new MongoClient(
    builder.Configuration.GetValue<string>("DatabaseSettings:ConnectionString")
));

builder.Services.AddScoped<IRegistersService, RegistersService>();
builder.Services.AddScoped<IPostsService, PostsService>();
builder.Services.AddScoped<IMessagesService, MessagesService>();

builder.Services.AddControllers();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(builder =>
    {
        builder
            .WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
builder.Services.AddSingleton<IDictionary<string, Change>>(opts => new Dictionary<
    string,
    Change
>());

builder.Services.AddCors();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseDeveloperExceptionPage();
}
app.UseRouting();

app.UseCors();
app.UseCors(builder =>
{
    builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
});
app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<ChangeHub>("/change");
});
app.UseHttpsRedirection();

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1"));

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
