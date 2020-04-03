using IdentityServer4.EntityFramework.Options;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using WorldCities.Data.Models;

namespace WorldCities.Data
{
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        #region ctor
        public ApplicationDbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions)
            : base(options, operationalStoreOptions)
        {
        }
        #endregion

        #region Methods

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //Map Entity names to DB Table names
            modelBuilder.Entity<City>().ToTable("Cities");

            modelBuilder.Entity<Country>().ToTable("Countries");
        }
        #endregion

        #region Properties
        public DbSet<City> Cities { get; set; }
        public DbSet<Country> Countries { get; set; }
        #endregion
    }
}