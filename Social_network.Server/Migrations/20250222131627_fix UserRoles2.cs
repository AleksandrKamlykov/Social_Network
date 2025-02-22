using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Social_network.Server.Migrations
{
    /// <inheritdoc />
    public partial class fixUserRoles2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AllRoles_Roles",
                table: "AllRoles");

            migrationBuilder.DropColumn(
                name: "Roles",
                table: "AllRoles");

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "AllRoles",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.UpdateData(
                table: "AllRoles",
                keyColumn: "Id",
                keyValue: new Guid("1f18d0df-eaaa-412b-b4fa-62f935cef147"),
                column: "Name",
                value: "user");

            migrationBuilder.UpdateData(
                table: "AllRoles",
                keyColumn: "Id",
                keyValue: new Guid("70939c48-5ded-40e7-8646-a6ce6c989c3c"),
                column: "Name",
                value: "admin");

            migrationBuilder.CreateIndex(
                name: "IX_AllRoles_Name",
                table: "AllRoles",
                column: "Name",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_AllRoles_Name",
                table: "AllRoles");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "AllRoles");

            migrationBuilder.AddColumn<int>(
                name: "Roles",
                table: "AllRoles",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "AllRoles",
                keyColumn: "Id",
                keyValue: new Guid("1f18d0df-eaaa-412b-b4fa-62f935cef147"),
                column: "Roles",
                value: 0);

            migrationBuilder.UpdateData(
                table: "AllRoles",
                keyColumn: "Id",
                keyValue: new Guid("70939c48-5ded-40e7-8646-a6ce6c989c3c"),
                column: "Roles",
                value: 1);

            migrationBuilder.CreateIndex(
                name: "IX_AllRoles_Roles",
                table: "AllRoles",
                column: "Roles",
                unique: true);
        }
    }
}
