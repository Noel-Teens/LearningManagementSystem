import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getCourse } from '../../../api/courseApi';

/**
 * LessonViewer Page
 * Displays lesson content based on type: PDF (iframe), Video (player), or Link.
 */
const LessonViewer = () => {
    const { courseId, moduleId, lessonId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [currentModule, setCurrentModule] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);

    useEffect(() => {
        fetchCourseAndLesson();
    }, [courseId, moduleId, lessonId]);

    const fetchCourseAndLesson = async () => {
        try {
            setLoading(true);
            const response = await getCourse(courseId);
            const courseData = response.data.data;
            setCourse(courseData);

            // Find the module
            const module = courseData.modules.find((m) => m._id === moduleId && !m.isDeleted);
            if (!module) {
                toast.error('Module not found');
                navigate('/courses');
                return;
            }
            setCurrentModule(module);

            // Find the lesson
            const lesson = module.lessons.find((l) => l._id === lessonId && !l.isDeleted);
            if (!lesson) {
                toast.error('Lesson not found');
                navigate('/courses');
                return;
            }
            setCurrentLesson(lesson);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to load lesson');
            navigate('/courses');
        } finally {
            setLoading(false);
        }
    };

    // Get all lessons across all modules for navigation
    const getAllLessons = () => {
        if (!course) return [];
        const lessons = [];
        course.modules
            .filter((m) => !m.isDeleted)
            .forEach((m) => {
                m.lessons
                    .filter((l) => !l.isDeleted)
                    .forEach((l) => {
                        lessons.push({ ...l, moduleId: m._id, moduleTitle: m.title });
                    });
            });
        return lessons;
    };

    const allLessons = getAllLessons();
    const currentIndex = allLessons.findIndex((l) => l._id === lessonId);
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!currentLesson) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Top Navigation */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div>
                        <Link
                            to={`/courses/${courseId}/edit`}
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                        >
                            ← Back to Course
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                            {currentLesson.title}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {currentModule?.title}
                        </p>
                    </div>
                    <span
                        className={`px-3 py-1 text-sm font-medium rounded-full ${currentLesson.contentType === 'PDF'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                : currentLesson.contentType === 'Video'
                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}
                    >
                        {currentLesson.contentType}
                    </span>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* PDF Viewer */}
                    {currentLesson.contentType === 'PDF' && (
                        <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-900">
                            <iframe
                                src={currentLesson.contentUrl}
                                className="w-full h-full"
                                title={currentLesson.title}
                            />
                        </div>
                    )}

                    {/* Video Player */}
                    {currentLesson.contentType === 'Video' && (
                        <div className="aspect-video bg-black">
                            <video
                                src={currentLesson.contentUrl}
                                controls
                                className="w-full h-full"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}

                    {/* External Link */}
                    {currentLesson.contentType === 'Link' && (
                        <div className="p-8 text-center">
                            <svg
                                className="mx-auto h-16 w-16 text-blue-500 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                External Resource
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                This lesson links to an external resource.
                            </p>
                            <a
                                href={currentLesson.contentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Open Link
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                            </a>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-6">
                    {prevLesson ? (
                        <Link
                            to={`/courses/${courseId}/modules/${prevLesson.moduleId}/lessons/${prevLesson._id}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            ← Previous: {prevLesson.title}
                        </Link>
                    ) : (
                        <div></div>
                    )}
                    {nextLesson && (
                        <Link
                            to={`/courses/${courseId}/modules/${nextLesson.moduleId}/lessons/${nextLesson._id}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Next: {nextLesson.title} →
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LessonViewer;
