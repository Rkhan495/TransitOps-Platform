import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Truck,
  Users,
  Navigation,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userOpen, setUserOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Fleet", icon: Truck, path: "/fleet" },
    { label: "Drivers", icon: Users, path: "/drivers" },
    { label: "Trips", icon: Navigation, path: "/trips" },
    { label: "Maintenance", icon: Wrench, path: "/maintenance" },
    { label: "Fuel & Expenses", icon: Fuel, path: "/fuel-expenses" },
    { label: "Analytics", icon: BarChart3, path: "/analytics" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white">TransitOps</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? "bg-orange-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => setUserOpen(!userOpen)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">
                {user.full_name?.charAt(0) || "U"}
              </span>
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-white">
                {user.full_name || "User"}
              </p>
              <p className="text-xs text-slate-400">{user.role || "Role"}</p>
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 transition-transform ${
              userOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {userOpen && (
          <div className="mt-2 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
