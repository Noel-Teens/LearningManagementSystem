import { useState } from 'react';

/**
 * Lesson content player component
 * Renders PDF, Video, or Link content based on contentType
 * @param {Object} lesson - Lesson object with title, contentType, contentUrl
 * @param {boolean} isCompleted - Whether the lesson is completed
 * @param {function} onComplete - Callback to mark lesson complete
 * @param {boolean} loading - Whether marking complete is in progress
 */
export default function LessonPlayer({
    lesson,
    isCompleted,
    onComplete,
    loading = false
}) {
    const [showConfirmation, setShowConfirmation] = useState(false);

    if (!lesson) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-gray-500 dark:text-gray-400">
                        Select a lesson to start learning
                    </p>
                </div>
            </div>
        );
    }

    const handleComplete = () => {
        if (isCompleted) return;
        onComplete();
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 2000);
    };

    const renderContent = () => {
        switch (lesson.contentType) {
            case 'Video':
                return (
                    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                        <video
                            key={lesson._id}
                            src={lesson.contentUrl}
                            controls
                            className="w-full h-full"
                            controlsList="nodownload"
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                );

            case 'PDF':
                return (
                    <div className="w-full h-[70vh] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        <iframe
                            key={lesson._id}
                            src={`${lesson.contentUrl}#toolbar=1&navpanes=0`}
                            className="w-full h-full"
                            title={lesson.title}
                        />
                    </div>
                );

            case 'Link':
                return (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                        <svg className="w-16 h-16 mx-auto text-indigo-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            External Resource
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            This lesson links to an external resource.
                        </p>
                        <a
                            href={lesson.contentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
                        >
                            Open Link
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                );

            default:
                return (
                    <div className="text-center text-gray-500 py-8">
                        Unsupported content type
                    </div>
                );
        }
    };

    return (
        <div className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
            <div className="max-w-4xl mx-auto p-6">
                {/* Lesson Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${lesson.contentType === 'Video'
                                ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                                : lesson.contentType === 'PDF'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                    : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                            }`}>
                            {lesson.contentType}
                        </span>
                        {isCompleted && (
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                </svg>
                                Completed
                            </span>
                        )}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {lesson.title}
                    </h1>
                </div>

                {/* Content Area */}
                <div className="mb-6">
                    {renderContent()}
                </div>

                {/* Mark Complete Button */}
                <div className="flex justify-center">
                    {showConfirmation ? (
                        <div className="flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded-lg">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                            Lesson marked as complete!
                        </div>
                    ) : isCompleted ? (
                        <button
                            disabled
                            className="flex items-center gap-2 px-6 py-3 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg cursor-not-allowed"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                            Lesson Completed
                        </button>
                    ) : (
                        <button
                            onClick={handleComplete}
                            disabled={loading}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium rounded-lg transition-colors"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Marking Complete...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Mark as Complete
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
