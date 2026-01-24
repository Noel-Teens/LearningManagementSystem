import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../modules/auth/context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // 1. LOADING STATE
    // Prevents redirecting to login while the session is still being checked
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
        );
    }
    if (!loading && !user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
}
    // 2. AUTHENTICATION CHECK
    // If no user is found, send them to login and save the page they were trying to visit
    if (!user) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

    // 3. AUTHORIZATION CHECK (Role-Based Access)
    // We normalize all strings to lowercase to prevent "Admin" vs "admin" mismatches
    if (allowedRoles.length > 0) {
        const currentUserRole = user.role?.toLowerCase().trim();
        const isAllowed = allowedRoles.some(
            (role) => role.toLowerCase().trim() === currentUserRole
        );

        if (!isAllowed) {
            // If the user is blocked, redirect based on their role type
            const isStaff = currentUserRole === 'superadmin' || currentUserRole === 'admin';
            
            // Admins go to User Management, everyone else goes to the Knowledge Base (Search)
            return <Navigate to={isStaff ? "/admin/users" : "/search"} replace />;
        }
    }

    // 4. ACCESS GRANTED
    return children;
};

export default ProtectedRoute;