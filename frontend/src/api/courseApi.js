import api from './axios';

// =============================================================================
// COURSE API SERVICE
// =============================================================================

/**
 * Get all active courses for the current trainer
 */
export const getCourses = () => api.get('/courses');

/**
 * Get a single course by ID
 */
export const getCourse = (courseId) => api.get(`/courses/${courseId}`);

/**
 * Create a new course
 */
export const createCourse = (data) => api.post('/courses', data);

/**
 * Update an existing course
 */
export const updateCourse = (courseId, data) => api.put(`/courses/${courseId}`, data);

/**
 * Toggle publish status (Draft <-> Published)
 */
export const togglePublishStatus = (courseId) => api.patch(`/courses/${courseId}/publish`);

/**
 * Soft delete a course (move to Trash Bin)
 */
export const deleteCourse = (courseId) => api.delete(`/courses/${courseId}`);

/**
 * Restore a course from Trash Bin
 */
export const restoreCourse = (courseId) => api.patch(`/courses/${courseId}/restore`);

/**
 * Get Trash Bin items
 */
export const getTrashBin = () => api.get('/courses/trash');

/**
 * Permanently delete a course from Trash Bin
 */
export const permanentDeleteCourse = (courseId) => api.delete(`/courses/${courseId}/permanent`);

// =============================================================================
// MODULE API
// =============================================================================

/**
 * Add a module to a course
 */
export const addModule = (courseId, data) => api.post(`/courses/${courseId}/modules`, data);

/**
 * Update a module
 */
export const updateModule = (courseId, moduleId, data) =>
    api.put(`/courses/${courseId}/modules/${moduleId}`, data);

/**
 * Soft delete a module
 */
export const deleteModule = (courseId, moduleId) =>
    api.delete(`/courses/${courseId}/modules/${moduleId}`);

/**
 * Restore a module from Trash Bin
 */
export const restoreModule = (courseId, moduleId) =>
    api.patch(`/courses/${courseId}/modules/${moduleId}/restore`);

// =============================================================================
// LESSON API
// =============================================================================

/**
 * Add a lesson to a module
 */
export const addLesson = (courseId, moduleId, data) =>
    api.post(`/courses/${courseId}/modules/${moduleId}/lessons`, data);

/**
 * Update a lesson
 */
export const updateLesson = (courseId, moduleId, lessonId, data) =>
    api.put(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, data);

/**
 * Soft delete a lesson
 */
export const deleteLesson = (courseId, moduleId, lessonId) =>
    api.delete(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);

/**
 * Restore a lesson
 */
export const restoreLesson = (courseId, moduleId, lessonId) =>
    api.patch(`/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/restore`);

// =============================================================================
// FILE UPLOAD
// =============================================================================

/**
 * Upload a file (PDF or Video) to Cloudinary
 * @param {File} file - The file to upload
 * @returns {Promise} - Response with { url, public_id, contentType }
 */
export const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/courses/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
