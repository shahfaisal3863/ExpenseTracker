
import { useState } from "react";
import {
  Wallet,
  Plus,
  Utensils,
  Car,
  ShoppingBag,
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
};

const budgetColors = [
  "bg-orange-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-pink-500",
];

function Budgets() {
  const {
    budgets,
    categories,
    refreshData,
  } = useExpense();

  const expenseCategories = categories.filter(
    (category) => category.type === "Expense"
  );

  const getInitialFormData = () => ({
    name: expenseCategories[0]?.name || "",
    limit: "",
    month: new Date().toISOString().slice(0, 7),
  });

  const [showForm, setShowForm] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState(null);
  const [formData, setFormData] = useState(getInitialFormData);
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setFormData(getInitialFormData());
    setEditingBudgetId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (budget) => {
    setFormData({
      name: budget.name,
      limit: String(budget.limit),
      month: budget.month,
    });

    setEditingBudgetId(budget.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const budgetLimit = Number(formData.limit);

    if (!formData.name || !formData.month || budgetLimit <= 0) {
      alert("Please enter valid budget details.");
      return;
    }

    const selectedCategory = expenseCategories.find(
      (category) => category.name === formData.name
    );

    if (!selectedCategory) {
      alert("Please select a valid Expense category.");
      return;
    }

    const alreadyExists = budgets.some(
      (budget) =>
        budget.id !== editingBudgetId &&
        Number(budget.categoryId) === Number(selectedCategory.id) &&
        budget.month === formData.month
    );

    if (alreadyExists) {
      alert("A budget for this category and month already exists.");
      return;
    }

    const budgetData = {
      limit: budgetLimit,
      month: formData.month,
      categoryId: Number(selectedCategory.id),
    };

    try {
      setIsSaving(true);

      if (editingBudgetId !== null) {
        await api.put(`/Budget/${editingBudgetId}`, budgetData);
        alert("Budget updated successfully.");
      } else {
        await api.post("/Budget", budgetData);
        alert("Budget added successfully.");
      }

      await refreshData();
      resetForm();
    } catch (error) {
      console.error("Budget save error:", error);
      alert(error.message || "Unable to save budget.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (budget) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the ${budget.name} budget for ${budget.month}?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/Budget/${budget.id}`);
      await refreshData();
      alert("Budget deleted successfully.");
    } catch (error) {
      console.error("Budget delete error:", error);
      alert(error.message || "Unable to delete budget.");
    }
  };

  return (
    <DashboardLayout>
      <div className="min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Budgets
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your monthly spending limits.
            </p>
          </div>

          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setFormData(getInitialFormData());
                setShowForm(true);
              }
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
          >
            <Plus size={18} />
            Add Budget
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5">
              {editingBudgetId !== null
                ? "Edit Budget"
                : "Add New Budget"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>

                <select
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={expenseCategories.length === 0 || isSaving}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select Expense Category
                  </option>

                  {expenseCategories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>

                {expenseCategories.length === 0 && (
                  <p className="text-sm text-red-500 mt-2">
                    Please add an Expense category first.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Amount
                </label>

                <input
                  type="number"
                  name="limit"
                  value={formData.limit}
                  onChange={handleChange}
                  placeholder="Enter budget amount"
                  min="0.01"
                  step="0.01"
                  required
                  disabled={isSaving}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Month
                </label>

                <input
                  type="month"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  required
                  disabled={isSaving}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={expenseCategories.length === 0 || isSaving}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving
                    ? "Saving..."
                    : editingBudgetId !== null
                    ? "Update Budget"
                    : "Save Budget"}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSaving}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mt-6 lg:mt-8">
          {budgets.map((budget) => {
            const Icon = categoryIcons[budget.name] || Folder;

            const percentage =
              budget.limit > 0
                ? Math.min((budget.spent / budget.limit) * 100, 100)
                : 0;

            const remaining = budget.limit - budget.spent;
            const isOverBudget = remaining < 0;

            const color =
              budget.color ||
              budgetColors[budgets.indexOf(budget) % budgetColors.length];

            return (
              <div
                key={budget.id}
                className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 min-w-0 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <Icon size={24} className="text-slate-700" />
                    </div>

                    <div>
                      <h2 className="font-semibold text-slate-800">
                        {budget.name}
                      </h2>

                      <p className="text-xs text-gray-400 mt-1">
                        {budget.month || "Monthly Budget"}
                      </p>
                    </div>
                  </div>

                  <Wallet size={20} className="text-gray-400 shrink-0" />
                </div>

                <div className="mt-6">
                  <div className="flex justify-between gap-2 text-sm mb-2">
                    <span className="text-gray-500">Spent</span>

                    <span className="font-semibold text-slate-800">
                      ${budget.spent} / ${budget.limit}
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`${color} h-2.5 rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center gap-2 mt-3">
                    <p
                      className={`text-sm ${
                        isOverBudget ? "text-red-600" : "text-gray-500"
                      }`}
                    >
                      {isOverBudget
                        ? `$${Math.abs(remaining)} over budget`
                        : `$${remaining} remaining`}
                    </p>

                    <span className="text-sm font-semibold text-slate-700">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 mt-5 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleEdit(budget)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    <Pencil size={16} />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(budget)}
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

export default Budgets;
