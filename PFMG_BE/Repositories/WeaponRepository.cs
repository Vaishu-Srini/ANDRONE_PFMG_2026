using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using PFMG.Models;
using PFMG.Data;

namespace PFMG.Repositories
{
    public class WeaponRepository
    {
        private readonly AppDbContext _context;

        public WeaponRepository(AppDbContext context)
        {
            _context = context;
        }

        // ✅ Expose IQueryable
        public IQueryable<Weapon> Query()
        {
            return _context.weapons.AsQueryable();
        }

        public async Task<Weapon> AddWeaponAsync(Weapon weapon)
        {
            _context.weapons.Add(weapon);
            await _context.SaveChangesAsync();
            return weapon;
        }

        public async Task<Weapon?> GetWeaponByIdAsync(int id)
        {
            return await _context.weapons.FindAsync(id);
        }

        public async Task<Weapon?> GetWeaponByNameAsync(string name)
        {
            return await _context.weapons.FirstOrDefaultAsync(p => p.WeaponName == name);
        }

        // public async Task<IEnumerable<Weapon>> GetAllWeaponsAsync()
        // {
        //     return await _context.weapons.ToListAsync();
        // }

        public async Task<IEnumerable<Weapon>> GetAllWeaponsAsync()
        {
            return await _context.weapons
                .OrderByDescending(w => w.ModifiedDate)
                .ToListAsync();
        }

        public async Task UpdateWeaponAsync(Weapon weapon)
        {
            _context.weapons.Update(weapon);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteWeaponAsync(Weapon weapon)
        {
            _context.weapons.Remove(weapon);
            await _context.SaveChangesAsync();
        }

        public async Task<Weapon?> GetWeaponWithDetailsByIdAsync(int weaponId)
        {
            return await _context.weapons
                .Include(w => w.Emitters)
                    .ThenInclude(e => e.Modes)
                        .ThenInclude(m => m.Jammings)
                .Include(w => w.Emitters)
                    .ThenInclude(e => e.Modes)
                        .ThenInclude(m => m.ModeFrequencyDetails)
                .Include(w => w.Emitters)
                    .ThenInclude(e => e.Modes)
                        .ThenInclude(m => m.ModePwDetails)
                .Include(w => w.Emitters)
                    .ThenInclude(e => e.Modes)
                        .ThenInclude(m => m.ModePriDetails)
                .Include(w => w.Emitters)
                    .ThenInclude(e => e.Modes)
                        .ThenInclude(m => m.ModeScanDetails)
                .AsSplitQuery() // ✅ Prevents EF heavy JOIN query performance issues
                .FirstOrDefaultAsync(w => w.WeaponId == weaponId);
        }


        public async Task<List<Weapon>> GetWeaponsWithDetailsByIdsAsync(List<int> weaponIds)
        {
            return await _context.weapons
                .AsNoTracking()
                .Where(w => weaponIds.Contains(w.WeaponId))
                .Include(w => w.Emitters)
                    .ThenInclude(e => e.Modes)
                        .ThenInclude(m => m.Jammings)
                .Include(w => w.Emitters)
                    .ThenInclude(e => e.Modes)
                        .ThenInclude(m => m.ModeFrequencyDetails)
                .Include(w => w.Emitters)
                    .ThenInclude(e => e.Modes)
                        .ThenInclude(m => m.ModePwDetails)
                .Include(w => w.Emitters)
                    .ThenInclude(e => e.Modes)
                        .ThenInclude(m => m.ModePriDetails)
                .Include(w => w.Emitters)
                    .ThenInclude(e => e.Modes)
                        .ThenInclude(m => m.ModeScanDetails)
                .AsSplitQuery()
                .ToListAsync();
        }



        public async Task<bool> ExistsAsync(int weaponId, string name)
        {
            return await _context.weapons.AnyAsync(w => w.WeaponId == weaponId && w.WeaponName == name);
        }

    }
}
