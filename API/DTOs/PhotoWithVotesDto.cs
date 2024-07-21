namespace API.DTOs;

 public class PhotoWithVotesDto
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required string Url { get; set; }
        public int? Points { get; set; }
        public bool IsUserPhoto { get; set; }
    }