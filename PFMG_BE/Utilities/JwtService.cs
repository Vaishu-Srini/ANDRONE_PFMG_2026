using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using PFMG.Models;
using Microsoft.Extensions.Configuration;
using System.Net;
using PFMG.DTOs;

namespace PFMG.Utilities

{
    public class JwtService
    {
        private readonly IConfiguration _config;
        public JwtService(IConfiguration config) { _config = config; }

        public string GenerateToken(User user)
        {
            var key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, user.Username),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"])),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"]
            };
            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }


    public class ApiResponse<T>
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public T Payload { get; set; }

        public ApiResponse(HttpStatusCode statusCode, string message, T payload)
        {
            StatusCode = (int)statusCode; // Convert enum to int
            Message = message;
            Payload = payload;
        }
    }


    // public static class GeoHelper
    // {
    //     public static bool IsPointInPolygon(double pointLat, double pointLng, List<AreaInterestCoordinate> polygon)
    //     {
    //         int n = polygon.Count;
    //         bool result = false;
    //         int j = n - 1;

    //         for (int i = 0; i < n; i++)
    //         {
    //             double latI = double.Parse(polygon[i].Latitude);
    //             double lngI = double.Parse(polygon[i].Longitude);
    //             double latJ = double.Parse(polygon[j].Latitude);
    //             double lngJ = double.Parse(polygon[j].Longitude);

    //             if ((lngI < pointLng && lngJ >= pointLng || lngJ < pointLng && lngI >= pointLng)
    //                 && (latI + (pointLng - lngI) / (lngJ - lngI) * (latJ - latI) < pointLat))
    //             {
    //                 result = !result;
    //             }
    //             j = i;
    //         }
    //         return result;
    //     }
    // }

    public static class GeoHelper
    {
        public static bool IsPointInPolygon(double pointLat, double pointLng, ICollection<AreaInterestCoordinate> polygon)
        {
            if (polygon == null || polygon.Count < 3)
                return false;

            var pts = new List<(double Lat, double Lng)>();
            foreach (var c in polygon)
            {
                if (double.TryParse(c.Latitude, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var lat)
                && double.TryParse(c.Longitude, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var lng))
                {
                    pts.Add((lat, lng));
                }
            }

            bool inside = false;
            int j = pts.Count - 1;
            for (int i = 0; i < pts.Count; i++)
            {
                if (((pts[i].Lng > pointLng) != (pts[j].Lng > pointLng)) &&
                    (pointLat < (pts[j].Lat - pts[i].Lat) * (pointLng - pts[i].Lng) / (pts[j].Lng - pts[i].Lng + double.Epsilon) + pts[i].Lat))
                {
                    inside = !inside;
                }
                j = i;
            }
            return inside;
        }
    }




}
