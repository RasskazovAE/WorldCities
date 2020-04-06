using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorldCities.Data;
using WorldCities.Data.Models;

namespace WorldCities.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CitiesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CitiesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Cities
        // GET: api/Cities/?pageIndex=0&pageSize=10
        // GET: api/Cities/?pageIndex=0&pageSize=10&sortColumn=null&sortOrder=asc
        // GET: api/Cities/?pageIndex=0&pageSize=10&sortColumn=null&sortOrder=asc&filterColumn=null&filterQuery=null
        [HttpGet]
        public async Task<ActionResult<ApiResult<CityDTO>>> GetCities(
            int pageIndex = 0,
            int pageSize = 10,
            string sortColumn = null,
            string sortOrder = null,
            string filterColumn = null,
            string filterQuery = null)
        {
            return await ApiResult<CityDTO>.CreateAsync(
                _context.Cities.Select(e => new CityDTO
                {
                    Id = e.Id,
                    Name = e.Name,
                    Name_ASCII = e.Name_ASCII,
                    Lat = e.Lat,
                    Lon = e.Lon,
                    CountryId = e.Country.Id,
                    CountryName = e.Country.Name
                }),
                pageIndex,
                pageSize,
                sortColumn,
                sortOrder,
                filterColumn,
                filterQuery);
        }

        // GET: api/Cities/5
        [HttpGet("{id}")]
        public async Task<ActionResult<City>> GetCity(int id)
        {
            var city = await _context.Cities.FindAsync(id);
            if (city == null)
            {
                return NotFound();
            }
            return city;
        }

        // PUT: api/Cities/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCity(int id, City city)
        {
            if (id != city.Id)
            {
                return BadRequest();
            }
            _context.Entry(city).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CityExists(id))
                {
                    return NotFound();
                }
                else
                    throw;
            }
            return NoContent();
        }

        // POST: api/Cities
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for
        // more details see https://aka.ms/RazorPagesCRUD.
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<City>> PostCity(City city)
        {
            _context.Cities.Add(city);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCity), new { id = city.Id });
        }

        // DELETE: api/Citites/5
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult<City>> DeleteCity(int id)
        {
            var city = await _context.Cities.FindAsync(id);
            if (city == null)
            {
                return NotFound();
            }
            _context.Cities.Remove(city);
            await _context.SaveChangesAsync();

            return city;
        }

        [HttpPost]
        [Route("IsDupeCity")]
        public async Task<bool> IsDupeCity(City city)
        {
            return await _context.Cities.AnyAsync(e =>
                e.Name == city.Name &&
                e.Lat == city.Lat &&
                e.Lon == city.Lon &&
                e.CountryId == city.CountryId &&
                e.Id != city.Id);
        }

        private bool CityExists(int id)
        {
            return _context.Cities.Any(e => e.Id == id);
        }
    }
}