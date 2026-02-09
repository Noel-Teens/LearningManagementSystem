import { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { fetchTrainerDashboard } from '../../../services/dashboardService';
import StatCard from '../components/StatCard';
import BarChart from '../components/Charts/BarChart';
import DataTable from '../components/Tables/DataTable';

// Icons
const BookIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const UsersIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const ClipboardIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);

const StarIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
);

const TrainerDashboard = () => {
    const { isDark } = useTheme();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrainerDashboard()
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

    const submissionColumns = [
        { key: 'student', label: 'Student' },
        { key: 'assignment', label: 'Assignment' },
        {
            key: 'score',
            label: 'Score',
            render: (value) =>
                value !== null ? (
                    <span className={`font-semibold ${value >= 80 ? 'text-emerald-600' : value >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {value}%
                    </span>
                ) : (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                        Pending
                    </span>
                ),
        },
        { key: 'date', label: 'Date' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Trainer Dashboard
                </h1>
                <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Monitor your courses and student progress
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="My Courses"
                    value={data.stats.myCourses}
                    icon={BookIcon}
                    color="indigo"
                />
                <StatCard
                    title="Enrolled Students"
                    value={data.stats.enrolledStudents}
                    icon={UsersIcon}
                    color="emerald"
                />
                <StatCard
                    title="Pending Assessments"
                    value={data.stats.pendingAssessments}
                    icon={ClipboardIcon}
                    color="amber"
                />
                <StatCard
                    title="Avg Score"
                    value={`${data.stats.avgScore}%`}
                    icon={StarIcon}
                    color="rose"
                />
            </div>

            {/* Course Progress Chart */}
            <BarChart
                data={data.courseProgress}
                xKey="course"
                bars={[{ dataKey: 'progress', name: 'Progress %', color: '#6366f1' }]}
                title="Course Progress"
            />

            {/* Recent Submissions Table */}
            <DataTable columns={submissionColumns} data={data.recentSubmissions} title="Recent Submissions" />
        </div>
    );
};

export default TrainerDashboard;
