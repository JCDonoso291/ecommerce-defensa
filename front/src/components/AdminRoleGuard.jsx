
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

function AdminRoleGuard({ rolesPermitidos, children }) {
  const { role } = useContext(AuthContext);

  if (!rolesPermitidos.includes(role)) {
    return <p>No tiene permisos para acceder a esta sección</p>;
  }

  return children;
}

export default AdminRoleGuard;

