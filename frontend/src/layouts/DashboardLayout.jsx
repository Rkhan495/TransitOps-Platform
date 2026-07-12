import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";

function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="ml-64 flex min-h-screen flex-col">
        {/* Top Navigation */}
        <DashboardNavbar />

        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;