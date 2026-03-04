using PFMG.Data;
using PFMG.Models;
using PFMG.Repositories;
using PFMG.Services;
using PFMG.Services.impl;
using PFMG.Utilities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json.Serialization;
using System;
using System.Security.Cryptography;


var builder = WebApplication.CreateBuilder(args);

// Ensure appsettings.json is loaded from the exe directory
var exeDir = AppContext.BaseDirectory;
builder.Configuration
    .SetBasePath(exeDir)
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables();

// 1. Add CORS policy before building the app
// 1. Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()   // Allow any origin
            .AllowAnyHeader()   // Allow any headers
            .AllowAnyMethod();  // Allow any HTTP method
    });
});

// ------------------- Logging -------------------
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/log.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions =>
        {
            sqlOptions.CommandTimeout(120); // ⏱ 120s timeout instead of 30
            sqlOptions.EnableRetryOnFailure(5); // retries for transient errors
        }
    )
    // optional: log SQL to console for debugging
    .EnableSensitiveDataLogging()
    .EnableDetailedErrors()
);

// ------------------- JWT Authentication -------------------
var jwtKey = builder.Configuration["Jwt:Key"]
             ?? throw new InvalidOperationException("JWT Key is missing in configuration");
var key = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"]
    };
});

builder.Services.AddAuthorization();
builder.Services.AddSingleton<JwtService>();
builder.Services.AddSingleton<WebSocketBroadcaster>();
builder.Services.AddSingleton<WebSocketHandler>();
builder.Services.AddSingleton<CsvWebSocketService>();

builder.Services.AddMemoryCache();


builder.Services.AddScoped<MissionRepository>();
builder.Services.AddScoped<IMissionService, MissionServiceImpl>();

builder.Services.AddScoped<PlatformRepository>(); 
builder.Services.AddScoped<IPlatformService, PlatformServiceImpl>();

builder.Services.AddScoped<IEmitterRepository, EmitterRepository>();
builder.Services.AddScoped<IEmitterService, EmitterServiceImpl>();

builder.Services.AddScoped<IModeRepository, ModeRepository>();
builder.Services.AddScoped<IModeService, ModeServiceImpl>();

builder.Services.AddScoped<IEmitterReadingRepository, EmitterReadingRepository>();


builder.Services.AddScoped<IJammingService, JammingServiceImpl>();

builder.Services.AddScoped<IPfmService, PfmServiceImpl>();
// builder.Services.AddScoped<IAreaInterestRepository, AreaInterestRepository>();

// builder.Services.AddScoped<IAreaInterestService, AreaInterestServiceImpl>();

builder.Services.AddScoped<IAreaInterestRepository, AreaInterestRepository>();

builder.Services.AddScoped<IAreaInterestService, AreaInterestServiceImpl>();
builder.Services.AddScoped<IAreaInterestCoordinateRepository, AreaInterestCoordinateRepository>();

builder.Services.AddScoped<WeaponRepository>();
builder.Services.AddScoped<IWeaponService, WeaponServiceImpl>();
builder.Services.AddScoped<EmitterModeLinkRepository>();
builder.Services.AddScoped<IEmitterModeLinkService, EmitterModeLinkServiceImpl>();
builder.Services.AddScoped<IWeaponService, WeaponServiceImpl>();
builder.Services.AddScoped<ITargetPhaseService, TargetPhaseServiceImpl>();

builder.Services.AddScoped<TcpCsvSender>();


builder.Services.AddScoped<IModeFrequencyDetailRepository, ModeFrequencyDetailRepository>();

builder.Services.AddScoped<IModePriDetailRepository, ModePriDetailRepository>();

builder.Services.AddScoped<IModePwDetailRepository, ModePwDetailRepository>();
builder.Services.AddScoped<IModeScanDetailRepository, ModeScanDetailRepository>();



builder.Services.AddScoped<IStandaloneJammingRepository, StandaloneJammingRepository>();
builder.Services.AddScoped<IIndependentJammingRepository, IndependentJammingRepository>();

builder.Services.AddScoped<ITargetPhaseRepository, TargetPhaseRepository>();
builder.Services.AddScoped<IStandaloneTargetPhaseRepository, StandaloneTargetPhaseRepository>(); 
builder.Services.AddScoped<IIndependentModeTargetPhaseRepository, IndependentModeTargetPhaseRepository>();
builder.Services.AddScoped<IIndependentModeJammingRepository, IndependentModeJammingRepository>();
builder.Services.AddScoped<IIndependentTargetPhaseRepository, IndependentTargetPhaseRepository>();



