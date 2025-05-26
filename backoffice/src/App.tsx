import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserAdmin from "./pages/UserAdmin";
import LayoutWithSidebar from "./components/LayoutWithSidebar";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login onSubmit={(data) => console.log(data)} />} />

        {/* Layout con sidebar */}
        <Route path="/" element={<LayoutWithSidebar />}>
          <Route path="home" element={<Home />} />
          <Route
            path="register"
            element={<Register onSubmit={(data) => console.log(data)} />}
          />
          <Route path="user-admin" element={<UserAdmin />} />
          {/* Más rutas protegidas con sidebar acá */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
