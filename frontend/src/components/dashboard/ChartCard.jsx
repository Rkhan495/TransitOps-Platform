function ChartCard({
  title,
  subtitle,
  action,
  children,
  className = "",
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md ${className}`}
    >
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            {title}
          </h3>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-500">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <div>
            {action}
          </div>
        )}
      </div>

      {/* Chart Content */}
      <div className="h-80">
        {children}
      </div>
    </div>
  );
}

export default ChartCard;