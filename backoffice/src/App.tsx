import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserAdmin from "./pages/UserAdmin";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-admin" element={<UserAdmin />} />

        {/* Acá podrías agregar rutas protegidas más adelante */}
      </Routes>
    </BrowserRouter>
  );
}
