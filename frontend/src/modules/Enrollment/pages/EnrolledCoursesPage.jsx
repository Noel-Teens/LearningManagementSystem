import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getEnrolledCourses } from '../../../api/enrollmentApi';
import EnrolledCourseCard from '../components/EnrolledCourseCard';

export default function EnrolledCoursesPage() {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnrolledCourses();
    }, []);

    const fetchEnrolledCourses = async () => {
        setLoading(true);
        try {
            const response = await getEnrolledCourses();
            setEnrollments(response.data || []);
        } catch (error) {
            console.error('Failed to fetch enrolled courses:', error);
            toast.error('Failed to load your courses');
        } finally {
            setLoading(false);
        }
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
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    My Courses
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Continue learning from where you left off.
                </p>
            </div>

            {/* Stats Summary */}
            {enrollments.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            {enrollments.length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Total Courses
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {enrollments.filter(e => e.status === 'completed').length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Completed
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {enrollments.filter(e => e.status === 'active').length}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            In Progress
                        </div>
                    </div>
                </div>
            )}

            {/* Course Cards */}
            {enrollments.length === 0 ? (
                <div className="text-center py-16">
                    <svg className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        No Courses Yet
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        You haven't been enrolled in any courses yet. Contact your administrator.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {enrollments.map(enrollment => (
                        <EnrolledCourseCard
                            key={enrollment.enrollmentId}
                            enrollment={enrollment}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
