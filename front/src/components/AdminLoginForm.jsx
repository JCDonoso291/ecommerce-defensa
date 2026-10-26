import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import { AuthContext } from "../context/AuthContext.jsx";

function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const { setAdminToken, setAdminRefreshToken, setRole } = useContext(AuthContext);

  const navigate = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await api.post("/auth/admin/login", {
        email,
        password
      });

      setAdminToken(respuesta.data.token);
      setAdminRefreshToken(respuesta.data.refreshToken);
      setRole(respuesta.data.role);

      localStorage.setItem("adminToken", respuesta.data.token);
      localStorage.setItem("adminRefreshToken", respuesta.data.refreshToken);
      localStorage.setItem("adminRole", respuesta.data.role);

      navigate("/admin/dashboard");

    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje || "Error al iniciar sesión"
      );
    }
  };

  return (
    <div>
      <h2>Inicio de sesión del administrador</h2>

      <form onSubmit={iniciarSesion}>
        <div>
          <label>Correo electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Ingresar</button>
      </form>

      <p>{mensaje}</p>
    </div>
  );
}

export default AdminLoginForm;

