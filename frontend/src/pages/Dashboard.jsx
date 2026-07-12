import DashboardLayout from "../layouts/DashboardLayout";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import KPIGrid from "../components/dashboard/KPIGrid";
import ChartCard from "../components/dashboard/ChartCard";
import VehicleStatusChart from "../components/dashboard/VehicleStatusChart";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../services/api";

function MonthlyTripsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="month" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="trips" fill="#F97316" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function RecentTripsTable({ data }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-5">
        <h2 className="text-lg font-semibold text-slate-800">Recent Trips</h2>
        <p className="mt-1 text-sm text-slate-500">
          Latest dispatched and draft trips from the database.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Trip
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Vehicle
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Driver
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {data.map((trip) => (
              <tr key={trip.id}>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">
                  {trip.id}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {trip.source} → {trip.destination}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {trip.vehicle}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {trip.driver}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {trip.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    dashboardKPIs: [],
    recentTripsData: [],
    vehicleStatusData: [],
    monthlyTripsData: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        const response = await api.get("/dashboard");

        if (!isMounted) return;

        setDashboardData(response.data);
        setError("");
      } catch (requestError) {
        if (!isMounted) return;

        setError(
          requestError.response?.data?.error ||
          "Failed to load dashboard data."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    const intervalId = window.setInterval(loadDashboard, 30000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
            Loading dashboard data...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        )}

        <WelcomeBanner />

        <KPIGrid data={dashboardData.dashboardKPIs} />

        <section className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Vehicle Status"
            subtitle="Current fleet distribution"
          >
            <VehicleStatusChart data={dashboardData.vehicleStatusData} />
          </ChartCard>

          <ChartCard title="Monthly Trips" subtitle="Trips created this year">
            <MonthlyTripsChart data={dashboardData.monthlyTripsData} />
          </ChartCard>
        </section>

        <RecentTripsTable data={dashboardData.recentTripsData} />
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
