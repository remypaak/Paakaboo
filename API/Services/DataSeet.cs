using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using CsvHelper;
using CsvHelper.Configuration;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class VoteData
    {
        public string Spelers { get; set; }
        public string Titel { get; set; }
        public string Url { get; set; }
        public string PublicId { get; set; }
        public string Vote1 { get; set; }
        public string Vote2 { get; set; }
        public string Vote3 { get; set; }
        public string Vote4 { get; set; }
        public string Vote5 { get; set; }
        public string Vote6 { get; set; }
        public string Vote7 { get; set; }
        public string Vote8 { get; set; }
        public string Vote9 { get; set; }
        public string Vote10 { get; set; }
    }

    public class CsvService
    {
        public List<VoteData> ReadVoteData(string filePath)
        {
            var config = new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                Delimiter = ";",
            };
            using (var reader = new StreamReader(filePath))
            using (var csv = new CsvReader(reader, config))
            {
                var records = csv.GetRecords<VoteData>().ToList();
                return records;
            }
        }
    }

    public class DataSeeder
    {
        private readonly DataContext _context;
        private readonly CsvService _csvService;

        public DataSeeder(DataContext context, CsvService csvService)
        {
            _context = context;
            _csvService = csvService;
        }

        public async Task SeedData()
        {
            // Assuming you have a method to get users
            var users = new List<string>
            {
                "Andreas",
                "Djeno",
                "Dustin",
                "Jeany",
                "Jeffrey",
                "Jessy",
                "Jordy",
                "Remy",
                "Rhandy",
                "Sanne",
                "Sheree",
                "Vera"
            };

            // Define the themes
            var themes = new List<Theme>
            {
                new Theme
                {
                    Name = "Herinneringen uit de kindertijd",
                    WeekNumber = 1,
                    ExampleUrl = "",
                    ExamplePublicId = "",
                    StartDate = DateTime.Now.AddDays(-30),
                    SubmitEndDate = DateTime.Now.AddDays(-25),
                    VoteEndDate = DateTime.Now.AddDays(-20),
                    TrophyEndDate = DateTime.Now.AddDays(-15)
                },
                new Theme
                {
                    Name = "Eten en drinken",
                    WeekNumber = 2,
                    ExampleUrl = "",
                    ExamplePublicId = "",
                    StartDate = DateTime.Now.AddDays(-14),
                    SubmitEndDate = DateTime.Now.AddDays(-9),
                    VoteEndDate = DateTime.Now.AddDays(-5),
                    TrophyEndDate = DateTime.Now.AddDays(-3)
                }
            };

            await _context.Themes.AddRangeAsync(themes);
            await _context.SaveChangesAsync();

            // Read the CSV file

            List<VoteData> voteDataList = new List<VoteData>();
            
            foreach (var theme in themes)
            {   
                if (theme.Name == "Herinneringen uit de kindertijd")
                {
                    voteDataList = _csvService.ReadVoteData("Services/weekje nummero 1.csv");
                }
                else
                {
                    voteDataList = _csvService.ReadVoteData("Services/thema2.csv");
                }


                var photos = new List<Photo>();
                foreach (var row in voteDataList)
                {
                    var userName = row.Spelers;
                    var user = _context.Users.FirstOrDefault(u => u.UserName == userName);

                    if (user != null)
                    {
                        var photo = new Photo
                        {
                            Title = row.Titel,
                            Url = row.Url,
                            PublicId = row.PublicId,
                            AppUserId = user.Id,
                            ThemeId = theme.Id // Assuming all photos belong to the first theme
                        };

                        photos.Add(photo);
                    }
                }

                await _context.Photos.AddRangeAsync(photos);
                await _context.SaveChangesAsync();

                // Add votes to the database after photos are added
                var votes = new List<Vote>();

                foreach (var row in voteDataList)
                {
                    var userName = row.Spelers;
                    var user = _context.Users.FirstOrDefault(u => u.UserName == userName);

                    if (user != null)
                    {
                        for (int i = 1; i <= 10; i++)
                        {
                            var voteRecipientName = row.GetType().GetProperty($"Vote{i}").GetValue(row, null)?.ToString();
                            var voteRecipient = _context.Users.FirstOrDefault(u => u.UserName == voteRecipientName);

                            if (voteRecipient != null)
                            {
                                var recipientPhoto = _context.Photos.FirstOrDefault(p => p.AppUserId == voteRecipient.Id && p.ThemeId == theme.Id);
                                var vote = new Vote
                                {
                                    AppUserId = user.Id,
                                    PhotoId = recipientPhoto.Id,
                                    Points = i // Assuming vote points correspond to Vote 1 -> 1 point, Vote 2 -> 2 points, etc.
                                };

                                votes.Add(vote);

                                // Increment the total score for the photo
                                recipientPhoto.TotalScore += i;
                                _context.Photos.Update(recipientPhoto);
                            }
                        }

                        // Update the photo with the new total score
                    }
                }

                await _context.Votes.AddRangeAsync(votes);
                await _context.SaveChangesAsync();
            }
        }
    }
    // Add photos to the database first

}