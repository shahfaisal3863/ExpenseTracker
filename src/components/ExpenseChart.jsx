
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useExpense } from "../context/ExpenseContext";

function ExpenseChart() {
  const { incomes, expenses } = useExpense();

  const currentYear = new Date().getFullYear();

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr",
    "May", "Jun", "Jul", "Aug",
    "Sep", "Oct", "Nov", "Dec",
  ];

  const data = monthNames.map((month, index) => {
    const monthNumber = String(index + 1).padStart(2, "0");
    const monthKey = `${currentYear}-${monthNumber}`;

    const monthlyIncome = incomes
      .filter((income) => income.date?.startsWith(monthKey))
      .reduce(
        (total, income) => total + Number(income.amount),
        0
      );

    const monthlyExpense = expenses
      .filter((expense) => expense.date?.startsWith(monthKey))
      .reduce(
        (total, expense) => total + Number(expense.amount),
        0
      );

    return {
      month,
      income: monthlyIncome,
      expense: monthlyExpense,
    };
  });

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mt-6 lg:mt-8">
      <h2 className="text-lg sm:text-xl font-bold text-slate-800">
        Income vs Expenses ({currentYear})
      </h2>

      <p className="text-sm text-gray-500 mt-1 mb-4 sm:mb-6">
        Monthly financial comparison
      </p>

      <div className="w-full h-64 sm:h-80 min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 5, left: -15, bottom: 5 }}
            barGap={4}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              interval="preserveStartEnd"
            />

            <YAxis
              tick={{ fontSize: 11 }}
              width={45}
            />

            <Tooltip />

            <Legend
              wrapperStyle={{ fontSize: "12px" }}
            />

            <Bar
              dataKey="income"
              name="Income"
              fill="#16a34a"
              radius={[5, 5, 0, 0]}
            />

            <Bar
              dataKey="expense"
              name="Expenses"
              fill="#ef4444"
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ExpenseChart;
