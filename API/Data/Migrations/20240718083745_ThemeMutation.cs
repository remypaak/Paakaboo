using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class ThemeMutation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EndDate",
                table: "Themes",
                newName: "VoteEndDate");

            migrationBuilder.AddColumn<DateTime>(
                name: "SubmitEndDate",
                table: "Themes",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubmitEndDate",
                table: "Themes");

            migrationBuilder.RenameColumn(
                name: "VoteEndDate",
                table: "Themes",
                newName: "EndDate");
        }
    }
}
