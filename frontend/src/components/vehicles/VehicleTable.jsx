import VehicleStatusBadge from "./VehicleStatusBadge";

function VehicleTable({ data }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Vehicle Registry
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          List of all registered fleet vehicles.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr className="text-left text-sm font-semibold text-slate-600">
              <th className="px-6 py-4">Reg. No.</th>
              <th className="px-6 py-4">Vehicle</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4">Capacity</th>
              <th className="px-6 py-4">Odometer</th>
              <th className="px-6 py-4">Acq. Cost</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((vehicle) => (
              <tr
                key={vehicle.id}
                className="border-t border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-6 py-4 font-medium text-slate-800">
                  {vehicle.regNo}
                </td>

                <td className="px-6 py-4 text-slate-700">
                  {vehicle.vehicle}
                </td>

                <td className="px-6 py-4 text-slate-700">
                  {vehicle.type}
                </td>

                <td className="px-6 py-4 text-slate-700">
                  {vehicle.capacity}
                </td>

                <td className="px-6 py-4 text-slate-700">
                  {vehicle.odometer}
                </td>

                <td className="px-6 py-4 text-slate-700">
                  {vehicle.acquisitionCost}
                </td>

                <td className="px-6 py-4">
                  <VehicleStatusBadge status={vehicle.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default VehicleTable;