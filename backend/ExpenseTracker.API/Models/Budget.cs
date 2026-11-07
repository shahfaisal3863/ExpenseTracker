namespace ExpenseTracker.API.Models;

public class Budget
{
    public int Id { get; set; }

    public decimal Limit { get; set; }

    public string Month { get; set; } = string.Empty;

    public int CategoryId { get; set; }

    public Category? Category { get; set; }
}