
import ExpenseChart from "../components/ExpenseChart";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { useExpense } from "../context/ExpenseContext";

function Dashboard() {
  const {
    incomes,
    expenses,
    totalIncome,
    totalExpenses,
    totalBalance,
  } = useExpense();

  const formatCurrency = (amount) => {
    return `$${Number(amount).toLocaleString()}`;
  };

  // Combine Income and Expense transactions
  const transactions = [
    ...incomes.map((income) => ({
      ...income,
      title: income.description,
      type: "income",
    })),
    ...expenses.map((expense) => ({
      ...expense,
      title: expense.description,
      type: "expense",
    })),
  ].sort((a, b) => {
    return (
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  });

  // Show latest 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  const stats = [
    {
      title: "Total Balance",
      amount: formatCurrency(totalBalance),
      icon: Wallet,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Income",
      amount: formatCurrency(totalIncome),
      icon: TrendingUp,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Expenses",
      amount: formatCurrency(totalExpenses),
      icon: TrendingDown,
      color: "bg-red-100 text-red-600",
    },
    {
      title: "Total Savings",
      amount: formatCurrency(totalBalance),
      icon: PiggyBank,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }
    );
  };

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-gray-500 mt-2">
          Welcome back! Here's your financial overview.
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mt-6 lg:mt-8">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="bg-white p-4 sm:p-5 lg:p-6 rounded-xl shadow-sm border border-gray-100 min-w-0"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500">
                      {stat.title}
                    </p>

                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-2">
                      {stat.amount}
                    </h2>
                  </div>

                  <div
                    className={`p-2 sm:p-3 rounded-lg shrink-0 ${stat.color}`}
                  >
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <ExpenseChart />

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-6 lg:mt-8">
          <div className="flex items-center justify-between gap-3 p-4 sm:p-6 border-b border-gray-100">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                Recent Transactions
              </h2>

              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Your latest financial activities
              </p>
            </div>
          </div>

          {/* Mobile Transaction Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No transactions available yet.
              </p>
            ) : (
              recentTransactions.map((transaction) => (
                <div
                  key={`${transaction.type}-${transaction.id}`}
                  className="p-4 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-700 truncate">
                      {transaction.title}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {transaction.category} ·{" "}
                      {formatDate(transaction.date)}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`font-semibold ${
                        transaction.type === "income"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </p>

                    <span
                      className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${
                        transaction.type === "income"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {transaction.type === "income"
                        ? "Income"
                        : "Expense"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Tablet and Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">
                    Transaction
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Category
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Date
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Amount
                  </th>
                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-gray-500 py-10"
                    >
                      No transactions available yet.
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((transaction) => (
                    <tr
                      key={`${transaction.type}-${transaction.id}`}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-slate-700">
                        {transaction.title}
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {transaction.category}
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {formatDate(transaction.date)}
                      </td>

                      <td
                        className={`px-6 py-4 font-semibold ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {transaction.type === "income" ? (
                            <ArrowDownLeft size={14} />
                          ) : (
                            <ArrowUpRight size={14} />
                          )}

                          {transaction.type === "income"
                            ? "Income"
                            : "Expense"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
