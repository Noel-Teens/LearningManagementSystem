import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
    getCourse,
    createCourse,
    updateCourse,
    addModule,
    updateModule,
    deleteModule,
    addLesson,
    updateLesson,
    deleteLesson,
    uploadFile,
} from '../../../api/courseApi';

/**
 * CourseBuilder Page
 * Create or edit a course with modules and lessons.
 */
const CourseBuilder = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(courseId);

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Course state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [modules, setModules] = useState([]);
    const [status, setStatus] = useState('Draft');

    // UI state
    const [expandedModules, setExpandedModules] = useState({});
    const [activeModuleId, setActiveModuleId] = useState(null);
    const [showLessonForm, setShowLessonForm] = useState(null); // moduleId if open
    const [lessonForm, setLessonForm] = useState({ title: '', contentType: 'Link', contentUrl: '' });

    // Fetch course data if editing
    useEffect(() => {
        if (isEditMode) {
            fetchCourse();
        }
    }, [courseId]);

    const fetchCourse = async () => {
        try {
            setLoading(true);
            const response = await getCourse(courseId);
            const course = response.data.data;
            setTitle(course.title);
            setDescription(course.description || '');
            setModules(course.modules.filter((m) => !m.isDeleted) || []);
            setStatus(course.status);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to fetch course');
            navigate('/courses');
        } finally {
            setLoading(false);
        }
    };

    // ==========================================================================
    // COURSE ACTIONS
    // ==========================================================================

    const handleSaveCourse = async () => {
        if (!title.trim()) {
            toast.error('Course title is required');
            return;
        }
        try {
            setSaving(true);
            if (isEditMode) {
                await updateCourse(courseId, { title, description });
                toast.success('Course updated');
            } else {
                const response = await createCourse({ title, description });
                toast.success('Course created');
                navigate(`/courses/${response.data.data._id}/edit`);
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save course');
        } finally {
            setSaving(false);
        }
    };

    // ==========================================================================
    // MODULE ACTIONS
    // ==========================================================================

    const handleAddModule = async () => {
        const moduleTitle = prompt('Enter module title:');
        if (!moduleTitle?.trim()) return;
        try {
            await addModule(courseId, { title: moduleTitle });
            toast.success('Module added');
            fetchCourse();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to add module');
        }
    };

    const handleUpdateModuleTitle = async (moduleId, newTitle) => {
        if (!newTitle?.trim()) return;
        try {
            await updateModule(courseId, moduleId, { title: newTitle });
            fetchCourse();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update module');
        }
    };

    const handleDeleteModule = async (moduleId) => {
        if (!window.confirm('Delete this module?')) return;
        try {
            await deleteModule(courseId, moduleId);
            toast.success('Module deleted');
            fetchCourse();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete module');
        }
    };

    const toggleModuleExpand = (moduleId) => {
        setExpandedModules((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }));
    };

    // ==========================================================================
    // LESSON ACTIONS
    // ==========================================================================

    const handleAddLesson = async (moduleId) => {
        if (!lessonForm.title.trim() || !lessonForm.contentUrl.trim()) {
            toast.error('Lesson title and content URL are required');
            return;
        }
        try {
            await addLesson(courseId, moduleId, lessonForm);
            toast.success('Lesson added');
            setShowLessonForm(null);
            setLessonForm({ title: '', contentType: 'Link', contentUrl: '' });
            fetchCourse();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to add lesson');
        }
    };

    const handleDeleteLesson = async (moduleId, lessonId) => {
        if (!window.confirm('Delete this lesson?')) return;
        try {
            await deleteLesson(courseId, moduleId, lessonId);
            toast.success('Lesson deleted');
            fetchCourse();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to delete lesson');
        }
    };

    // ==========================================================================
    // FILE UPLOAD
    // ==========================================================================

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const response = await uploadFile(file);
            const { url, contentType } = response.data.data;
            setLessonForm((prev) => ({ ...prev, contentUrl: url, contentType }));
            toast.success(`${contentType} uploaded successfully`);
        } catch (error) {
            toast.error(error.response?.data?.error || 'File upload failed');
        } finally {
            setUploading(false);
        }
    };

    // ==========================================================================
    // RENDER
    // ==========================================================================

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isEditMode ? 'Edit Course' : 'Create Course'}
                </h1>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/courses')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSaveCourse}
                        disabled={saving}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Course'}
                    </button>
                </div>
            </div>

            {/* Course Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Details</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter course title"
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter course description"
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    {isEditMode && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                            <span
                                className={`px-2.5 py-1 text-xs font-medium rounded-full ${status === 'Published'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                    }`}
                            >
                                {status}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Modules Section (only in edit mode) */}
            {isEditMode && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Modules</h2>
                        <button
                            onClick={handleAddModule}
                            className="px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                        >
                            + Add Module
                        </button>
                    </div>

                    {modules.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                            No modules yet. Add your first module.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {modules.map((module, mIndex) => (
                                <div
                                    key={module._id}
                                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                                >
                                    {/* Module Header */}
                                    <div
                                        className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-900 cursor-pointer"
                                        onClick={() => toggleModuleExpand(module._id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-400">{mIndex + 1}</span>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {module.title}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                ({module.lessons?.filter((l) => !l.isDeleted).length || 0} lessons)
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const newTitle = prompt('Edit module title:', module.title);
                                                    if (newTitle) handleUpdateModuleTitle(module._id, newTitle);
                                                }}
                                                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteModule(module._id);
                                                }}
                                                className="p-1 text-red-400 hover:text-red-600"
                                            >
                                                🗑️
                                            </button>
                                            <span className="text-gray-400">
                                                {expandedModules[module._id] ? '▼' : '▶'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Lessons (expanded) */}
                                    {expandedModules[module._id] && (
                                        <div className="px-4 py-3 bg-white dark:bg-gray-800">
                                            {/* Lessons List */}
                                            {module.lessons?.filter((l) => !l.isDeleted).length > 0 ? (
                                                <ul className="space-y-2 mb-3">
                                                    {module.lessons
                                                        .filter((l) => !l.isDeleted)
                                                        .map((lesson, lIndex) => (
                                                            <li
                                                                key={lesson._id}
                                                                className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-xs text-gray-400">
                                                                        {mIndex + 1}.{lIndex + 1}
                                                                    </span>
                                                                    <span
                                                                        className={`px-2 py-0.5 text-xs rounded ${lesson.contentType === 'PDF'
                                                                                ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                                                                : lesson.contentType === 'Video'
                                                                                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                                                                                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                                            }`}
                                                                    >
                                                                        {lesson.contentType}
                                                                    </span>
                                                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                                                        {lesson.title}
                                                                    </span>
                                                                </div>
                                                                <button
                                                                    onClick={() =>
                                                                        handleDeleteLesson(module._id, lesson._id)
                                                                    }
                                                                    className="text-red-400 hover:text-red-600 text-sm"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </li>
                                                        ))}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-400 text-sm mb-3">No lessons in this module.</p>
                                            )}

                                            {/* Add Lesson Form */}
                                            {showLessonForm === module._id ? (
                                                <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3 space-y-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Lesson title"
                                                        value={lessonForm.title}
                                                        onChange={(e) =>
                                                            setLessonForm((prev) => ({
                                                                ...prev,
                                                                title: e.target.value,
                                                            }))
                                                        }
                                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    />
                                                    <div className="flex gap-2">
                                                        <select
                                                            value={lessonForm.contentType}
                                                            onChange={(e) =>
                                                                setLessonForm((prev) => ({
                                                                    ...prev,
                                                                    contentType: e.target.value,
                                                                }))
                                                            }
                                                            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                        >
                                                            <option value="Link">Link</option>
                                                            <option value="PDF">PDF</option>
                                                            <option value="Video">Video</option>
                                                        </select>
                                                        {lessonForm.contentType === 'Link' ? (
                                                            <input
                                                                type="url"
                                                                placeholder="https://..."
                                                                value={lessonForm.contentUrl}
                                                                onChange={(e) =>
                                                                    setLessonForm((prev) => ({
                                                                        ...prev,
                                                                        contentUrl: e.target.value,
                                                                    }))
                                                                }
                                                                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                            />
                                                        ) : (
                                                            <label className="flex-1 flex items-center justify-center px-3 py-2 text-sm border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-pointer hover:border-indigo-500">
                                                                <input
                                                                    type="file"
                                                                    accept={
                                                                        lessonForm.contentType === 'PDF'
                                                                            ? 'application/pdf'
                                                                            : 'video/*'
                                                                    }
                                                                    onChange={handleFileUpload}
                                                                    className="hidden"
                                                                />
                                                                {uploading
                                                                    ? 'Uploading...'
                                                                    : lessonForm.contentUrl
                                                                        ? '✓ Uploaded'
                                                                        : `Choose ${lessonForm.contentType}`}
                                                            </label>
                                                        )}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAddLesson(module._id)}
                                                            className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                                                        >
                                                            Add Lesson
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setShowLessonForm(null);
                                                                setLessonForm({
                                                                    title: '',
                                                                    contentType: 'Link',
                                                                    contentUrl: '',
                                                                });
                                                            }}
                                                            className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setShowLessonForm(module._id)}
                                                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                                                >
                                                    + Add Lesson
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CourseBuilder;
