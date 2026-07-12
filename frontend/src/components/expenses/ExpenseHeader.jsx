import { Search, Fuel, Receipt } from "lucide-react";

const ExpenseHeader =  ({ onLogFuel, onAddExpense }) => {
  
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="relative w-full lg:max-w-sm">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Search vehicle or trip..."
          className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
        />
      </div>

      <div className="flex gap-3">
        <button className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-amber-700"
        onClick={onLogFuel}>
          <Fuel size={18} />
          
          Log Fuel
        </button>

        <button className="flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-medium text-white shadow hover:bg-amber-700"
        onClick={onAddExpense}>
          <Receipt size={18} />
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default ExpenseHeader;