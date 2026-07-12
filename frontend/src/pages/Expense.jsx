import { useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";

import ExpenseHeader from "../components/expenses/ExpenseHeader";
import FuelLogsTable from "../components/expenses/FuelLogsTable";
import OtherExpensesTable from "../components/expenses/OtherExpensesTable";
import OperationalCostSummary from "../components/expenses/OperationalCostSummary";
// import LogFuelModal from "../components/expenses/LogFuelModal";
// import AddExpenseModal from "../components/expenses/AddExpenseModal";

import {
  fuelLogs as initialFuelLogs,
  otherExpenses as initialOtherExpenses,
} from "../data/Expenses";

const Expense = () => {
  // Expense data
  const [fuelLogs, setFuelLogs] = useState(initialFuelLogs);
  const [expenses, setExpenses] = useState(initialOtherExpenses);

  // Modal state
  const [showFuelModal, setShowFuelModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  // Add Fuel
  const handleAddFuel = (newFuel) => {
    setFuelLogs((prev) => [...prev, newFuel]);
    setShowFuelModal(false);
  };

  // Add Expense
  const handleAddExpense = (newExpense) => {
    setExpenses((prev) => [...prev, newExpense]);
    setShowExpenseModal(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        <ExpenseHeader
          onLogFuel={() => setShowFuelModal(true)}
          onAddExpense={() => setShowExpenseModal(true)}
        />

        <FuelLogsTable fuelLogs={fuelLogs} />

        <OtherExpensesTable expenses={expenses} />

        <OperationalCostSummary
          fuelLogs={fuelLogs}
          expenses={expenses}
        />

        {/* Log Fuel Modal */}
        {/* <LogFuelModal
          open={showFuelModal}
          onClose={() => setShowFuelModal(false)}
          onSave={handleAddFuel}
        /> */}

        {/* Add Expense Modal */}
        {/* <AddExpenseModal
          open={showExpenseModal}
          onClose={() => setShowExpenseModal(false)}
          onSave={handleAddExpense}
        /> */}

      </div>
    </DashboardLayout>
  );
};

export default Expense;