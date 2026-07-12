import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Analytics from "../pages/Analytics";

function AppRoutes(){
  const isAuthenticated = !!localStorage.getItem("token");

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/analytics" element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/analytics" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes;