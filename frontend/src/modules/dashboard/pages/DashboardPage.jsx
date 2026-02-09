import { useAuth } from '../../../modules/auth/context/AuthContext';
import AdminDashboard from './AdminDashboard';
import TrainerDashboard from './TrainerDashboard';
import LearnerDashboard from './LearnerDashboard';

/**
 * DashboardPage - Role-based dashboard router
 * Renders the appropriate dashboard based on user role
 */
const DashboardPage = () => {
    const { user } = useAuth();
    const role = user?.role?.toLowerCase();

    // For development/testing: Override role here
    // const role = 'admin'; // 'admin', 'trainer', or 'learner'

    switch (role) {
        case 'superadmin':
        case 'admin':
            return <AdminDashboard />;
        case 'trainer':
            return <TrainerDashboard />;
        case 'learner':
            return <LearnerDashboard />;
        default:
            return <LearnerDashboard />;
    }
};

export default DashboardPage;
