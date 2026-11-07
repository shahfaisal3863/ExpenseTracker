
import { useState } from "react";
import {
  TrendingUp,
  Plus,
  ArrowUpRight,
  Pencil,
  Trash2,
} from "lucide-react";
import DashboardLayout from "../layouts/DashboardLayout";
import { useExpense } from "../context/ExpenseContext";
import { api } from "../services/api";

function Income() {
  const {
    incomes,
    totalIncome,
    categories,
    refreshData,
  } = useExpense();

  const incomeCategories = categories.filter(
    (category) => category.type === "Income"
  );

  const getInitialFormData = () => ({
    amount: "",
    category: incomeCategories[0]?.name || "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
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

    const selectedCategory = incomeCategories.find(
      (category) => category.name === formData.category
    );

    if (!selectedCategory) {
      alert("Please select a valid income category.");
      return;
    }

    const incomeData = {
      title: formData.description.trim(),
      amount: Number(formData.amount),
      date: formData.date,
      categoryId: selectedCategory.id,
    };

    try {
      setIsSaving(true);

      if (editingIncome) {
        await api.put(`/Income/${editingIncome.id}`, incomeData);
      } else {
        await api.post("/Income", incomeData);
      }

      await refreshData();

      setFormData(getInitialFormData());
      setEditingIncome(null);
      setShowForm(false);

      alert(
        editingIncome
          ? "Income updated successfully."
          : "Income added successfully."
      );
    } catch (error) {
      console.error("Income save error:", error);
      alert(error.message || "Unable to save income.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (income) => {
    setEditingIncome(income);

    setFormData({
      amount: income.amount,
      category: income.category,
      date: income.date,
      description: income.description,
    });

    setShowForm(true);
  };

  const handleDelete = async (income) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this income?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/Income/${income.id}`);
      await refreshData();
      alert("Income deleted successfully.");
    } catch (error) {
      console.error("Income delete error:", error);
      alert(error.message || "Unable to delete income.");
    }
  };

  const handleCancel = () => {
    setFormData(getInitialFormData());
    setEditingIncome(null);
    setShowForm(false);
  };

  return (
    <DashboardLayout>
      <div className="min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Income
            </h1>
            <p className="text-gray-500 mt-2">
              Manage and track your income.
            </p>
          </div>

          <button
            onClick={() => {
              if (showForm) {
                handleCancel();
              } else {
                setFormData(getInitialFormData());
                setEditingIncome(null);
                setShowForm(true);
              }
            }}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
          >
            <Plus size={18} />
            Add Income
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6 p-5 sm:p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-5">
              {editingIncome ? "Edit Income" : "Add New Income"}
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
                    disabled={incomeCategories.length === 0}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>
                      Select Income Category
                    </option>

                    {incomeCategories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  {incomeCategories.length === 0 && (
                    <p className="text-sm text-red-500 mt-2">
                      Please add an Income category first.
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
                  disabled={incomeCategories.length === 0 || isSaving}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving
                    ? "Saving..."
                    : editingIncome
                    ? "Update Income"
                    : "Save Income"}
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
              <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                <TrendingUp size={26} />
              </div>

              <div>
                <p className="text-gray-500 text-sm">Total Income</p>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                  ${totalIncome.toLocaleString()}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1 text-green-600 bg-green-50 px-3 py-2 rounded-lg">
              <ArrowUpRight size={18} />
              <span className="text-sm font-medium">Income</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6 p-5 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-800">
            Income Transactions
          </h2>

          {incomes.length === 0 ? (
            <div className="text-center py-10">
              <TrendingUp size={36} className="text-gray-300 mx-auto" />
              <p className="text-gray-500 mt-3">
                No income records available yet.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Your income transactions will appear here.
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
                  {incomes.map((income) => (
                    <tr key={income.id} className="border-b last:border-0">
                      <td className="py-4 pr-4 font-medium text-slate-800">
                        {income.description}
                      </td>

                      <td className="py-4 pr-4 text-gray-600">
                        {income.category}
                      </td>

                      <td className="py-4 pr-4 text-gray-600">
                        {income.date}
                      </td>

                      <td className="py-4 text-right font-semibold text-green-600">
                        +${Number(income.amount).toLocaleString()}
                      </td>

                      <td className="py-4 pl-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(income)}
                            title="Edit Income"
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(income)}
                            title="Delete Income"
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

export default Income;
