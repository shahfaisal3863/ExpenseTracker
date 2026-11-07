
import { useState } from "react";
import {
  TrendingDown,
  Plus,
  ArrowDownRight,
  Pencil,
  Trash2,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useExpense } from "../context/ExpenseContext";
import { api } from "../services/api";

function Expenses() {
  const {
    expenses,
    totalExpenses,
    categories,
    refreshData,
  } = useExpense();

  const expenseCategories = categories.filter(
    (category) => category.type === "Expense"
  );

  const getInitialFormData = () => ({
    amount: "",
    category: expenseCategories[0]?.name || "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState(getInitialFormData);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedCategory = expenseCategories.find(
      (category) => category.name === formData.category
    );

    if (!selectedCategory) {
      alert("Please select a valid expense category.");
      return;
    }

    const expenseData = {
      title: formData.description.trim(),
      amount: Number(formData.amount),
      date: formData.date,
      categoryId: selectedCategory.id,
    };

    try {
      setIsSaving(true);

      if (editingExpense) {
        await api.put(`/Expense/${editingExpense.id}`, expenseData);
      } else {
        await api.post("/Expense", expenseData);
      }

      await refreshData();

      setFormData(getInitialFormData());
      setEditingExpense(null);
      setShowForm(false);

      alert(
        editingExpense
          ? "Expense updated successfully."
          : "Expense added successfully."
      );
    } catch (error) {
      console.error("Expense save error:", error);
      alert(error.message || "Unable to save expense.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);

    setFormData({
      amount: expense.amount,
      category: expense.category,
      date: expense.date,
      description: expense.description,
    });

    setShowForm(true);
  };

  const handleDelete = async (expense) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/Expense/${expense.id}`);
      await refreshData();
      alert("Expense deleted successfully.");
    } catch (error) {
      console.error("Expense delete error:", error);
      alert(error.message || "Unable to delete expense.");
    }
  };

  const handleCancel = () => {
    setFormData(getInitialFormData());
    setEditingExpense(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <div className="min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Expenses
            </h1>

            <p className="text-gray-500 mt-2">
              Manage and track your expenses.
            </p>
          </div>

          <button
            onClick={() => {
              if (showForm) {
                handleCancel();
              } else {
                setFormData(getInitialFormData());
                setEditingExpense(null);
                setShowForm(true);
              }
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
          >
            <Plus size={18} />
            Add Expense
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5">
              {editingExpense ? "Edit Expense" : "Add New Expense"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>

                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    min="0.01"
                    step="0.01"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>

                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    disabled={expenseCategories.length === 0}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>
                      Select Expense Category
                    </option>

                    {expenseCategories.map((category) => (
                      <option
                        key={category.id}
                        value={category.name}
                      >
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
                    Date
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>

                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={expenseCategories.length === 0 || isSaving}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving
                    ? "Saving..."
                    : editingExpense
                    ? "Update Expense"
                    : "Save Expense"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white p-5 sm:p-6 rounded-xl shadow-sm border border-gray-100 mt-6 lg:mt-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-red-100 text-red-600 p-3 rounded-lg">
                <TrendingDown size={26} />
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Total Expenses
                </p>

                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                  ${totalExpenses.toLocaleString()}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <ArrowDownRight size={18} />
              <span className="text-sm font-medium">
                Expenses
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6 p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">
            Expense Transactions
          </h2>

          {expenses.length === 0 ? (
            <div className="text-center py-10">
              <TrendingDown
                size={36}
                className="text-gray-300 mx-auto"
              />

              <p className="text-gray-500 mt-3">
                No expense records available yet.
              </p>

              <p className="text-sm text-gray-400 mt-1">
                Your expense transactions will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto mt-5">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b text-gray-500 text-sm">
                    <th className="py-3 pr-4">Description</th>
                    <th className="py-3 pr-4">Category</th>
                    <th className="py-3 pr-4">Date</th>
                    <th className="py-3 text-right">Amount</th>
                    <th className="py-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {expenses.map((expense) => (
                    <tr
                      key={expense.id}
                      className="border-b last:border-0"
                    >
                      <td className="py-4 pr-4 font-medium text-slate-800">
                        {expense.description}
                      </td>

                      <td className="py-4 pr-4 text-gray-600">
                        {expense.category}
                      </td>

                      <td className="py-4 pr-4 text-gray-600">
                        {expense.date}
                      </td>

                      <td className="py-4 text-right font-semibold text-red-600">
                        -${Number(expense.amount).toLocaleString()}
                      </td>

                      <td className="py-4 pl-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(expense)}
                            title="Edit Expense"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(expense)}
                            title="Delete Expense"
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Expenses;
