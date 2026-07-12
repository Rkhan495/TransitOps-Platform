import KPICard from "./KPICard";

function KPIGrid({ data }) {
  return (
    <section>
      {/* Section Header */}
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-800">
          Fleet Overview
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Key operational metrics for your transport fleet.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-3 xl:grid-cols-3">
        {data.map((item) => (
          <KPICard
            key={item.id}
            title={item.title}
            value={item.value}
            icon={item.icon}
            trend={item.trend}
            trendType={item.trendType}
            description={item.description}
          />
        ))}
      </div>
    </section>
  );
}

export default KPIGrid;