builder.Services.AddScoped<IJammingRepository, JammingRepository>();

builder.Services.AddHostedService<TelemetryTcpServer>();
builder.Services.AddScoped<TelemetryHelper>();
builder.Services.AddScoped<PfmGenerationService>();

builder.Services.AddScoped<PfmGenerationService>();


builder.Services.AddScoped<IEmitterLibraryRepository, EmitterLibraryRepository>();

builder.Services.AddScoped<IStandaloneModeRepository, StandaloneModeRepository>();
builder.Services.AddScoped<IIndependentModeRepository, IndependentModeRepository>();
builder.Services.AddScoped<IIndependentModeScanRepository, IndependentModeScanRepository>();
builder.Services.AddScoped<IIndependentModePwRepository, IndependentModePwRepository>();
builder.Services.AddScoped<IIndependentModePriRepository, IndependentModePriRepository>();
builder.Services.AddScoped<IIndependentModeFrequencyRepository, IndependentModeFrequencyRepository>();

builder.Services.AddScoped<IModeFrequencyDetailLibraryRepository, ModeFrequencyDetailLibraryRepository>();

builder.Services.AddScoped<IModePriDetailLibraryRepository, ModePriDetailLibraryRepository>();

builder.Services.AddScoped<IModePwDetailLibraryRepository, ModePwDetailLibraryRepository>();
builder.Services.AddScoped<IModeScanDetailLibraryRepository, ModeScanDetailLibraryRepository>();




// var key = RandomNumberGenerator.GetBytes(32);
// Console.WriteLine("PfmEncryptionKeyBase64 = " + Convert.ToBase64String(key));

builder.Services.AddScoped<PlatformLibraryRepository>();
// ------------------- Controllers & Swagger -------------------
//builder.Services.AddControllers();
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "PFMG API",
        Version = "v1",
        Description = "API documentation for PFMG project"
    });
});

var app = builder.Build();


using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated(); // Creates database + tables if they don't exist
}

// 2. Use CORS before Authentication/Authorization
app.UseCors("AllowAll");

// // ------------------- Middleware -------------------
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// Enable Swagger for all environments (Development, Production, etc.)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
});

app.UseWebSockets(); // must be before routing [web:144]

app.Map("/ws/telemetry", async (HttpContext ctx, WebSocketBroadcaster bus, ILoggerFactory lf) =>
{
    if (!ctx.WebSockets.IsWebSocketRequest)
    {
        ctx.Response.StatusCode = StatusCodes.Status400BadRequest;
        return;
    }

    using var ws = await ctx.WebSockets.AcceptWebSocketAsync();
    bus.Add(ws);
    var log = lf.CreateLogger("WsTelemetry");
    log.LogInformation("WS connected: {Remote}", ctx.Connection.RemoteIpAddress?.ToString());

    var buffer = new byte[1]; // server push only; read loop to keep socket alive
    try
    {
        while (ws.State == WebSocketState.Open)
        {
            var r = await ws.ReceiveAsync(buffer, ctx.RequestAborted);
            if (r.MessageType == WebSocketMessageType.Close) break;
        }
    }
    finally
    {
        bus.Remove(ws);
        try { await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "bye", ctx.RequestAborted); } catch { }
        log.LogInformation("WS disconnected");
    }
});

app.Map("/ws/csv", async context =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        var socket = await context.WebSockets.AcceptWebSocketAsync();
        var wsHandler = context.RequestServices.GetRequiredService<WebSocketHandler>();
        wsHandler.AddSocket(socket);

        var buffer = new byte[1024 * 4];
        while (socket.State == WebSocketState.Open)
        {
            var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            if (result.MessageType == WebSocketMessageType.Close)
                await wsHandler.RemoveSocketAsync(socket);
        }
    }
    else
    {
        context.Response.StatusCode = 400;
    }
});

var key1 = RandomNumberGenerator.GetBytes(32);
Console.WriteLine(Convert.ToBase64String(key1));

app.UseSerilogRequestLogging(); // log all requests

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.UseStaticFiles();
app.MapControllers();

app.Run();


