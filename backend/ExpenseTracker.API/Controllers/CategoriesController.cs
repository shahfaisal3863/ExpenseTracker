
using ExpenseTracker.API.Data;
using ExpenseTracker.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ExpenseTracker.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ExpenseTrackerDbContext _context;

    public CategoriesController(ExpenseTrackerDbContext context)
    {
        _context = context;
    }

    // GET: api/categories
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
    {
        var categories = await _context.Categories.ToListAsync();
        return Ok(categories);
    }

    // GET: api/categories/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Category>> GetCategoryById(int id)
    {
        var category = await _context.Categories.FindAsync(id);

        if (category == null)
        {
            return NotFound();
        }

        return Ok(category);
    }

    // POST: api/categories
    [HttpPost]
    public async Task<ActionResult<Category>> CreateCategory(Category category)
    {
        if (string.IsNullOrWhiteSpace(category.Name) ||
            string.IsNullOrWhiteSpace(category.Type))
        {
            return BadRequest("Category name and type are required.");
        }

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetCategoryById),
            new { id = category.Id },
            category
        );
    }

    // PUT: api/categories/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCategory(
        int id, Category updatedCategory)
    {
        var category = await _context.Categories.FindAsync(id);

        if (category == null)
        {
            return NotFound();
        }

        if (string.IsNullOrWhiteSpace(updatedCategory.Name) ||
            string.IsNullOrWhiteSpace(updatedCategory.Type))
        {
            return BadRequest("Category name and type are required.");
        }

        category.Name = updatedCategory.Name;
        category.Type = updatedCategory.Type;

        await _context.SaveChangesAsync();

        return Ok(category);
    }

   
// DELETE: api/categories/1
[HttpDelete("{id:int}")]
public async Task<IActionResult> DeleteCategory(int id)
{
    var category = await _context.Categories.FindAsync(id);

    if (category == null)
    {
        return NotFound();
    }

    bool hasIncomes = await _context.Incomes
        .AnyAsync(i => i.CategoryId == id);

    bool hasExpenses = await _context.Expenses
        .AnyAsync(e => e.CategoryId == id);

    bool hasBudgets = await _context.Budgets
        .AnyAsync(b => b.CategoryId == id);

    if (hasIncomes || hasExpenses || hasBudgets)
    {
        return BadRequest(
            "Cannot delete this category because it has related records."
        );
    }

    _context.Categories.Remove(category);
    await _context.SaveChangesAsync();

    return NoContent();
}

}
