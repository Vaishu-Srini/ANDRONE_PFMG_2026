namespace PFMG.DTOs
{
    public class UserDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } // Admin/User
    }

    public class UserLoginDTO
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
