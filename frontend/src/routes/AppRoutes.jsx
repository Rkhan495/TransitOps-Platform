import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Vehicles from "../pages/Vehicles"
import Driver from "../pages/Driver";
import TripDispatcher from "../pages/TripDispatcher";
import Maintenance from "../pages/Maintenance";
import ProtectedRoute from "../components/auth/ProtectedRoute";

const ALL_ROLES = [
  "Fleet Manager",
  "Safety Officer",
  "Dispatcher",
  "Despatcher",
  "Finance Analyst",
];

const OPERATION_ROLES = [
  "Fleet Manager",
  "Safety Officer",
  "Dispatcher",
  "Despatcher",
  "Finance Analyst",
];

const DRIVER_ROLES = [
  "Fleet Manager",
  "Safety Officer",
  "Dispatcher",
  "Despatcher",
];

const TRIP_ROLES = [
  "Fleet Manager",
  "Dispatcher",
  "Despatcher",
];

const MAINTENANCE_ROLES = [
  "Fleet Manager",
  "Safety Officer",
  "Finance Analyst",
];

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute allowedRoles={ALL_ROLES}><Dashboard /></ProtectedRoute>} />
        <Route path="/vehicles" element={<ProtectedRoute allowedRoles={OPERATION_ROLES}><Vehicles /></ProtectedRoute>} />
        <Route path="/driver" element={<ProtectedRoute allowedRoles={DRIVER_ROLES}><Driver /></ProtectedRoute>} />
        <Route path="/trips" element={<ProtectedRoute allowedRoles={TRIP_ROLES}><TripDispatcher /></ProtectedRoute>} />
        <Route path="/maintenance" element={<ProtectedRoute allowedRoles={MAINTENANCE_ROLES}><Maintenance /></ProtectedRoute>} />
        <Route path="/drivers" element={<Navigate to="/driver" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes;