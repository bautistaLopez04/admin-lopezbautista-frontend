import React, { useState, useEffect } from "react";
import axios from "axios";

const categoriasDisponibles = [
  "Entrantes",
  "Ensaladas",
  "Carnes Rojas",
  "Carnes Blancas",
  "Pescados",
  "Pastas",
  "Postres",
  "Bebidas Sin Alcohol",
  "Bebidas Con Alcohol"
];

export default function Platos() {
  const [platos, setPlatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nuevoPlato, setNuevoPlato] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    imagen: ""
  });
  const [editandoId, setEditandoId] = useState(null);

  const cargarPlatos = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/platos");
      setPlatos(res.data);
      setError("");
    } catch (err) {
      setError("Error al cargar platos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPlatos();
  }, []);

  const handleChange = (e) => {
    setNuevoPlato({ ...nuevoPlato, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await axios.put(
          `http://localhost:4000/api/platos/${editandoId}`,
          nuevoPlato,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        setEditandoId(null);
      } else {
        await axios.post("http://localhost:4000/api/platos", nuevoPlato, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      setNuevoPlato({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
        imagen: ""
      });
      cargarPlatos();
      setError("");
    } catch (err) {
      setError("Error al guardar plato");
    }
  };

  const handleEditar = (plato) => {
    setNuevoPlato({
      nombre: plato.nombre,
      descripcion: plato.descripcion,
      precio: plato.precio,
      categoria: plato.categoria,
      imagen: plato.imagen,
    });
    setEditandoId(plato._id);

    // Scroll hacia arriba del todo suavemente
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEliminar = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/platos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      cargarPlatos();
    } catch (err) {
      setError("Error al eliminar plato");
    }
  };

  if (loading) return <p>Cargando platos...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        {editandoId ? "Editar Plato" : "Nuevo Plato"}
      </h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="nombre"
          placeholder="Nombre"
          value={nuevoPlato.nombre}
          onChange={handleChange}
          className="input input-bordered w-full mb-2"
          required
        />
        <input
          name="descripcion"
          placeholder="Descripción"
          value={nuevoPlato.descripcion}
          onChange={handleChange}
          className="input input-bordered w-full mb-2"
          required
        />
        <input
          name="precio"
          type="number"
          placeholder="Precio"
          value={nuevoPlato.precio}
          onChange={handleChange}
          className="input input-bordered w-full mb-2"
          required
        />
        <select
          name="categoria"
          value={nuevoPlato.categoria}
          onChange={handleChange}
          className="input input-bordered w-full mb-2"
          required
        >
          <option value="" disabled>
            Seleccioná una categoría
          </option>
          {categoriasDisponibles.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          name="imagen"
          placeholder="URL imagen"
          value={nuevoPlato.imagen}
          onChange={handleChange}
          className="input input-bordered w-full mb-4"
        />
        <button type="submit" className="btn btn-primary mb-4 w-full">
          {editandoId ? "Guardar cambios" : "Agregar Plato"}
        </button>
      </form>

      <ul>
        {platos.map((plato) => (
          <li
            key={plato._id}
            className="mb-2 flex justify-between items-center border p-2 rounded"
          >
            <div>
              <strong>{plato.nombre}</strong> - ${plato.precio} - {plato.categoria}
            </div>
            <div>
              <button
                className="btn btn-warning btn-sm mr-2"
                onClick={() => handleEditar(plato)}
              >
                Editar
              </button>
              <button
                className="btn btn-error btn-sm"
                onClick={() => handleEliminar(plato._id)}
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
