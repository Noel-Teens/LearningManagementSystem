import { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { fetchAdminDashboard } from '../../../services/dashboardService';
import StatCard from '../components/StatCard';
import LineChart from '../components/Charts/LineChart';
import BarChart from '../components/Charts/BarChart';
import DataTable from '../components/Tables/DataTable';

// Icons
const UsersIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const BookIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const ChartIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const ActivityIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const AdminDashboard = () => {
    const { isDark } = useTheme();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAdminDashboard()
            .then(setData)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    const enrollmentColumns = [
        { key: 'learner', label: 'Learner' },
        { key: 'course', label: 'Course' },
        { key: 'date', label: 'Date' },
        {
            key: 'status',
            label: 'Status',
            render: (value) => (
                <span
                    className={`px-2.5 py-1 rounded-full text-xs font-medium ${value === 'Active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-amber-100 text-amber-700'
                        }`}
                >
                    {value}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Admin Dashboard
                </h1>
                <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Overview of your learning management platform
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={data.stats.totalUsers}
                    icon={UsersIcon}
                    color="indigo"
                    trend={12}
                    trendLabel="vs last month"
                />
                <StatCard
                    title="Total Courses"
                    value={data.stats.totalCourses}
                    icon={BookIcon}
                    color="emerald"
                    trend={8}
                    trendLabel="vs last month"
                />
                <StatCard
                    title="Completion Rate"
                    value={`${data.stats.completionRate}%`}
                    icon={ChartIcon}
                    color="amber"
                    trend={5}
                    trendLabel="vs last month"
                />
                <StatCard
                    title="Active Learners"
                    value={data.stats.activeLearners}
                    icon={ActivityIcon}
                    color="rose"
                    trend={-3}
                    trendLabel="vs last month"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LineChart
                    data={data.userGrowth}
                    xKey="month"
                    yKey="users"
                    title="User Growth"
                    color="#6366f1"
                />
                <BarChart
                    data={data.courseCompletions}
                    xKey="course"
                    bars={[
                        { dataKey: 'enrolled', name: 'Enrolled', color: '#6366f1' },
                        { dataKey: 'completed', name: 'Completed', color: '#10b981' },
                    ]}
                    title="Course Completions"
                />
            </div>

            {/* Recent Enrollments Table */}
            <DataTable columns={enrollmentColumns} data={data.recentEnrollments} title="Recent Enrollments" />
        </div>
    );
};

export default AdminDashboard;
