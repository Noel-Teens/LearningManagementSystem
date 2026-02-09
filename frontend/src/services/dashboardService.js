/**
 * Dashboard Service - Mock Data
 * Replace these functions with real API calls when backend is ready
 */

// ==================== MOCK DATA ====================

const adminMockData = {
    stats: {
        totalUsers: 1247,
        totalCourses: 48,
        completionRate: 73,
        activeLearners: 892,
    },
    userGrowth: [
        { month: 'Jan', users: 650 },
        { month: 'Feb', users: 780 },
        { month: 'Mar', users: 890 },
        { month: 'Apr', users: 1020 },
        { month: 'May', users: 1150 },
        { month: 'Jun', users: 1247 },
    ],
    courseCompletions: [
        { course: 'React Basics', completed: 156, enrolled: 200 },
        { course: 'Node.js', completed: 98, enrolled: 150 },
        { course: 'Python ML', completed: 72, enrolled: 120 },
        { course: 'UI/UX Design', completed: 88, enrolled: 100 },
        { course: 'DevOps', completed: 45, enrolled: 80 },
    ],
    recentEnrollments: [
        { id: 1, learner: 'Alice Johnson', course: 'React Basics', date: '2026-01-28', status: 'Active' },
        { id: 2, learner: 'Bob Smith', course: 'Node.js Advanced', date: '2026-01-27', status: 'Active' },
        { id: 3, learner: 'Carol White', course: 'Python ML', date: '2026-01-27', status: 'Active' },
        { id: 4, learner: 'David Brown', course: 'UI/UX Design', date: '2026-01-26', status: 'Pending' },
        { id: 5, learner: 'Eve Davis', course: 'DevOps Fundamentals', date: '2026-01-25', status: 'Active' },
    ],
};

const trainerMockData = {
    stats: {
        myCourses: 6,
        enrolledStudents: 342,
        pendingAssessments: 28,
        avgScore: 78.5,
    },
    courseProgress: [
        { course: 'React Basics', progress: 85 },
        { course: 'Advanced React', progress: 62 },
        { course: 'State Management', progress: 45 },
        { course: 'Testing React', progress: 78 },
        { course: 'React Native', progress: 30 },
        { course: 'Performance', progress: 55 },
    ],
    recentSubmissions: [
        { id: 1, student: 'Alice Johnson', assignment: 'React Hooks Quiz', score: 92, date: '2026-01-29' },
        { id: 2, student: 'Bob Smith', assignment: 'Component Design', score: 85, date: '2026-01-28' },
        { id: 3, student: 'Carol White', assignment: 'State Management', score: null, date: '2026-01-28' },
        { id: 4, student: 'David Brown', assignment: 'API Integration', score: 78, date: '2026-01-27' },
        { id: 5, student: 'Eve Davis', assignment: 'Unit Testing', score: null, date: '2026-01-27' },
    ],
};

const learnerMockData = {
    stats: {
        enrolledCourses: 5,
        completedCourses: 2,
        pendingAssessments: 4,
        certificatesEarned: 2,
    },
    courseProgress: [
        { id: 1, course: 'React Basics', progress: 100, status: 'Completed' },
        { id: 2, course: 'Node.js Fundamentals', progress: 100, status: 'Completed' },
        { id: 3, course: 'Python for ML', progress: 65, status: 'In Progress' },
        { id: 4, course: 'UI/UX Design', progress: 40, status: 'In Progress' },
        { id: 5, course: 'DevOps Basics', progress: 15, status: 'In Progress' },
    ],
    upcomingAssessments: [
        { id: 1, title: 'Python ML Quiz 3', course: 'Python for ML', dueDate: '2026-02-01', type: 'Quiz' },
        { id: 2, title: 'Design Project', course: 'UI/UX Design', dueDate: '2026-02-03', type: 'Project' },
        { id: 3, title: 'Docker Assessment', course: 'DevOps Basics', dueDate: '2026-02-05', type: 'Quiz' },
        { id: 4, title: 'ML Model Assignment', course: 'Python for ML', dueDate: '2026-02-07', type: 'Assignment' },
    ],
};

// ==================== SERVICE FUNCTIONS ====================

/**
 * Fetch admin dashboard data
 * @returns {Promise<Object>} Admin dashboard data
 */
export const fetchAdminDashboard = () => {
    // Replace with: return api.get('/api/dashboard/admin');
    return new Promise((resolve) => {
        setTimeout(() => resolve(adminMockData), 300);
    });
};

/**
 * Fetch trainer dashboard data
 * @returns {Promise<Object>} Trainer dashboard data
 */
export const fetchTrainerDashboard = () => {
    // Replace with: return api.get('/api/dashboard/trainer');
    return new Promise((resolve) => {
        setTimeout(() => resolve(trainerMockData), 300);
    });
};

/**
 * Fetch learner dashboard data
 * @returns {Promise<Object>} Learner dashboard data
 */
export const fetchLearnerDashboard = () => {
    // Replace with: return api.get('/api/dashboard/learner');
    return new Promise((resolve) => {
        setTimeout(() => resolve(learnerMockData), 300);
    });
};

export default {
    fetchAdminDashboard,
    fetchTrainerDashboard,
    fetchLearnerDashboard,
};
