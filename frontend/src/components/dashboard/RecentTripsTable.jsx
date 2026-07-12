import StatusBadge from "../common/StatusBadge";

function RecentTripsTable({ data }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-800">
          Recent Trips
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Latest transport operations across the fleet.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="border-b border-slate-200">
            <tr className="text-left text-sm text-slate-500">
              <th className="pb-3 font-medium">Trip ID</th>
              <th className="pb-3 font-medium">Vehicle</th>
              <th className="pb-3 font-medium">Driver</th>
              <th className="pb-3 font-medium">Source</th>
              <th className="pb-3 font-medium">Destination</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((trip) => (
              <tr
                key={trip.id}
                className="border-b border-slate-100 transition hover:bg-slate-50"
              >
                <td className="py-4 font-medium text-slate-700">
                  {trip.id}
                </td>

                <td className="py-4">{trip.vehicle}</td>

                <td className="py-4">{trip.driver}</td>

                <td className="py-4">{trip.source}</td>

                <td className="py-4">{trip.destination}</td>

                <td className="py-4">
                  <StatusBadge status={trip.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RecentTripsTable;