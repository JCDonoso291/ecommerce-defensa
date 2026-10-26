import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api"
});

// Agregar el token correspondiente
api.interceptors.request.use((config) => {
  const esCliente = config.url?.startsWith("/client");
  const tipo = esCliente ? "client" : "admin";

  config.tipo = tipo;

  const token = localStorage.getItem(tipo + "Token");

  if (token && !config.url?.startsWith("/auth/")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Renovar el token si vence
api.interceptors.response.use(
  (respuesta) => respuesta,

  async (error) => {
    const peticion = error.config;

    if (
      error.response?.status !== 401 ||
      !peticion ||
      peticion._retry ||
      peticion.url?.startsWith("/auth/")
    ) {
      return Promise.reject(error);
    }

    peticion._retry = true;

    const tipo = peticion.tipo;
    const refreshToken = localStorage.getItem(tipo + "RefreshToken");

    try {
      if (!refreshToken) {
        throw new Error("No hay token de renovación");
      }

      const respuesta = await axios.post(
        "http://localhost:3000/api/auth/refresh",
        { refreshToken }
      );

      localStorage.setItem(tipo + "Token", respuesta.data.token);
      window.dispatchEvent(new Event("tokenActualizado"));

      peticion.headers.Authorization = `Bearer ${respuesta.data.token}`;

      return api(peticion);

    } catch (errorRenovacion) {
      localStorage.removeItem(tipo + "Token");
      localStorage.removeItem(tipo + "RefreshToken");

      if (tipo === "admin") {
        localStorage.removeItem("adminRole");
      }

      window.dispatchEvent(
        new Event(tipo === "admin"
          ? "sesionAdminFinalizada"
          : "sesionClienteFinalizada")
      );

      return Promise.reject(errorRenovacion);
    }
  }
);

export default api;
