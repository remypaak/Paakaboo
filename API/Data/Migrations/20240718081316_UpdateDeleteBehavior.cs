using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDeleteBehavior : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Themes_ThemeId",
                table: "Photos");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Themes_ThemeId",
                table: "Photos",
                column: "ThemeId",
                principalTable: "Themes",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Themes_ThemeId",
                table: "Photos");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Themes_ThemeId",
                table: "Photos",
                column: "ThemeId",
                principalTable: "Themes",
                principalColumn: "Id");
        }
    }
}
