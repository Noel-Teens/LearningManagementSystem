import { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { getAdminOverview, exportReportCSV } from '../../../api/reportApi';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import toast from 'react-hot-toast';

const AdminReportsPage = () => {
    const { isDark } = useTheme();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState('');

    useEffect(() => {
        fetchOverview();
    }, []);

    const fetchOverview = async () => {
        try {
            setLoading(true);
            const response = await getAdminOverview();
            setData(response.data);
        } catch (error) {
            toast.error('Failed to load reports');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (type) => {
        try {
            setExporting(type);
            await exportReportCSV(type);
            toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} report downloaded`);
        } catch (error) {
            toast.error('Export failed');
        } finally {
            setExporting('');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Loading reports...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { users, courses, enrollments, progress, topCourses, recentEnrollments, enrollmentTrend } = data;

    // Calculate enrollment breakdown for chart
    const totalEnr = enrollments.total || 1;
    const completedPct = Math.round((enrollments.completed / totalEnr) * 100);
    const activePct = Math.round((enrollments.active / totalEnr) * 100);
    const droppedPct = Math.round((enrollments.dropped / totalEnr) * 100);

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        Reports & Analytics
                    </h1>
                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                        Organization-wide learning insights and performance metrics
                    </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {['users', 'courses', 'enrollments'].map(type => (
                        <button
                            key={type}
                            onClick={() => handleExport(type)}
                            disabled={!!exporting}
                            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border
                                ${isDark
                                    ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white disabled:opacity-50'
                                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-50 shadow-sm'
                                }`}
                        >
                            <DownloadIcon className="w-4 h-4" />
                            {exporting === type ? 'Exporting...' : `Export ${type.charAt(0).toUpperCase() + type.slice(1)}`}
                        </button>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    icon={UsersIcon}
                    label="Total Users"
                    value={users.total}
                    subValue={`${users.active} active`}
                    color="indigo"
                />
                <StatCard
                    icon={BookIcon}
                    label="Total Courses"
                    value={courses.total}
                    subValue={`${courses.published} published`}
                    color="emerald"
                />
                <StatCard
                    icon={AcademicIcon}
                    label="Total Enrollments"
                    value={enrollments.total}
                    subValue={`${enrollments.completed} completed`}
                    color="amber"
                />
                <StatCard
                    icon={ChartIcon}
                    label="Avg. Progress"
                    value={`${progress.avgProgress}%`}
                    subValue="Across all learners"
                    color="sky"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Enrollment Status Distribution */}
                <div className={`rounded-2xl border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Enrollment Status</h3>
                    <div className="space-y-5">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>Completed</span>
                                <span className={`text-sm font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{enrollments.completed}</span>
                            </div>
                            <ProgressBar value={completedPct} color="emerald" showLabel={false} size="lg" />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>Active</span>
                                <span className={`text-sm font-bold ${isDark ? 'text-sky-400' : 'text-sky-600'}`}>{enrollments.active}</span>
                            </div>
                            <ProgressBar value={activePct} color="sky" showLabel={false} size="lg" />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>Dropped</span>
                                <span className={`text-sm font-bold ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>{enrollments.dropped}</span>
                            </div>
                            <ProgressBar value={droppedPct} color="rose" showLabel={false} size="lg" />
                        </div>
                    </div>
                    {/* Legend Summary */}
                    <div className={`mt-6 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-slate-100'}`}>
                        <div className="flex justify-between text-sm">
                            <span className={isDark ? 'text-gray-400' : 'text-slate-500'}>Total Enrollments</span>
                            <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{enrollments.total}</span>
                        </div>
                    </div>
                </div>

                {/* Top Courses by Enrollment */}
                <div className={`rounded-2xl border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Top Courses</h3>
                    {topCourses.length === 0 ? (
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>No enrollment data yet</p>
                    ) : (
                        <div className="space-y-4">
                            {topCourses.map((course, idx) => {
                                const maxCount = topCourses[0].enrollmentCount || 1;
                                const barWidth = Math.round((course.enrollmentCount / maxCount) * 100);
                                const colors = ['indigo', 'emerald', 'amber', 'sky', 'rose'];
                                return (
                                    <div key={course._id} className="group">
                                        <div className="flex justify-between mb-1.5">
                                            <span className={`text-sm font-medium truncate max-w-[70%] ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                                {course.courseTitle}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                                                    avg {course.avgProgress}%
                                                </span>
                                                <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                    {course.enrollmentCount}
                                                </span>
                                            </div>
                                        </div>
                                        <ProgressBar value={barWidth} color={colors[idx % colors.length]} showLabel={false} size="md" />
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Users by Role */}
            <div className={`rounded-2xl border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Users by Role</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {users.byRole.map(role => {
                        const roleColors = {
                            SuperAdmin: { bg: isDark ? 'bg-rose-900/30' : 'bg-rose-50', text: isDark ? 'text-rose-400' : 'text-rose-600' },
                            Admin: { bg: isDark ? 'bg-amber-900/30' : 'bg-amber-50', text: isDark ? 'text-amber-400' : 'text-amber-600' },
                            Trainer: { bg: isDark ? 'bg-sky-900/30' : 'bg-sky-50', text: isDark ? 'text-sky-400' : 'text-sky-600' },
                            Learner: { bg: isDark ? 'bg-indigo-900/30' : 'bg-indigo-50', text: isDark ? 'text-indigo-400' : 'text-indigo-600' },
                        };
                        const c = roleColors[role._id] || roleColors.Learner;
                        return (
                            <div key={role._id} className={`rounded-xl p-4 text-center ${c.bg}`}>
                                <p className={`text-2xl font-bold ${c.text}`}>{role.count}</p>
                                <p className={`text-xs font-medium mt-1 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>{role._id}s</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Monthly Enrollment Trend */}
            {enrollmentTrend && enrollmentTrend.length > 0 && (
                <div className={`rounded-2xl border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Monthly Enrollment Trend</h3>
                    <div className="flex items-end gap-3 h-40">
                        {enrollmentTrend.map((month, idx) => {
                            const maxCount = Math.max(...enrollmentTrend.map(m => m.count), 1);
                            const height = Math.max((month.count / maxCount) * 100, 8);
                            const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                                    <span className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                        {month.count}
                                    </span>
                                    <div
                                        className={`w-full rounded-t-lg transition-all duration-500 ${isDark ? 'bg-indigo-500' : 'bg-indigo-600'}`}
                                        style={{ height: `${height}%`, minHeight: '4px' }}
                                    />
                                    <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                                        {monthNames[month._id.month]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Recent Enrollments Table */}
            <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
                <div className="p-6 pb-4">
                    <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Enrollments</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className={isDark ? 'bg-gray-700/50' : 'bg-slate-50'}>
                                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Learner</th>
                                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Course</th>
                                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Progress</th>
                                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Status</th>
                                <th className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Enrolled</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-slate-100'}`}>
                            {recentEnrollments.map(enrollment => (
                                <tr key={enrollment._id} className={`transition-colors ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-slate-50'}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isDark ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>
                                                {enrollment.learnerId?.name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                                                    {enrollment.learnerId?.name || 'Unknown'}
                                                </p>
                                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                                                    {enrollment.learnerId?.email || ''}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                        {enrollment.courseId?.title || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-4 w-36">
                                        <ProgressBar
                                            value={enrollment.progress?.courseProgress || 0}
                                            size="sm"
                                            color={enrollment.status === 'completed' ? 'emerald' : 'indigo'}
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={enrollment.status} isDark={isDark} />
                                    </td>
                                    <td className={`px-6 py-4 text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                        {enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString() : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {recentEnrollments.length === 0 && (
                        <div className={`text-center py-12 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                            No enrollments found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- Helper Components ---
const StatusBadge = ({ status, isDark }) => {
    const styles = {
        completed: isDark ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-700',
        active: isDark ? 'bg-sky-900/50 text-sky-400' : 'bg-sky-100 text-sky-700',
        dropped: isDark ? 'bg-rose-900/50 text-rose-400' : 'bg-rose-100 text-rose-700',
    };
    return (
        <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold capitalize ${styles[status] || styles.active}`}>
            {status}
        </span>
    );
};

// --- Icon Components ---
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

const AcademicIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
);

const ChartIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const DownloadIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

export default AdminReportsPage;
