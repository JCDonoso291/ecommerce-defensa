
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

function ClientRoute({ children }) {
  const { clientToken } = useContext(AuthContext);

  if (!clientToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ClientRoute;

