import { ArrowDownRight, ArrowUpRight } from "lucide-react";

function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  trendType = "up",
  description,
}) {
  const isPositive = trendType === "up";

  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Top Section */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50">
          <Icon className="h-6 w-6 text-orange-500" />
        </div>

        <div
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
            isPositive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight size={14} />
          ) : (
            <ArrowDownRight size={14} />
          )}

          <span>{trend}</span>
        </div>
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      {/* Value */}
      <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-800">
        {value}
      </h3>

      {/* Footer */}
      <p className="mt-4 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

export default KPICard;