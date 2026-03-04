using System.ComponentModel.DataAnnotations;
using PFMG.Enums;
namespace PFMG.Models
{
    public class PfmgFileStorage
    {
        [Key]
        public int FileId { get; set; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public byte[] FileData { get; set; }
        public DateTime UploadedOn { get; set; }

        public int areaInterestId { get; set; }

        public PfmgType pfmgType {get; set;} 
        
        public int missionId { get; set; }
    }
}
