// import { fuelLogs } from "../../data/Expenses";

const FuelLogsTable = ({ fuelLogs }) => {
  return (
    <div className="rounded-2xl bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Fuel Logs
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-6 py-3">Vehicle</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Liters</th>
              <th className="px-6 py-3">Fuel Cost</th>
            </tr>
          </thead>

          <tbody>
            {fuelLogs.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium">
                  {item.vehicle}
                </td>

                <td className="px-6 py-4">{item.date}</td>

                <td className="px-6 py-4">
                  {item.liters} L
                </td>

                <td className="px-6 py-4 font-semibold text-gray-700">
                  ₹{item.fuelCost.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FuelLogsTable;