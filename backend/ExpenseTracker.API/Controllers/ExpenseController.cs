
using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ExpenseController : ControllerBase
{
    private readonly ExpenseTrackerDbContext _context;

    public ExpenseController(ExpenseTrackerDbContext context)
    {
        _context = context;
    }

    // GET: api/expense
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses()
    {
        var expenses = await _context.Expenses
            .Include(e => e.Category)
            .ToListAsync();

        return Ok(expenses);
    }

    // GET: api/expense/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Expense>> GetExpenseById(int id)
    {
        var expense = await _context.Expenses
            .Include(e => e.Category)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (expense == null)
        {
            return NotFound();
        }

        return Ok(expense);
    }

    // POST: api/expense
    [HttpPost]
    public async Task<ActionResult<Expense>> CreateExpense(Expense expense)
    {
        if (string.IsNullOrWhiteSpace(expense.Title) ||
            expense.Amount <= 0)
        {
            return BadRequest("Valid title and amount are required.");
        }

        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == expense.CategoryId);

        if (!categoryExists)
        {
            return BadRequest("Invalid category ID.");
        }

        _context.Expenses.Add(expense);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetExpenseById),
            new { id = expense.Id },
            expense
        );
    }

    // PUT: api/expense/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateExpense(
        int id, Expense updatedExpense)
    {
        var expense = await _context.Expenses.FindAsync(id);

        if (expense == null)
        {
            return NotFound();
        }

        if (string.IsNullOrWhiteSpace(updatedExpense.Title) ||
            updatedExpense.Amount <= 0)
        {
            return BadRequest("Valid title and amount are required.");
        }

        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == updatedExpense.CategoryId);

        if (!categoryExists)
        {
            return BadRequest("Invalid category ID.");
        }

        expense.Title = updatedExpense.Title;
        expense.Amount = updatedExpense.Amount;
        expense.Date = updatedExpense.Date;
        expense.CategoryId = updatedExpense.CategoryId;

        await _context.SaveChangesAsync();

        return Ok(expense);
    }

    // DELETE: api/expense/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteExpense(int id)
    {
        var expense = await _context.Expenses.FindAsync(id);

        if (expense == null)
        {
            return NotFound();
        }

        _context.Expenses.Remove(expense);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
