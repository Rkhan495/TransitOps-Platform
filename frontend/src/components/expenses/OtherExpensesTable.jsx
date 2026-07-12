
const OtherExpensesTable = ({ expenses }) => {
  return (
    <div className="rounded-2xl bg-white shadow-sm">
      <div className="border-b px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Other Expenses (Toll / Misc)
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-6 py-3">Trip</th>
              <th className="px-6 py-3">Vehicle</th>
              <th className="px-6 py-3">Toll</th>
              <th className="px-6 py-3">Other</th>
              <th className="px-6 py-3">Maint. (Linked)</th>
              <th className="px-6 py-3">Total</th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((item) => {
              const total =
                item.toll +
                item.other +
                item.maintenance;

              return (
                <tr
                  key={item.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-6 py-4 font-medium">
                    {item.trip}
                  </td>

                  <td className="px-6 py-4">
                    {item.vehicle}
                  </td>

                  <td className="px-6 py-4">
                    ₹{item.toll}
                  </td>

                  <td className="px-6 py-4">
                    ₹{item.other}
                  </td>

                  <td className="px-6 py-4">
                    ₹{item.maintenance.toLocaleString()}
                  </td>

                  <td className="px-6 py-4 font-semibold text-amber-700">
                    ₹{total.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OtherExpensesTable;