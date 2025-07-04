import React, { useState } from "react";
import axios from "axios";

export default function Login({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        username,
        password,
      });

      setToken(res.data.token);
      setError("");
    } catch (err) {
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto mt-20 p-6 border rounded shadow bg-white"
      aria-label="Formulario de inicio de sesión"
    >
      <h2 className="text-2xl mb-6 font-bold text-center text-blue-800">Iniciar Sesión</h2>

      <label htmlFor="username" className="block mb-2 font-semibold text-blue-800">
        Usuario
      </label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input input-bordered w-full mb-4"
        required
        autoComplete="username"
        placeholder="Ingrese su usuario"
      />

      <label htmlFor="password" className="block mb-2 font-semibold text-blue-800">
        Contraseña
      </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input input-bordered w-full mb-4"
        required
        autoComplete="current-password"
        placeholder="Ingrese su contraseña"
      />

      {error && (
        <p
          className="text-red-600 text-center mb-4 font-semibold"
          role="alert"
          aria-live="assertive"
        >
          {error}
        </p>
      )}

      <button type="submit" className="btn btn-primary w-full" aria-label="Entrar">
        Entrar
      </button>
    </form>
  );
}
