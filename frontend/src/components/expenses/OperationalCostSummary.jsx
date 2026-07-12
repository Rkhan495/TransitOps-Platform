import {
  fuelLogs,
  otherExpenses,
} from "../../data/Expenses";

const OperationalCostSummary = ({ fuelLogs, expenses }) => {
  const fuelTotal = fuelLogs.reduce(
    (sum, item) => sum + item.fuelCost,
    0
  );

  const maintenanceTotal = otherExpenses.reduce(
    (sum, item) => sum + item.maintenance,
    0
  );

  const total = fuelTotal + maintenanceTotal;

  return (
    <div className="flex items-center justify-between rounded-2xl bg-white px-6 py-5 shadow-sm">
      <div className="text-sm font-semibold uppercase tracking-wide text-gray-600">
        Total Operational Cost (Auto) = Fuel + Maint.
      </div>

      <div className="text-2xl font-bold text-amber-600">
        ₹{total.toLocaleString()}
      </div>
    </div>
  );
};

export default OperationalCostSummary;