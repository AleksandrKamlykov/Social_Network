using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Social_network.Server.Migrations
{
    /// <inheritdoc />
    public partial class addaudios : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Attachments_Audios_AudioId",
                table: "Attachments");

            migrationBuilder.DropIndex(
                name: "IX_Attachments_AudioId",
                table: "Attachments");

            migrationBuilder.DropColumn(
                name: "AudioId",
                table: "Attachments");

            migrationBuilder.AddColumn<Guid>(
                name: "AttachmentId",
                table: "Audios",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_Audios_AttachmentId",
                table: "Audios",
                column: "AttachmentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Audios_Attachments_AttachmentId",
                table: "Audios",
                column: "AttachmentId",
                principalTable: "Attachments",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Audios_Attachments_AttachmentId",
                table: "Audios");

            migrationBuilder.DropIndex(
                name: "IX_Audios_AttachmentId",
                table: "Audios");

            migrationBuilder.DropColumn(
                name: "AttachmentId",
                table: "Audios");

            migrationBuilder.AddColumn<Guid>(
                name: "AudioId",
                table: "Attachments",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Attachments_AudioId",
                table: "Attachments",
                column: "AudioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Attachments_Audios_AudioId",
                table: "Attachments",
                column: "AudioId",
                principalTable: "Audios",
                principalColumn: "Id");
        }
    }
}
