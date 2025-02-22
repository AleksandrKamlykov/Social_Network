using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Social_network.Server.Migrations
{
    /// <inheritdoc />
    public partial class fixUserRoles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AllRoles_Users_UserId",
                table: "AllRoles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserRoles",
                table: "UserRoles");

            migrationBuilder.DropIndex(
                name: "IX_AllRoles_UserId",
                table: "AllRoles");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "UserRoles");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "AllRoles");

            migrationBuilder.RenameColumn(
                name: "Role",
                table: "AllRoles",
                newName: "Roles");

            migrationBuilder.RenameIndex(
                name: "IX_AllRoles_Role",
                table: "AllRoles",
                newName: "IX_AllRoles_Roles");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserRoles",
                table: "UserRoles",
                columns: new[] { "UserId", "RoleId" });

            migrationBuilder.CreateIndex(
                name: "IX_UserRoles_RoleId",
                table: "UserRoles",
                column: "RoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_AllRoles_RoleId",
                table: "UserRoles",
                column: "RoleId",
                principalTable: "AllRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoles_Users_UserId",
                table: "UserRoles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_AllRoles_RoleId",
                table: "UserRoles");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRoles_Users_UserId",
                table: "UserRoles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserRoles",
                table: "UserRoles");

            migrationBuilder.DropIndex(
                name: "IX_UserRoles_RoleId",
                table: "UserRoles");

            migrationBuilder.RenameColumn(
                name: "Roles",
                table: "AllRoles",
                newName: "Role");

            migrationBuilder.RenameIndex(
                name: "IX_AllRoles_Roles",
                table: "AllRoles",
                newName: "IX_AllRoles_Role");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "UserRoles",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "AllRoles",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserRoles",
                table: "UserRoles",
                column: "Id");

            migrationBuilder.UpdateData(
                table: "AllRoles",
                keyColumn: "Id",
                keyValue: new Guid("1f18d0df-eaaa-412b-b4fa-62f935cef147"),
                column: "UserId",
                value: null);

            migrationBuilder.UpdateData(
                table: "AllRoles",
                keyColumn: "Id",
                keyValue: new Guid("70939c48-5ded-40e7-8646-a6ce6c989c3c"),
                column: "UserId",
                value: null);

            migrationBuilder.CreateIndex(
                name: "IX_AllRoles_UserId",
                table: "AllRoles",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_AllRoles_Users_UserId",
                table: "AllRoles",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
