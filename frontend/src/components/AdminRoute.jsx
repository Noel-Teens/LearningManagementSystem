import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const role = localStorage.getItem("role");

  if (role !== "ADMIN") {
    return <Navigate to="/search" />;
  }

  return children;
}

export default AdminRoute;