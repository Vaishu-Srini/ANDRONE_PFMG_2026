using System.Threading.Tasks;
using PFMG.DTOs;

namespace PFMG.Services
{
    public interface IWeaponService
    {
        Task<(bool Success, string Message, WeaponDto? Data)> SaveWeaponAsync(WeaponDto dto);
        Task<IEnumerable<WeaponDto>> GetAllWeaponsAsync();
        Task<(bool Success, string Message)> DeleteWeaponAsync(int id);
        Task<WeaponTreeDto?> GetWeaponTreeByIdAsync(int weaponId);


    }
}
