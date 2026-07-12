import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Vehicles from "../pages/Vehicles"
import Expense from "../pages/Expense"

function AppRoutes(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path='/vehicles' element={<Vehicles/>} />
        <Route path='/Expenses' element={<Expense />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes;