import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Search, TrendingUp } from "lucide-react";
import axios from "axios";

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/analytics/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAnalyticsData(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-slate-950 p-8">
          <div className="flex items-center justify-center h-96">
            <p className="text-slate-400">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-slate-900 border-b border-slate-800 p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-white">
              Reports & Analytics
            </h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-slate-800 text-white placeholder-slate-500 rounded-lg border border-slate-700 focus:outline-none focus:border-orange-600"
                />
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-white">
                    {user.full_name?.charAt(0) || "U"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {user.full_name}
                  </p>
                  <p className="text-xs text-slate-400">{user.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Content */}
        <div className="p-8 space-y-8">
          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Fuel Efficiency */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors">
              <p className="text-slate-400 text-sm font-medium mb-2">
                FUEL EFFICIENCY
              </p>
              <p className="text-4xl font-bold text-white mb-2">
                {analyticsData?.fuel_efficiency?.toFixed(2) || "0.00"} km/l
              </p>
              <p className="text-xs text-slate-500">
                ROI = (Revenue - Maintenance - Fuel) / Acquisition Cost
              </p>
            </div>

            {/* Fleet Utilization */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors">
              <p className="text-slate-400 text-sm font-medium mb-2">
                FLEET UTILIZATION
              </p>
              <p className="text-4xl font-bold text-green-400 mb-2">
                {analyticsData?.fleet_utilization?.toFixed(1) || "0.0"}%
              </p>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${analyticsData?.fleet_utilization || 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Operational Cost */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors">
              <p className="text-slate-400 text-sm font-medium mb-2">
                OPERATIONAL COST
              </p>
              <p className="text-4xl font-bold text-white mb-2">
                ₹{analyticsData?.operational_cost?.toLocaleString() || "0"}
              </p>
              <p className="text-xs text-slate-500">Monthly expenses</p>
            </div>

            {/* Vehicle ROI */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-colors">
              <p className="text-slate-400 text-sm font-medium mb-2">
                VEHICLE ROI
              </p>
              <p className="text-4xl font-bold text-orange-400 mb-2">
                {analyticsData?.vehicle_roi?.toFixed(2) || "0.00"}%
              </p>
              <div className="flex items-center space-x-1 text-xs text-slate-500">
                <TrendingUp className="w-3 h-3" />
                <span>Return on investment</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Revenue */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-white font-semibold mb-4">MONTHLY REVENUE</h3>
              <div className="flex items-end justify-between h-48 space-x-2">
                {analyticsData?.monthly_revenue?.map((value, idx) => (
                  <div
                    key={idx}
                    className="flex-1 bg-blue-600 rounded-t-sm hover:bg-blue-500 transition-colors"
                    style={{
                      height: `${(value / Math.max(...analyticsData.monthly_revenue)) * 100}%`,
                      minHeight: "10px",
                    }}
                    title={`Month ${idx + 1}: ₹${value}`}
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-4">
                7 months of revenue data
              </p>
            </div>

            {/* Top Costliest Vehicles */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-white font-semibold mb-4">
                TOP COSTLIEST VEHICLES
              </h3>
              <div className="space-y-3">
                {analyticsData?.top_costliest_vehicles?.map((vehicle, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <span className="text-slate-400 text-sm min-w-fit">
                      {vehicle.name}
                    </span>
                    <div className="flex-1 bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          idx === 0
                            ? "bg-red-500"
                            : idx === 1
                              ? "bg-orange-500"
                              : idx === 2
                                ? "bg-blue-500"
                                : "bg-slate-600"
                        }`}
                        style={{
                          width: `${(vehicle.cost / Math.max(...analyticsData.top_costliest_vehicles.map((v) => v.cost))) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-slate-300 text-sm font-medium min-w-fit">
                      ₹{vehicle.cost.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <p className="text-slate-400 text-sm font-medium mb-2">
                ACTIVE VEHICLES
              </p>
              <p className="text-3xl font-bold text-white">
                {analyticsData?.active_vehicles || "0"}
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <p className="text-slate-400 text-sm font-medium mb-2">
                TOTAL TRIPS
              </p>
              <p className="text-3xl font-bold text-white">
                {analyticsData?.total_trips || "0"}
              </p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <p className="text-slate-400 text-sm font-medium mb-2">
                AVERAGE DISTANCE
              </p>
              <p className="text-3xl font-bold text-white">
                {analyticsData?.average_distance?.toFixed(2) || "0.00"} km
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
