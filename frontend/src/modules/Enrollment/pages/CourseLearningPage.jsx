import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
    getCourseLearningStructure,
    markLessonComplete,
    updateLastAccessed
} from '../../../api/enrollmentApi';
import ModuleLessonNavigator from '../components/ModuleLessonNavigator';
import LessonPlayer from '../components/LessonPlayer';
import ProgressBar from '../components/ProgressBar';

export default function CourseLearningPage() {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [courseData, setCourseData] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [currentModule, setCurrentModule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);

    const fetchCourseData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getCourseLearningStructure(courseId);
            setCourseData(response.data);

            // Auto-select first incomplete or last accessed lesson
            const modules = response.data.modules;
            if (modules.length > 0) {
                const lastAccessedLessonId = response.data.progress?.lastAccessedLessonId;
                let foundLesson = null;
                let foundModule = null;

                // Try to find last accessed lesson
                if (lastAccessedLessonId) {
                    for (const module of modules) {
                        const lesson = module.lessons.find(l => l._id === lastAccessedLessonId);
                        if (lesson) {
                            foundLesson = lesson;
                            foundModule = module;
                            break;
                        }
                    }
                }

                // Fallback to first incomplete lesson
                if (!foundLesson) {
                    for (const module of modules) {
                        const incompleteLesson = module.lessons.find(l => !l.isCompleted);
                        if (incompleteLesson) {
                            foundLesson = incompleteLesson;
                            foundModule = module;
                            break;
                        }
                    }
                }

                // Fallback to first lesson
                if (!foundLesson && modules[0].lessons.length > 0) {
                    foundLesson = modules[0].lessons[0];
                    foundModule = modules[0];
                }

                setCurrentLesson(foundLesson);
                setCurrentModule(foundModule);
            }
        } catch (error) {
            console.error('Failed to fetch course:', error);
            if (error.response?.status === 403) {
                toast.error('You are not enrolled in this course');
                navigate('/learner/courses');
            } else {
                toast.error('Failed to load course');
            }
        } finally {
            setLoading(false);
        }
    }, [courseId, navigate]);

    useEffect(() => {
        fetchCourseData();
    }, [fetchCourseData]);

    const handleSelectLesson = async (lesson, module) => {
        setCurrentLesson(lesson);
        setCurrentModule(module);

        // Track last accessed
        try {
            await updateLastAccessed(courseId, lesson._id);
        } catch (error) {
            console.error('Failed to update last accessed:', error);
        }
    };

    const handleMarkComplete = async () => {
        if (!currentLesson || completing) return;

        setCompleting(true);
        try {
            const response = await markLessonComplete(courseId, currentLesson._id);

            // Update local state
            setCourseData(prev => {
                const newModules = prev.modules.map(module => ({
                    ...module,
                    lessons: module.lessons.map(lesson =>
                        lesson._id === currentLesson._id
                            ? { ...lesson, isCompleted: true }
                            : lesson
                    ),
                    completedLessons: module.lessons.filter(l =>
                        l._id === currentLesson._id || l.isCompleted
                    ).length
                }));

                // Recalculate module progress
                newModules.forEach(module => {
                    module.progress = module.totalLessons > 0
                        ? Math.round((module.completedLessons / module.totalLessons) * 100)
                        : 0;
                    module.isCompleted = module.completedLessons === module.totalLessons;
                });

                return {
                    ...prev,
                    modules: newModules,
                    progress: response.data.progress
                };
            });

            setCurrentLesson(prev => ({ ...prev, isCompleted: true }));

            toast.success('Lesson completed!');
        } catch (error) {
            toast.error('Failed to mark lesson complete');
        } finally {
            setCompleting(false);
        }
    };

    const navigateLesson = (direction) => {
        if (!courseData || !currentLesson) return;

        // Flatten all lessons with their module info
        const allLessons = [];
        courseData.modules.forEach(module => {
            module.lessons.forEach(lesson => {
                allLessons.push({ lesson, module });
            });
        });

        const currentIndex = allLessons.findIndex(
            item => item.lesson._id === currentLesson._id
        );

        const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;

        if (newIndex >= 0 && newIndex < allLessons.length) {
            const { lesson, module } = allLessons[newIndex];
            handleSelectLesson(lesson, module);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!courseData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400">Course not found</p>
                    <button
                        onClick={() => navigate('/learner/courses')}
                        className="mt-4 text-indigo-600 hover:underline"
                    >
                        Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-64px)]">
            {/* Sidebar Navigator */}
            <ModuleLessonNavigator
                modules={courseData.modules}
                currentLessonId={currentLesson?._id}
                onSelectLesson={handleSelectLesson}
            />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                {/* Course Header */}
                <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <button
                                onClick={() => navigate('/learner/courses')}
                                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-1 flex items-center gap-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Courses
                            </button>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                {courseData.course.title}
                            </h1>
                        </div>
                        <div className="w-48">
                            <ProgressBar
                                progress={courseData.progress?.courseProgress || 0}
                                size="md"
                            />
                        </div>
                    </div>
                </div>

                {/* Lesson Player */}
                <LessonPlayer
                    lesson={currentLesson}
                    isCompleted={currentLesson?.isCompleted}
                    onComplete={handleMarkComplete}
                    loading={completing}
                />

                {/* Navigation Buttons */}
                {currentLesson && (
                    <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between">
                        <button
                            onClick={() => navigateLesson('prev')}
                            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Previous
                        </button>
                        <button
                            onClick={() => navigateLesson('next')}
                            className="flex items-center gap-2 px-4 py-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                        >
                            Next
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
