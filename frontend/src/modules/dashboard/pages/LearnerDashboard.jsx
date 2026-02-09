import { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { fetchLearnerDashboard } from '../../../services/dashboardService';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';

// Icons
const BookIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const CheckIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ClipboardIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
);

const AwardIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
);

const CalendarIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const LearnerDashboard = () => {
    const { isDark } = useTheme();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLearnerDashboard()
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

    const progressColors = ['indigo', 'emerald', 'amber', 'rose', 'blue'];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    My Dashboard
                </h1>
                <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Track your learning progress
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Enrolled Courses"
                    value={data.stats.enrolledCourses}
                    icon={BookIcon}
                    color="indigo"
                />
                <StatCard
                    title="Completed Courses"
                    value={data.stats.completedCourses}
                    icon={CheckIcon}
                    color="emerald"
                />
                <StatCard
                    title="Pending Assessments"
                    value={data.stats.pendingAssessments}
                    icon={ClipboardIcon}
                    color="amber"
                />
                <StatCard
                    title="Certificates Earned"
                    value={data.stats.certificatesEarned}
                    icon={AwardIcon}
                    color="rose"
                />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Course Progress */}
                <div
                    className={`rounded-2xl p-6 ${isDark
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-white border border-gray-100 shadow-sm'
                        }`}
                >
                    <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Course Progress
                    </h3>
                    <div className="space-y-5">
                        {data.courseProgress.map((course, index) => (
                            <ProgressBar
                                key={course.id}
                                label={course.course}
                                progress={course.progress}
                                color={progressColors[index % progressColors.length]}
                            />
                        ))}
                    </div>
                </div>

                {/* Upcoming Assessments */}
                <div
                    className={`rounded-2xl p-6 ${isDark
                        ? 'bg-gray-800 border border-gray-700'
                        : 'bg-white border border-gray-100 shadow-sm'
                        }`}
                >
                    <h3 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Upcoming Assessments
                    </h3>
                    <div className="space-y-4">
                        {data.upcomingAssessments.map((assessment) => (
                            <div
                                key={assessment.id}
                                className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'
                                    }`}
                            >
                                <div className={`p-2 rounded-lg ${isDark ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
                                    <CalendarIcon className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {assessment.title}
                                    </p>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {assessment.course}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span
                                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${assessment.type === 'Quiz'
                                            ? 'bg-blue-100 text-blue-700'
                                            : assessment.type === 'Project'
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-amber-100 text-amber-700'
                                            }`}
                                    >
                                        {assessment.type}
                                    </span>
                                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                        Due: {assessment.dueDate}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearnerDashboard;
