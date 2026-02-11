import { useState, useEffect } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { getTrainerCoursesAnalytics, getCourseAnalytics } from '../../../api/reportApi';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import toast from 'react-hot-toast';

const TrainerAnalyticsPage = () => {
    const { isDark } = useTheme();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [courseDetail, setCourseDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await getTrainerCoursesAnalytics();
            setData(response.data);
        } catch (error) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    const handleCourseClick = async (courseId) => {
        if (selectedCourse === courseId) {
            setSelectedCourse(null);
            setCourseDetail(null);
            return;
        }
        try {
            setDetailLoading(true);
            setSelectedCourse(courseId);
            const response = await getCourseAnalytics(courseId);
            setCourseDetail(response.data);
        } catch (error) {
            toast.error('Failed to load course details');
            setSelectedCourse(null);
        } finally {
            setDetailLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-32">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { summary, courses } = data;

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Course Analytics
                </h1>
                <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                    Track learner engagement and course performance
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <StatCard
                    icon={BookIcon}
                    label="My Courses"
                    value={summary.totalCourses}
                    color="indigo"
                />
                <StatCard
                    icon={UsersIcon}
                    label="Total Enrollments"
                    value={summary.totalEnrollments}
                    color="sky"
                />
                <StatCard
                    icon={CheckIcon}
                    label="Completions"
                    value={summary.totalCompletions}
                    color="emerald"
                />
                <StatCard
                    icon={ChartIcon}
                    label="Avg. Progress"
                    value={`${summary.overallAvgProgress}%`}
                    color="amber"
                />
            </div>

            {/* Course Cards */}
            <div>
                <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Course Performance
                </h2>
                {courses.length === 0 ? (
                    <div className={`rounded-2xl border p-12 text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
                        <BookIcon className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-slate-300'}`} />
                        <p className={`text-lg font-medium ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>No courses yet</p>
                        <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>Create your first course to see analytics</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {courses.map(course => (
                            <div key={course._id}>
                                {/* Course Summary Card */}
                                <button
                                    onClick={() => handleCourseClick(course._id)}
                                    className={`w-full text-left rounded-2xl border p-6 transition-all duration-200 hover:shadow-md ${selectedCourse === course._id
                                            ? isDark ? 'bg-gray-800 border-indigo-500 ring-1 ring-indigo-500/50' : 'bg-white border-indigo-300 ring-1 ring-indigo-200'
                                            : isDark ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className={`text-lg font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                                    {course.title}
                                                </h3>
                                                <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold ${course.status === 'Published'
                                                        ? isDark ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                                                        : isDark ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {course.status}
                                                </span>
                                            </div>
                                            <div className={`flex flex-wrap gap-4 text-sm ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                                <span>{course.modulesCount} modules</span>
                                                <span>{course.lessonsCount} lessons</span>
                                                <span>{course.totalEnrolled} enrolled</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 shrink-0">
                                            <div className="text-center">
                                                <p className={`text-2xl font-bold ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>{course.avgProgress}%</p>
                                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>Avg Progress</p>
                                            </div>
                                            <div className="text-center">
                                                <p className={`text-2xl font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{course.completionRate}%</p>
                                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>Completion</p>
                                            </div>
                                            <ChevronIcon
                                                className={`w-5 h-5 transition-transform duration-200 ${selectedCourse === course._id ? 'rotate-180' : ''} ${isDark ? 'text-gray-500' : 'text-slate-400'}`}
                                            />
                                        </div>
                                    </div>
                                    {/* Mini progress bar */}
                                    <div className="mt-4">
                                        <ProgressBar value={course.avgProgress} size="sm" color="indigo" showLabel={false} />
                                    </div>
                                </button>

                                {/* Course Detail Panel */}
                                {selectedCourse === course._id && (
                                    <div className={`mt-2 rounded-2xl border p-6 transition-all duration-300 ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-slate-50 border-slate-200'}`}>
                                        {detailLoading ? (
                                            <div className="flex justify-center py-8">
                                                <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                                            </div>
                                        ) : courseDetail ? (
                                            <div className="space-y-6">
                                                {/* Enrollment Summary */}
                                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                    {[
                                                        { label: 'Enrolled', value: courseDetail.summary.totalEnrolled, color: isDark ? 'text-indigo-400' : 'text-indigo-600' },
                                                        { label: 'Completed', value: courseDetail.summary.completed, color: isDark ? 'text-emerald-400' : 'text-emerald-600' },
                                                        { label: 'Active', value: courseDetail.summary.active, color: isDark ? 'text-sky-400' : 'text-sky-600' },
                                                        { label: 'Dropped', value: courseDetail.summary.dropped, color: isDark ? 'text-rose-400' : 'text-rose-600' },
                                                    ].map(stat => (
                                                        <div key={stat.label} className={`rounded-xl p-3 text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                                                            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                                                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{stat.label}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Module Analytics */}
                                                {courseDetail.moduleAnalytics && courseDetail.moduleAnalytics.length > 0 && (
                                                    <div>
                                                        <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                                            Module Completion
                                                        </h4>
                                                        <div className="space-y-3">
                                                            {courseDetail.moduleAnalytics.map(module => (
                                                                <div key={module._id} className={`rounded-xl p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                                                                    <div className="flex justify-between mb-2">
                                                                        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                                                                            {module.title}
                                                                        </span>
                                                                        <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                                                                            {module.completedBy}/{courseDetail.summary.totalEnrolled} learners · {module.lessonsCount} lessons
                                                                        </span>
                                                                    </div>
                                                                    <ProgressBar value={module.completionRate} size="sm" color="emerald" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Learner Progress Table */}
                                                {courseDetail.learnerProgress && courseDetail.learnerProgress.length > 0 && (
                                                    <div>
                                                        <h4 className={`text-sm font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>
                                                            Learner Progress
                                                        </h4>
                                                        <div className={`rounded-xl overflow-hidden border ${isDark ? 'border-gray-700' : 'border-slate-200'}`}>
                                                            <table className="w-full">
                                                                <thead>
                                                                    <tr className={isDark ? 'bg-gray-700/50' : 'bg-slate-100'}>
                                                                        <th className={`px-4 py-2.5 text-left text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Learner</th>
                                                                        <th className={`px-4 py-2.5 text-left text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Progress</th>
                                                                        <th className={`px-4 py-2.5 text-left text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Lessons</th>
                                                                        <th className={`px-4 py-2.5 text-left text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Status</th>
                                                                        <th className={`px-4 py-2.5 text-left text-xs font-semibold uppercase ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>Last Active</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-slate-100'}`}>
                                                                    {courseDetail.learnerProgress.map(lp => (
                                                                        <tr key={lp.enrollmentId} className={`transition-colors ${isDark ? 'hover:bg-gray-700/30' : 'hover:bg-slate-50'}`}>
                                                                            <td className="px-4 py-3">
                                                                                <div className="flex items-center gap-2">
                                                                                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${isDark ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-700'}`}>
                                                                                        {lp.learner?.name?.charAt(0) || '?'}
                                                                                    </div>
                                                                                    <div>
                                                                                        <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>{lp.learner?.name || 'Unknown'}</p>
                                                                                        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{lp.learner?.email || ''}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            <td className="px-4 py-3 w-36">
                                                                                <ProgressBar
                                                                                    value={lp.progress}
                                                                                    size="sm"
                                                                                    color={lp.status === 'completed' ? 'emerald' : 'indigo'}
                                                                                />
                                                                            </td>
                                                                            <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                                                                                {lp.completedLessons} done
                                                                            </td>
                                                                            <td className="px-4 py-3">
                                                                                <span className={`inline-flex px-2 py-0.5 rounded-md text-xs font-semibold capitalize ${lp.status === 'completed' ? (isDark ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-700')
                                                                                        : lp.status === 'dropped' ? (isDark ? 'bg-rose-900/50 text-rose-400' : 'bg-rose-100 text-rose-700')
                                                                                            : (isDark ? 'bg-sky-900/50 text-sky-400' : 'bg-sky-100 text-sky-700')
                                                                                    }`}>
                                                                                    {lp.status}
                                                                                </span>
                                                                            </td>
                                                                            <td className={`px-4 py-3 text-xs ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>
                                                                                {lp.lastAccessedAt ? new Date(lp.lastAccessedAt).toLocaleDateString() : '—'}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
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

const CheckIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ChartIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

const ChevronIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

export default TrainerAnalyticsPage;
