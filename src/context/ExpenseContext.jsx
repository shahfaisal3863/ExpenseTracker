
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const ExpenseContext = createContext();

const budgetColors = [
  "bg-orange-500",
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-pink-500",
];

const categoryColors = {
  Food: "bg-orange-500",
  Transport: "bg-blue-500",
  Shopping: "bg-purple-500",
  Health: "bg-green-500",
  Housing: "bg-pink-500",
};

function formatDate(date) {
  return date ? date.slice(0, 10) : "";
}

export function ExpenseProvider({ children }) {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshData = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [incomeData, expenseData, categoryData, budgetData] =
        await Promise.all([
          api.get("/Income"),
          api.get("/Expense"),
          api.get("/Categories"),
          api.get("/Budget"),
        ]);

      const formattedCategories = categoryData.map((category) => ({
        id: category.id,
        name: category.name,
        type: category.type,
      }));

      const formattedIncomes = incomeData.map((income) => ({
        id: income.id,
        amount: Number(income.amount),
        category: income.category?.name || "",
        categoryId: income.categoryId,
        date: formatDate(income.date),
        description: income.title,
      }));

      const formattedExpenses = expenseData.map((expense) => ({
        id: expense.id,
        amount: Number(expense.amount),
        category: expense.category?.name || "",
        categoryId: expense.categoryId,
        date: formatDate(expense.date),
        description: expense.title,
      }));

      const formattedBudgets = budgetData.map((budget, index) => {
        const spent = formattedExpenses
          .filter(
            (expense) =>
              expense.categoryId === budget.categoryId &&
              expense.date.slice(0, 7) === budget.month
          )
          .reduce(
            (total, expense) => total + Number(expense.amount),
            0
          );

        return {
          id: budget.id,
          name: budget.category?.name || "",
          categoryId: budget.categoryId,
          limit: Number(budget.limit),
          spent,
          month: budget.month,
          color:
            categoryColors[budget.category?.name] ||
            budgetColors[index % budgetColors.length],
        };
      });

      setCategories(formattedCategories);
      setIncomes(formattedIncomes);
      setExpenses(formattedExpenses);
      setBudgets(formattedBudgets);
    } catch (err) {
      console.error("Error loading expense tracker data:", err);
      setError(err.message || "Unable to load data from server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const totalIncome = incomes.reduce(
    (total, income) => total + Number(income.amount),
    0
  );

  const totalExpenses = expenses.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  const totalBalance = totalIncome - totalExpenses;

  return (
    <ExpenseContext.Provider
      value={{
        incomes,
        setIncomes,
        expenses,
        setExpenses,
        categories,
        setCategories,
        budgets,
        setBudgets,
        totalIncome,
        totalExpenses,
        totalBalance,
        isLoading,
        error,
        refreshData,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpense() {
  return useContext(ExpenseContext);
}
