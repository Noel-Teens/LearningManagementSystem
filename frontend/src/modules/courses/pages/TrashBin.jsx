import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getTrashBin, restoreCourse, permanentDeleteCourse } from '../../../api/courseApi';

/**
 * TrashBin Page
 * Displays all soft-deleted courses with restore and permanent delete options.
 */
const TrashBin = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrash();
    }, []);

    const fetchTrash = async () => {
        try {
            setLoading(true);
            const response = await getTrashBin();
            setCourses(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch trash bin');
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (courseId) => {
        try {
            await restoreCourse(courseId);
            toast.success('Course restored successfully');
            fetchTrash();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to restore course');
        }
    };

    const handlePermanentDelete = async (courseId, courseTitle) => {
        if (!window.confirm(`Permanently delete "${courseTitle}"? This action cannot be undone.`)) {
            return;
        }
        try {
            await permanentDeleteCourse(courseId);
            toast.success('Course permanently deleted');
            fetchTrash();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete course');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trash Bin</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Deleted courses can be restored or permanently deleted
                    </p>
                </div>
                <Link
                    to="/courses"
                    className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                >
                    ← Back to Courses
                </Link>
            </div>

            {/* Trash List */}
            {courses.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400 text-lg mt-4">Trash bin is empty</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Course
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Deleted At
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {courses.map((course) => (
                                <tr key={course._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {course.title}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                                                {course.description || 'No description'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                        {formatDate(course.deletedAt)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleRestore(course._id)}
                                                className="px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                                            >
                                                Restore
                                            </button>
                                            <button
                                                onClick={() => handlePermanentDelete(course._id, course.title)}
                                                className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                                            >
                                                Delete Forever
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TrashBin;

