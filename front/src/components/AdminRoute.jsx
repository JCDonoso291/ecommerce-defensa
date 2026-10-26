
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

function AdminRoute({ children }) {
  const { adminToken } = useContext(AuthContext);

  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default AdminRoute;

