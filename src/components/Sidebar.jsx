
import {
  LayoutDashboard,
  ArrowDownCircle,
  ArrowUpCircle,
  Tags,
  Wallet,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Income", icon: ArrowDownCircle, path: "/income" },
    { name: "Expenses", icon: ArrowUpCircle, path: "/expenses" },
    { name: "Categories", icon: Tags, path: "/categories" },
    { name: "Budgets", icon: Wallet, path: "/budgets" },
  ];

  return (
    <aside className="w-full md:w-64 md:min-h-screen shrink-0 bg-slate-900 text-white flex flex-col p-5">
      <h1 className="text-2xl font-bold mb-6 md:mb-10">
        <span className="text-white">Expense</span>
        <span className="text-blue-400">Track</span>
      </h1>

      <nav className="flex-1 flex flex-row flex-wrap md:flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-2 md:gap-3 px-3 md:px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span className="text-sm md:text-base">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="hidden md:block border-t border-slate-700 pt-5 mt-5 space-y-3">
        <div className="flex items-center gap-3 px-4 py-2 text-slate-400">
          <Settings size={20} />
          <span>Settings</span>
        </div>

        <div className="flex items-center gap-3 px-4 py-2 text-red-400">
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
