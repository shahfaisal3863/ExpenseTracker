
using ExpenseTracker.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Data;

public class ExpenseTrackerDbContext : DbContext
{
    public ExpenseTrackerDbContext(
        DbContextOptions<ExpenseTrackerDbContext> options)
        : base(options)
    {
    }

    public DbSet<Category> Categories { get; set; }

    public DbSet<Income> Incomes { get; set; }

    public DbSet<Expense> Expenses { get; set; }

    public DbSet<Budget> Budgets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Income>()
            .Property(i => i.Amount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Expense>()
            .Property(e => e.Amount)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Budget>()
            .Property(b => b.Limit)
            .HasPrecision(18, 2);
    }
}
