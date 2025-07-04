import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Platos from "./Platos";
import Usuarios from "./Usuarios";

export default function AdminPanel({ onLogout }) {
  const navigate = useNavigate();
  const [seccion, setSeccion] = useState("platos");

  const handleLogoutClick = () => {
    onLogout();
    navigate("/admin/login");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <button className="btn btn-error" onClick={handleLogoutClick}>
          Cerrar sesión
        </button>
      </header>

      <nav className="mb-6 flex gap-4">
        <button
          className={`btn ${seccion === "platos" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setSeccion("platos")}
        >
          Gestionar Platos
        </button>
        <button
          className={`btn ${seccion === "usuarios" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setSeccion("usuarios")}
        >
          Gestionar Usuarios
        </button>
      </nav>

      <section>
        {seccion === "platos" && <Platos />}
        {seccion === "usuarios" && <Usuarios />}
      </section>
    </div>
  );
}
