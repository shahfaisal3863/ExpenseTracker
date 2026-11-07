
import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

export default DashboardLayout;
