import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState({
    username: "",
    email: "",
    password: "",
    rol: ""
  });
  const [editandoId, setEditandoId] = useState(null);

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/usuarios", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setUsuarios(res.data);
      setError("");
    } catch (err) {
      setError("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleChange = (e) => {
    setNuevoUsuario({ ...nuevoUsuario, [e.target.name]: e.target.value });
  };

  const handleAgregar = async () => {
    try {
      if (editandoId) {
        await axios.put(`http://localhost:4000/api/usuarios/${editandoId}`, nuevoUsuario, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        setEditandoId(null);
      } else {
        await axios.post("http://localhost:4000/api/auth/register", nuevoUsuario, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
      }
      setNuevoUsuario({
        username: "",
        email: "",
        password: "",
        rol: ""
      });
      cargarUsuarios();
      setError("");
    } catch (err) {
      setError("Error al guardar usuario");
    }
  };

  const handleEditar = (usuario) => {
    setNuevoUsuario({
      username: usuario.username,
      email: usuario.email,
      password: "",
      rol: usuario.rol
    });
    setEditandoId(usuario._id);
  };

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      cargarUsuarios();
    } catch (err) {
      setError("Error al eliminar usuario");
    }
  };

  if (loading) return <p>Cargando usuarios...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{editandoId ? "Editar Usuario" : "Nuevo Usuario"}</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <input
        name="username"
        placeholder="Usuario"
        value={nuevoUsuario.username}
        onChange={handleChange}
        className="input input-bordered w-full mb-2"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={nuevoUsuario.email}
        onChange={handleChange}
        className="input input-bordered w-full mb-2"
      />
      <input
        name="password"
        type="password"
        placeholder={editandoId ? "Dejar en blanco para no cambiar" : "Contraseña"}
        value={nuevoUsuario.password}
        onChange={handleChange}
        className="input input-bordered w-full mb-2"
      />
      <input
        name="rol"
        placeholder="Rol"
        value={nuevoUsuario.rol}
        onChange={handleChange}
        className="input input-bordered w-full mb-2"
      />
      <button className="btn btn-primary mb-4" onClick={handleAgregar}>
        {editandoId ? "Guardar cambios" : "Agregar Usuario"}
      </button>

      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario._id} className="mb-2 flex justify-between items-center border p-2 rounded">
            <div>
              <strong>{usuario.username}</strong> - {usuario.email} - {usuario.rol}
            </div>
            <div>
              <button
                className="btn btn-warning btn-sm mr-2"
                onClick={() => handleEditar(usuario)}
              >
                Editar
              </button>
              <button
                className="btn btn-error btn-sm"
                onClick={() => handleEliminar(usuario._id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
