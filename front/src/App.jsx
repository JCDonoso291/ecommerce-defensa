import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LoginForm from "./components/LoginForm.jsx";
import ClientDashboard from "./components/ClientDashboard.jsx";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext.jsx";
import ClientRoute from "./components/ClientRoute.jsx";
import AdminLoginForm from "./components/AdminLoginForm.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Header from "./components/Header.jsx";
import { ThemeContext } from "./context/ThemeContext.jsx";
import AdminProductos from "./components/AdminProductos.jsx";

function App() {
  const {
  clientToken,
  adminToken,
  cerrarSesionCliente,
  cerrarSesionAdmin
} = useContext(AuthContext);
  const { tema } = useContext(ThemeContext);

  return (
    <BrowserRouter>
      <div
        style={{
          backgroundColor: tema === "oscuro" ? "#222222" : "#ffffff",
          color: tema === "oscuro" ? "#ffffff" : "#000000",
          minHeight: "100vh"
        }}
      >
        <Header />

        <nav className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 p-4">
          <Link to="/">Inicio</Link>
          <Link to="/login">Ingresar como cliente</Link>

          {adminToken && (
          <Link to="/admin/productos">Administrar productos</Link>
          )}

          <Link to="/admin/login">Ingresar como administrador</Link>
        </nav>
          {clientToken && (
            <div>
              <p>Cliente autenticado</p>
              <button onClick={cerrarSesionCliente}>
                Cerrar sesión del cliente
              </button>
            </div>
          )}

          {adminToken && (
            <div>
              <p>Administrador autenticado</p>
              <button onClick={cerrarSesionAdmin}>
                Cerrar sesión del administrador
              </button>
            </div>
          )}
        <Routes>
          <Route
            path="/"
            element={<p>Bienvenido a nuestro comercio</p>}
          />

        <Route
          path="/login"
          element={<LoginForm />}
        />

        <Route
          path="/cliente/dashboard"
          element={
            <ClientRoute>
              <ClientDashboard />
            </ClientRoute>
          }
        />
        <Route
          path="/admin/login"
          element={<AdminLoginForm />}
        />
        <Route
          path="/admin/dashboard"

          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
        path="/admin/productos"
        element={
          <AdminRoute>
            <AdminProductos />
          </AdminRoute>
        }
      />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

