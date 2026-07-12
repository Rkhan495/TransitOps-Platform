import { Navigate } from "react-router-dom";

const AUTHORIZED_ROLES = [
    "Fleet Manager",
    "Safety Officer",
    "Dispatcher",
    "Despatcher",
    "Finance Analyst",
];

function ProtectedRoute({ children, allowedRoles = AUTHORIZED_ROLES }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;