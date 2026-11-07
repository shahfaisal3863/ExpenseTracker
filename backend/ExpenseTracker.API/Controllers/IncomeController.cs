
using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class IncomeController : ControllerBase
{
    private readonly ExpenseTrackerDbContext _context;

    public IncomeController(ExpenseTrackerDbContext context)
    {
        _context = context;
    }

    // GET: api/income
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Income>>> GetIncomes()
    {
        var incomes = await _context.Incomes
            .Include(i => i.Category)
            .ToListAsync();

        return Ok(incomes);
    }

    // GET: api/income/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Income>> GetIncomeById(int id)
    {
        var income = await _context.Incomes
            .Include(i => i.Category)
            .FirstOrDefaultAsync(i => i.Id == id);

        if (income == null)
        {
            return NotFound();
        }

        return Ok(income);
    }

    // POST: api/income
    [HttpPost]
    public async Task<ActionResult<Income>> CreateIncome(Income income)
    {
        if (string.IsNullOrWhiteSpace(income.Title) ||
            income.Amount <= 0)
        {
            return BadRequest("Valid title and amount are required.");
        }

        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == income.CategoryId);

        if (!categoryExists)
        {
            return BadRequest("Invalid category ID.");
        }

        _context.Incomes.Add(income);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetIncomeById),
            new { id = income.Id },
            income
        );
    }

    // PUT: api/income/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateIncome(
        int id, Income updatedIncome)
    {
        var income = await _context.Incomes.FindAsync(id);

        if (income == null)
        {
            return NotFound();
        }

        if (string.IsNullOrWhiteSpace(updatedIncome.Title) ||
            updatedIncome.Amount <= 0)
        {
            return BadRequest("Valid title and amount are required.");
        }

        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == updatedIncome.CategoryId);

        if (!categoryExists)
        {
            return BadRequest("Invalid category ID.");
        }

        income.Title = updatedIncome.Title;
        income.Amount = updatedIncome.Amount;
        income.Date = updatedIncome.Date;
        income.CategoryId = updatedIncome.CategoryId;

        await _context.SaveChangesAsync();

        return Ok(income);
    }

    // DELETE: api/income/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteIncome(int id)
    {
        var income = await _context.Incomes.FindAsync(id);

        if (income == null)
        {
            return NotFound();
        }

        _context.Incomes.Remove(income);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
