import {
  LayoutDashboard,
  Car,
  Users,
  Route,
  Wrench,
  Fuel,
  ReceiptIndianRupee,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const navigationItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Vehicles",
    path: "/vehicles",
    icon: Car,
  },
  {
    name: "Drivers",
    path: "/driver",
    icon: Users,
  },
  {
    name: "Trips",
    path: "/trips",
    icon: Route,
  },
  {
    name: "Maintenance",
    path: "/maintenance",
    icon: Wrench,
  },
  {
    name: "Fuel Logs",
    path: "/fuel-logs",
    icon: Fuel,
  },
  {
    name: "Expenses",
    path: "/expenses",
    icon: ReceiptIndianRupee,
  },
  {
    name: "Reports",
    path: "/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

function DashboardSidebar() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();
  const currentUser = {
    name: storedUser.full_name || "Fleet User",
    role: storedUser.role || "Fleet Manager",
  };

  const normalizedRole = (currentUser.role || "").toLowerCase().replace(/\s+/g, "");

  const canAccess = (itemName) => {
    if (normalizedRole === "fleetmanager") return true;

    const accessMap = {
      Dashboard: ["fleetmanager", "safetyofficer", "dispatcher", "despatcher", "financeanalyst"],
      Vehicles: ["fleetmanager", "safetyofficer", "dispatcher", "despatcher", "financeanalyst"],
      Drivers: ["fleetmanager", "safetyofficer", "dispatcher", "despatcher"],
      Trips: ["fleetmanager", "dispatcher", "despatcher"],
      Maintenance: ["fleetmanager", "safetyofficer", "financeanalyst"],
      "Fuel Logs": ["fleetmanager", "safetyofficer", "financeanalyst"],
      Expenses: ["fleetmanager", "financeanalyst"],
      Reports: ["fleetmanager", "financeanalyst"],
      Settings: ["fleetmanager"],
    };

    return (accessMap[itemName] || []).includes(normalizedRole);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-18 items-center border-b border-slate-200 px-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800">
            TransitOps
          </h1>

          <p className="text-xs text-slate-500">Smart Transport Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </p>

        <ul className="space-y-1">
          {navigationItems.filter((item) => canAccess(item.name)).map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={20}
                        className={
                          isActive
                            ? "text-orange-500"
                            : "text-slate-500 group-hover:text-slate-700"
                        }
                      />

                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-slate-200 p-4">
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white">
            {(currentUser.name || "F").split(" ").map((part) => part[0]).slice(0, 2).join("")}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              {currentUser.name}
            </p>

            <p className="text-xs text-slate-500">{currentUser.role}</p>
          </div>
        </div>

        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          type="button"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
