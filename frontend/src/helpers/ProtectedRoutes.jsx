import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Verifica si el token existe

  if (!token) {
    // Si no hay token, redirige al usuario a la página de inicio de sesión
    return <Navigate to="/" />;
  }

  // Si el token existe, permite el acceso a la ruta
  return children;
};

export default ProtectedRoute;