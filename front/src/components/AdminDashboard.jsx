import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../services/api.js";
import AdminRoleGuard from "./AdminRoleGuard.jsx";

function AdminDashboard() {
  const { adminToken, role } = useContext(AuthContext);
  const [metricas, setMetricas] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const obtenerMetricas = async () => {
      try {
        const respuesta = await api.get("/admin/metricas", {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });

        setMetricas(respuesta.data);
      } catch (error) {
        setError("No se pudieron obtener las métricas");
      }
    };

    if (adminToken && ["superadmin", "auditor"].includes(role)) {
    obtenerMetricas();
    }
    }, [adminToken, role]);

return (
  <div>
    <h2>Panel del administrador</h2>

    <AdminRoleGuard rolesPermitidos={["superadmin", "auditor"]}>
      {error && <p>{error}</p>}

      {metricas && (
        <div>
          <p>Clientes: {metricas.clientes}</p>
          <p>Productos: {metricas.productos}</p>
          <p>Ventas: {metricas.ventas}</p>
        </div>
      )}
    </AdminRoleGuard>
  </div>
);
}

export default AdminDashboard;

