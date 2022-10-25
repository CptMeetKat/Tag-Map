using System.ComponentModel.DataAnnotations;

namespace MvcTag.Models
{
    public class Tag
    {
        public int Id { get; set; }
        public string? Message { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}