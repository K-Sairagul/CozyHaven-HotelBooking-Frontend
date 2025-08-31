using Microsoft.EntityFrameworkCore;
using Cozy_Haven___HotelBooking.Models;

namespace Cozy_Haven___HotelBooking.Data
{
    public class CozyHavenDbContext : DbContext
    {
        public CozyHavenDbContext(DbContextOptions<CozyHavenDbContext> options)
             : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Hotel> Hotels { get; set; }
        public DbSet<Room> Rooms { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Payment> Payments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Room configuration
            modelBuilder.Entity<Room>(entity =>
            {
                entity.Property(r => r.BaseFare)
                    .HasColumnType("decimal(18,2)");

                entity.HasOne(r => r.Hotel)
                    .WithMany(h => h.Rooms)
                    .HasForeignKey(r => r.HotelId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Booking configuration
            modelBuilder.Entity<Booking>(entity =>
            {
                entity.Property(b => b.TotalAmount)
                    .HasColumnType("decimal(18,2)");

                entity.Property(b => b.BookingStatus)
                    .HasDefaultValue("Pending");

                entity.Property(b => b.IsPaid)
                    .HasDefaultValue(false);

                entity.HasOne(b => b.User)
                    .WithMany(u => u.Bookings)
                    .HasForeignKey(b => b.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(b => b.Room)
                    .WithMany()
                    .HasForeignKey(b => b.RoomId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(b => b.Hotel)
                    .WithMany()
                    .HasForeignKey(b => b.HotelId)
                    .OnDelete(DeleteBehavior.Restrict);
            });


            // Configure Review
            modelBuilder.Entity<Review>(entity =>
            {
                entity.Property(r => r.Rating)
                      .HasColumnType("decimal(3,1)");
            });

            // Payment configuration
            modelBuilder.Entity<Payment>(entity =>
            {
                entity.Property(p => p.AmountPaid)
                    .HasColumnType("decimal(18,2)");

                entity.HasOne(p => p.Booking)
                    .WithOne(b => b.Payment)
                    .HasForeignKey<Payment>(p => p.BookingId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}















