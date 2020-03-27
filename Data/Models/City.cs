using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace WorldCities.Data.Models
{
    public class City
    {
        #region ctor

        public City() { }

        #endregion

        #region Properties

        /// <summary>
        ///  The unique id and primary key for the City
        /// </summary>
        [Key]
        [Required]
        public int Id { get; set; }

        /// <summary>
        /// City name (in UTF-8 format)
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// City name (in ASCII format)
        /// </summary>
        public string Name_ASCII { get; set; }

        /// <summary>
        /// City latitude
        /// </summary>
        [Column(TypeName="decimal(7,4)")]
        public decimal Lat { get; set; }

        /// <summary>
        /// City longitude
        /// </summary>
        [Column(TypeName="decimal(7,4)")]
        public decimal Lon { get; set; }

        /// <summary>
        ///  Country Id (foreign key)
        /// </summary>
        [ForeignKey("Country")]
        public int CountryId { get; set; }

        #endregion

        #region Navigation properties

        /// <summary>
        ///  The country related to this city
        /// </summary>
        public virtual Country Country { get; set; }

        #endregion
    }
}