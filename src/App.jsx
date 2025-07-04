import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";

function AppRoutes() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/admin");
    }
  }, [token, navigate]);

  const handleSetToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  return (
    <Routes>
      {/* Login */}
      <Route path="/admin/login" element={<Login setToken={handleSetToken} />} />

      {/* Panel admin protegido */}
      <Route
        path="/admin"
        element={token ? <AdminPanel onLogout={handleLogout} /> : <Navigate to="/admin/login" />}
      />

      {/* Redireccionar cualquier otra ruta a login */}
      <Route path="*" element={<Navigate to="/admin/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
