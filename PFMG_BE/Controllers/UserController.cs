using Microsoft.AspNetCore.Mvc;
using PFMG.Data;
using PFMG.Models;
using PFMG.Utilities;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Net;


[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly JwtService _jwtService;

    public UserController(AppDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(PFMG.DTOs.UserDTO dto)
    {
        if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
            return BadRequest("Username already exists");

        var user = new User
        {
            Username = dto.Username,
            Password = Convert.ToBase64String(SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(dto.Password))),
            Role = dto.Role
        };
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        var response = new ApiResponse<string>(HttpStatusCode.OK, "User registered", null);

        return StatusCode((int)HttpStatusCode.OK, response);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(PFMG.DTOs.UserLoginDTO dto)
    {
        var passwordHash = Convert.ToBase64String(
            SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(dto.Password))
        );

        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == dto.Username && u.Password == passwordHash);

        if (user == null)
        {
            var errorResponse = new ApiResponse<string>(
                HttpStatusCode.Unauthorized,
                "Invalid credentials",
                null
            );
            return StatusCode((int)HttpStatusCode.Unauthorized, errorResponse);
        }

        var token = _jwtService.GenerateToken(user);
        var userToken  = new UserToken
        {
            Token = token,
            UserId = user.Id
            
        };
        _context.userTokens.Add(userToken);
        await _context.SaveChangesAsync();

        var successResponse = new ApiResponse<string>(
            HttpStatusCode.OK,
            "Success",
            token
        );

        return StatusCode((int)HttpStatusCode.OK, successResponse);
    }

}
