import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../modules/auth/context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        const isStaff = user.role === 'SuperAdmin' || user.role === 'Admin';
        return <Navigate to={isStaff ? "/admin/users" : "/under-development"} replace />;
    }

    return children;
};

export default ProtectedRoute;
