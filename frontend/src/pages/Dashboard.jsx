import DashboardLayout from "../layouts/DashboardLayout";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import KPIGrid from "../components/dashboard/KPIGrid";
import ChartCard from "../components/dashboard/ChartCard";
import VehicleStatusChart from "../components/dashboard/VehicleStatusChart";
import { dashboardKPIs } from "../data/dashboardData";
import { vehicleStatusData } from "../data/dashboardData";

function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <WelcomeBanner />

        {/* KPI Cards */}
        <KPIGrid data={dashboardKPIs} />

        {/* Charts */}
        <section className="grid gap-6 lg:grid-cols-2">
          <ChartCard
            title="Vehicle Status"
            subtitle="Current fleet distribution"
          >
            <VehicleStatusChart data={vehicleStatusData} />
          </ChartCard>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            Monthly Trips Chart
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            Fuel Cost Chart
          </div>

          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
            Fleet Utilization Chart
          </div>
        </section>

        {/* Recent Trips */}
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-700">
            Recent Trips Table
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            RecentTripsTable component will be rendered here.
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
