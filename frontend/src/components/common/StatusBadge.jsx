function StatusBadge({ status }) {
  const statusStyles = {
    Completed: "bg-emerald-100 text-emerald-700",
    "On Trip": "bg-blue-100 text-blue-700",
    Scheduled: "bg-amber-100 text-amber-700",
    Maintenance: "bg-red-100 text-red-700",
    Cancelled: "bg-slate-200 text-slate-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        statusStyles[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}

export default StatusBadge;