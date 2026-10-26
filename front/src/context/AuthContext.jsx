import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  // Sesión del cliente
  const [clientToken, setClientToken] = useState(
    localStorage.getItem("clientToken")
  );

  const [clientRefreshToken, setClientRefreshToken] = useState(
    localStorage.getItem("clientRefreshToken")
  );

  // Sesión del administrador
  const [adminToken, setAdminToken] = useState(
    localStorage.getItem("adminToken")
  );

  const [adminRefreshToken, setAdminRefreshToken] = useState(
    localStorage.getItem("adminRefreshToken")
  );

  const [role, setRole] = useState(
    localStorage.getItem("adminRole")
  );

  // Actualizar los tokens cuando Axios los renueva
  useEffect(() => {
    const actualizarTokens = () => {
      setClientToken(localStorage.getItem("clientToken"));
      setAdminToken(localStorage.getItem("adminToken"));
    };

    const finalizarSesionCliente = () => {
      setClientToken(null);
      setClientRefreshToken(null);
    };

    const finalizarSesionAdmin = () => {
      setAdminToken(null);
      setAdminRefreshToken(null);
      setRole(null);
    };

    window.addEventListener("tokenActualizado", actualizarTokens);
    window.addEventListener("sesionClienteFinalizada", finalizarSesionCliente);
    window.addEventListener("sesionAdminFinalizada", finalizarSesionAdmin);

    return () => {
      window.removeEventListener("tokenActualizado", actualizarTokens);
      window.removeEventListener("sesionClienteFinalizada", finalizarSesionCliente);
      window.removeEventListener("sesionAdminFinalizada", finalizarSesionAdmin);
    };
  }, []);

  // Cerrar solamente la sesión del cliente
  const cerrarSesionCliente = () => {
    setClientToken(null);
    setClientRefreshToken(null);

    localStorage.removeItem("clientToken");
    localStorage.removeItem("clientRefreshToken");
  };

  // Cerrar solamente la sesión del administrador
  const cerrarSesionAdmin = () => {
    setAdminToken(null);
    setAdminRefreshToken(null);
    setRole(null);

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    localStorage.removeItem("adminRole");
  };

  return (
    <AuthContext.Provider
      value={{
        clientToken,
        setClientToken,
        clientRefreshToken,
        setClientRefreshToken,

        adminToken,
        setAdminToken,
        adminRefreshToken,
        setAdminRefreshToken,

        role,
        setRole,

        cerrarSesionCliente,
        cerrarSesionAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
