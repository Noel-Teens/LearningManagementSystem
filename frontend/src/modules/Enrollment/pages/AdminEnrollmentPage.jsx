import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
    enrollLearner,
    removeEnrollment,
    getAllEnrollments
} from '../../../api/enrollmentApi';
import api from '../../../api/axios';

export default function AdminEnrollmentPage() {
    const [enrollments, setEnrollments] = useState([]);
    const [learners, setLearners] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);

    const [form, setForm] = useState({
        learnerId: '',
        courseId: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [enrollmentsRes, usersRes, coursesRes] = await Promise.all([
                getAllEnrollments(),
                api.get('/auth/users'),
                api.get('/courses')
            ]);

            setEnrollments(enrollmentsRes.data || []);

            // Filter only learners
            const allUsers = usersRes.data?.data || usersRes.data || [];
            setLearners(allUsers.filter(u => u.role === 'Learner'));

            // Filter only published courses
            const allCourses = coursesRes.data?.data || coursesRes.data || [];
            setCourses(allCourses.filter(c => c.status === 'Published' && !c.isDeleted));
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const handleEnroll = async (e) => {
        e.preventDefault();
        if (!form.learnerId || !form.courseId) {
            toast.error('Please select both learner and course');
            return;
        }

        setEnrolling(true);
        try {
            await enrollLearner(form.learnerId, form.courseId);
            toast.success('Learner enrolled successfully');
            setForm({ learnerId: '', courseId: '' });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Enrollment failed');
        } finally {
            setEnrolling(false);
        }
    };

    const handleRemove = async (enrollmentId) => {
        if (!window.confirm('Are you sure you want to remove this enrollment?')) {
            return;
        }

        try {
            await removeEnrollment(enrollmentId);
            toast.success('Enrollment removed');
            setEnrollments(prev => prev.filter(e => e._id !== enrollmentId));
        } catch (error) {
            toast.error('Failed to remove enrollment');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Enrollment Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Enroll learners into courses and manage existing enrollments.
                </p>
            </div>

            {/* Enrollment Form */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Enroll New Learner
                </h2>
                <form onSubmit={handleEnroll} className="flex flex-wrap gap-4 items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Select Learner
                        </label>
                        <select
                            value={form.learnerId}
                            onChange={(e) => setForm({ ...form, learnerId: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="">-- Select Learner --</option>
                            {learners.map(learner => (
                                <option key={learner._id} value={learner._id}>
                                    {learner.name} ({learner.email})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Select Course
                        </label>
                        <select
                            value={form.courseId}
                            onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="">-- Select Course --</option>
                            {courses.map(course => (
                                <option key={course._id} value={course._id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        disabled={enrolling}
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                        {enrolling ? (
                            <>
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Enrolling...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Enroll Learner
                            </>
                        )}
                    </button>
                </form>
            </div>

            {/* Enrollments Table */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Current Enrollments ({enrollments.length})
                    </h2>
                </div>

                {enrollments.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        No enrollments yet. Enroll your first learner above.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Learner
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Course
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Progress
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Enrolled
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {enrollments.map(enrollment => (
                                    <tr key={enrollment._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {enrollment.learnerId?.name || 'Unknown'}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {enrollment.learnerId?.email || 'No email'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900 dark:text-white">
                                                {enrollment.courseId?.title || 'Unknown Course'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                                    <div
                                                        className="bg-indigo-500 h-2 rounded-full transition-all"
                                                        style={{ width: `${enrollment.progress?.courseProgress || 0}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {enrollment.progress?.courseProgress || 0}%
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${enrollment.status === 'completed'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                                                    : enrollment.status === 'dropped'
                                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                                                }`}>
                                                {enrollment.status?.charAt(0).toUpperCase() + enrollment.status?.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(enrollment.enrolledAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleRemove(enrollment._id)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
