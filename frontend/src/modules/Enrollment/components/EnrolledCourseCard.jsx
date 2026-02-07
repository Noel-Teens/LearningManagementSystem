import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar';

/**
 * Card component for displaying an enrolled course
 * @param {Object} enrollment - Enrollment data with course and progress info
 */
export default function EnrolledCourseCard({ enrollment }) {
    const navigate = useNavigate();
    const { course, progress, enrolledAt, status } = enrollment;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleContinueLearning = () => {
        navigate(`/learner/courses/${course._id}/learn`);
    };

    const getStatusBadge = () => {
        switch (status) {
            case 'completed':
                return (
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        Completed
                    </span>
                );
            case 'dropped':
                return (
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                        Dropped
                    </span>
                );
            default:
                return (
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        In Progress
                    </span>
                );
        }
    };

    return (
        <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header Section */}
            <div className="p-5 pb-3">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {course.title}
                    </h3>
                    {getStatusBadge()}
                </div>

                {course.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                        {course.description}
                    </p>
                )}

                {/* Stats Row */}
                <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span>{course.moduleCount} Modules</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>{course.lessonCount} Lessons</span>
                    </div>
                </div>
            </div>

            {/* Progress Section */}
            <div className="px-5 py-3 bg-gray-50 dark:bg-gray-900/50">
                <ProgressBar
                    progress={progress.courseProgress}
                    size="sm"
                />
            </div>

            {/* Footer Section */}
            <div className="px-5 py-4 flex justify-between items-center border-t border-gray-100 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    Enrolled {formatDate(enrolledAt)}
                    {progress.lastAccessedAt && (
                        <span className="ml-2">
                            • Last accessed {formatDate(progress.lastAccessedAt)}
                        </span>
                    )}
                </div>
                <button
                    onClick={handleContinueLearning}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2"
                >
                    {progress.courseProgress > 0 ? 'Continue' : 'Start Learning'}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
