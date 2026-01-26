import { Navigate } from "react-router-dom";
import { useAuth } from "../../modules/auth/context/AuthContext";

const DashboardRedirect = () => {
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  if (role === "admin" || role === "superadmin") {
    return <Navigate to="/admin/users" />;
  }

  if (role === "trainer" || role === "learner") {
    return <Navigate to="/search" />;
  }

  return <Navigate to="/login" />;
};

export default DashboardRedirect;
