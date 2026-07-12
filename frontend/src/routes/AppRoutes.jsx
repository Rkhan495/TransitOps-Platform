import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Vehicles from "../pages/Vehicles";
import Expense from "../pages/Expense";
import Driver from "../pages/Driver";
import TripDispatcher from "../pages/TripDispatcher";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/expenses" element={<Expense />} />
        <Route path="/driver" element={<Driver />} />
        <Route path="/trips" element={<TripDispatcher />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
