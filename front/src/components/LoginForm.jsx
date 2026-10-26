import { useState } from "react";
import api from "../services/api.js";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const { setClientToken, setClientRefreshToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const iniciarSesion = async (e) => {
    e.preventDefault();

    try {
      const respuesta = await api.post("/auth/client/login", {
        email,
        password
      });

        setClientToken(respuesta.data.token);
        setClientRefreshToken(respuesta.data.refreshToken);

        localStorage.setItem("clientToken", respuesta.data.token);
        localStorage.setItem("clientRefreshToken", respuesta.data.refreshToken);

        setMensaje(respuesta.data.mensaje);
        navigate("/cliente/dashboard");
      
    } catch (error) {
      setMensaje(
        error.response?.data?.mensaje || "Error al iniciar sesión"
      );
    }
  };

  return (
    <div>
      <h2>Inicio de sesión del cliente</h2>

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

export default LoginForm;

