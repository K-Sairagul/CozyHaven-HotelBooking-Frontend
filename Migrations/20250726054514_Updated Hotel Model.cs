using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Cozy_Haven___HotelBooking.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedHotelModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HotelOwnerId",
                table: "Hotels",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Hotels_HotelOwnerId",
                table: "Hotels",
                column: "HotelOwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Hotels_Users_HotelOwnerId",
                table: "Hotels",
                column: "HotelOwnerId",
                principalTable: "Users",
                principalColumn: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Hotels_Users_HotelOwnerId",
                table: "Hotels");

            migrationBuilder.DropIndex(
                name: "IX_Hotels_HotelOwnerId",
                table: "Hotels");

            migrationBuilder.DropColumn(
                name: "HotelOwnerId",
                table: "Hotels");
        }
    }
}
