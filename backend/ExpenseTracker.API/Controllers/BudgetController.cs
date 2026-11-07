
using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BudgetController : ControllerBase
{
    private readonly ExpenseTrackerDbContext _context;

    public BudgetController(ExpenseTrackerDbContext context)
    {
        _context = context;
    }

    // GET: api/budget
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Budget>>> GetBudgets()
    {
        var budgets = await _context.Budgets
            .Include(b => b.Category)
            .ToListAsync();

        return Ok(budgets);
    }

    // GET: api/budget/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Budget>> GetBudgetById(int id)
    {
        var budget = await _context.Budgets
            .Include(b => b.Category)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (budget == null)
        {
            return NotFound();
        }

        return Ok(budget);
    }

    // POST: api/budget
    [HttpPost]
    public async Task<ActionResult<Budget>> CreateBudget(Budget budget)
    {
        if (budget.Limit <= 0 ||
            string.IsNullOrWhiteSpace(budget.Month))
        {
            return BadRequest("Valid budget limit and month are required.");
        }

        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == budget.CategoryId);

        if (category == null || category.Type != "Expense")
        {
            return BadRequest("Please select a valid expense category.");
        }

        _context.Budgets.Add(budget);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetBudgetById),
            new { id = budget.Id },
            budget
        );
    }

    // PUT: api/budget/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateBudget(
        int id, Budget updatedBudget)
    {
        var budget = await _context.Budgets.FindAsync(id);

        if (budget == null)
        {
            return NotFound();
        }

        if (updatedBudget.Limit <= 0 ||
            string.IsNullOrWhiteSpace(updatedBudget.Month))
        {
            return BadRequest("Valid budget limit and month are required.");
        }

        var category = await _context.Categories
            .FirstOrDefaultAsync(c => c.Id == updatedBudget.CategoryId);

        if (category == null || category.Type != "Expense")
        {
            return BadRequest("Please select a valid expense category.");
        }

        budget.Limit = updatedBudget.Limit;
        budget.Month = updatedBudget.Month;
        budget.CategoryId = updatedBudget.CategoryId;

        await _context.SaveChangesAsync();

        return Ok(budget);
    }

    // DELETE: api/budget/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteBudget(int id)
    {
        var budget = await _context.Budgets.FindAsync(id);

        if (budget == null)
        {
            return NotFound();
        }

        _context.Budgets.Remove(budget);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
