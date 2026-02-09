import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCourses, deleteCourse, togglePublishStatus } from '../../../api/courseApi';

/**
 * CourseList Page
 * Displays all active courses for the trainer with options to create, edit, publish, and delete.
 */
const CourseList = () => {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await getCourses();
            setCourses(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (courseId) => {
        if (!window.confirm('Move this course to Trash Bin?')) return;
        try {
            await deleteCourse(courseId);
            toast.success('Course moved to Trash Bin');
            fetchCourses();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete course');
        }
    };

    const handleTogglePublish = async (courseId) => {
        try {
            const response = await togglePublishStatus(courseId);
            toast.success(`Course ${response.data.data.status === 'Published' ? 'published' : 'unpublished'}`);
            fetchCourses();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update status');
        }
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Courses</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manage your courses, modules, and lessons
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        to="/courses/trash"
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        Trash Bin
                    </Link>
                    <button
                        onClick={() => navigate('/courses/create')}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        + Create Course
                    </button>
                </div>
            </div>

            {/* Course Grid */}
            {courses.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No courses yet.</p>
                    <button
                        onClick={() => navigate('/courses/create')}
                        className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        Create your first course
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => (
                        <div
                            key={course._id}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <div className="p-5">
                                {/* Status Badge */}
                                <div className="flex justify-between items-start mb-3">
                                    <span
                                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${course.status === 'Published'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                            }`}
                                    >
                                        {course.status}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {course.modules?.filter((m) => !m.isDeleted).length || 0} modules
                                    </span>
                                </div>

                                {/* Title & Description */}
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                                    {course.title}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                                    {course.description || 'No description'}
                                </p>

                                {/* Actions */}
                                <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        onClick={() => navigate(`/courses/${course._id}/edit`)}
                                        className="flex-1 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleTogglePublish(course._id)}
                                        className="flex-1 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        {course.status === 'Published' ? 'Unpublish' : 'Publish'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course._id)}
                                        className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CourseList;
