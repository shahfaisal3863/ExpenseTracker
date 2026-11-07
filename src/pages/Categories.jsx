
import { useState } from "react";
import {
  Plus,
  Utensils,
  Car,
  ShoppingBag,
  HeartPulse,
  House,
  Folder,
  Pencil,
  Trash2,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useExpense } from "../context/ExpenseContext";
import { api } from "../services/api";

const categoryIcons = {
  Food: Utensils,
  Transport: Car,
  Shopping: ShoppingBag,
  Health: HeartPulse,
  Housing: House,
};

function Categories() {
  const {
    categories,
    incomes,
    expenses,
    budgets,
    refreshData,
  } = useExpense();

  const [showForm, setShowForm] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    type: "Expense",
  });

  const resetForm = () => {
    setFormData({ name: "", type: "Expense" });
    setEditingCategoryId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      type: category.type,
    });

    setEditingCategoryId(category.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const categoryName = formData.name.trim();

    if (!categoryName) {
      alert("Please enter a category name.");
      return;
    }

    const alreadyExists = categories.some(
      (category) =>
        category.id !== editingCategoryId &&
        category.name.toLowerCase() === categoryName.toLowerCase() &&
        category.type === formData.type
    );

    if (alreadyExists) {
      alert("This category already exists.");
      return;
    }

    const categoryData = {
      name: categoryName,
      type: formData.type,
    };

    try {
      setIsSaving(true);

      if (editingCategoryId !== null) {
        await api.put(
          `/Categories/${editingCategoryId}`,
          categoryData
        );
      } else {
        await api.post("/Categories", categoryData);
      }

      await refreshData();

      alert(
        editingCategoryId !== null
          ? "Category updated successfully."
          : "Category added successfully."
      );

      resetForm();
    } catch (error) {
      console.error("Category save error:", error);
      alert(error.message || "Unable to save category.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (category) => {
    const isUsedInIncome = incomes.some(
      (income) => income.categoryId === category.id
    );

    const isUsedInExpense = expenses.some(
      (expense) => expense.categoryId === category.id
    );

    const isUsedInBudget = budgets.some(
      (budget) => budget.categoryId === category.id
    );

    if (isUsedInIncome || isUsedInExpense || isUsedInBudget) {
      alert(
        "This category is being used in transactions or budgets. Remove those records first."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/Categories/${category.id}`);
      await refreshData();
      alert("Category deleted successfully.");
    } catch (error) {
      console.error("Category delete error:", error);
      alert(
        error.message ||
          "Unable to delete category. It may be in use."
      );
    }
  };

  return (
    <DashboardLayout>
      <div className="min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Categories
            </h1>
            <p className="text-gray-500 mt-2">
              Manage your income and expense categories.
            </p>
          </div>

          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5">
              {editingCategoryId !== null
                ? "Edit Category"
                : "Add New Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  maxLength={40}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving
                    ? "Saving..."
                    : editingCategoryId !== null
                    ? "Update Category"
                    : "Save Category"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSaving}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mt-6 lg:mt-8">
          {categories.map((category) => {
            const Icon = categoryIcons[category.name] || Folder;

            return (
              <div
                key={category.id}
                className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                    <Icon size={26} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-slate-800 text-lg break-words">
                      {category.name}
                    </h2>

                    <span
                      className={`text-sm ${
                        category.type === "Income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {category.type}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(category)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(category)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Categories;
