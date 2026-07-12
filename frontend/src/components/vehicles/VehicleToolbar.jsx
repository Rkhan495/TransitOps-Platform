import { Plus, Search } from "lucide-react";

function VehicleToolbar({
  search = "",
  type = "",
  status = "",
  regNo = "",
  onSearchChange = () => {},
  onTypeChange = () => {},
  onStatusChange = () => {},
  onRegNoChange = () => {},
  onAddVehicle = () => {},
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Filters */}
        <div className="flex flex-1 flex-wrap gap-4">
          {/* Search */}
          <div className="relative min-w-60 flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-orange-400"
            />
          </div>

          {/* Status */}
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-orange-400"
          >
            <option value="">Type: All</option>
            <option value="Mini Truck">Mini Truck</option>
            <option value="Pickup">Pickup</option>
            <option value="Truck">Truck</option>
          </select>
        </div>

        {/* Add Vehicle Button */}
        <button
          type="button"
          onClick={onAddVehicle}
          className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          <Plus size={18} />
          Add Vehicle
        </button>
      </div>
    </section>
  );
}

export default VehicleToolbar;
