import { useState } from 'react';
import ProgressBar from './ProgressBar';

/**
 * Sidebar navigation for course modules and lessons
 * @param {Array} modules - Array of module objects with lessons
 * @param {string} currentLessonId - Currently selected lesson ID
 * @param {function} onSelectLesson - Callback when lesson is selected
 */
export default function ModuleLessonNavigator({
    modules = [],
    currentLessonId,
    onSelectLesson
}) {
    const [expandedModules, setExpandedModules] = useState(() => {
        // Expand module containing current lesson by default
        const moduleWithCurrentLesson = modules.find(m =>
            m.lessons.some(l => l._id === currentLessonId)
        );
        return moduleWithCurrentLesson ? [moduleWithCurrentLesson._id] : [modules[0]?._id];
    });

    const toggleModule = (moduleId) => {
        setExpandedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const getContentTypeIcon = (contentType) => {
        switch (contentType) {
            case 'Video':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                );
            case 'PDF':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                );
            case 'Link':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full overflow-y-auto">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Course Content
                </h2>
            </div>

            <div className="py-2">
                {modules.map((module, moduleIndex) => (
                    <div key={module._id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                        {/* Module Header */}
                        <button
                            onClick={() => toggleModule(module._id)}
                            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold flex items-center justify-center">
                                    {moduleIndex + 1}
                                </span>
                                <div className="flex-1 min-w-0 text-left">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {module.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {module.completedLessons}/{module.totalLessons} lessons
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                                {module.isCompleted && (
                                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <svg
                                    className={`w-5 h-5 text-gray-400 transform transition-transform ${expandedModules.includes(module._id) ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>

                        {/* Module Progress */}
                        {expandedModules.includes(module._id) && (
                            <div className="px-4 pb-2">
                                <ProgressBar progress={module.progress} size="sm" showLabel={false} />
                            </div>
                        )}

                        {/* Lessons List */}
                        {expandedModules.includes(module._id) && (
                            <div className="px-3 pb-3">
                                {module.lessons.map((lesson, lessonIndex) => (
                                    <button
                                        key={lesson._id}
                                        onClick={() => onSelectLesson(lesson, module)}
                                        className={`w-full px-3 py-2.5 rounded-lg flex items-center gap-3 text-left transition-colors mb-1 ${currentLessonId === lesson._id
                                                ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300'
                                            }`}
                                    >
                                        {/* Completion Status */}
                                        <div className="flex-shrink-0">
                                            {lesson.isCompleted ? (
                                                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <div className={`w-5 h-5 rounded-full border-2 ${currentLessonId === lesson._id
                                                        ? 'border-indigo-500'
                                                        : 'border-gray-300 dark:border-gray-600'
                                                    }`} />
                                            )}
                                        </div>

                                        {/* Lesson Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {lessonIndex + 1}. {lesson.title}
                                            </p>
                                        </div>

                                        {/* Content Type Icon */}
                                        <div className="flex-shrink-0 text-gray-400">
                                            {getContentTypeIcon(lesson.contentType)}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
