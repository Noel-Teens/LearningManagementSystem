import api from './axios';

// =============================================================================
// ADMIN ENROLLMENT APIs
// =============================================================================

/**
 * Enroll a learner to a course (Admin only)
 * @param {string} learnerId - The learner's user ID
 * @param {string} courseId - The course ID
 */
export const enrollLearner = async (learnerId, courseId) => {
    const response = await api.post('/enrollments/admin/enroll', {
        learnerId,
        courseId
    });
    return response.data;
};

/**
 * Remove an enrollment (Admin only)
 * @param {string} enrollmentId - The enrollment ID to remove
 */
export const removeEnrollment = async (enrollmentId) => {
    const response = await api.delete(`/enrollments/admin/${enrollmentId}`);
    return response.data;
};

/**
 * Get all enrolled learners for a course (Admin only)
 * @param {string} courseId - The course ID
 */
export const getEnrolledLearnersByCourse = async (courseId) => {
    const response = await api.get(`/enrollments/admin/course/${courseId}`);
    return response.data;
};

/**
 * Get all enrollments (Admin overview)
 */
export const getAllEnrollments = async () => {
    const response = await api.get('/enrollments/admin/all');
    return response.data;
};

// =============================================================================
// LEARNER ENROLLMENT APIs
// =============================================================================

/**
 * Get enrolled courses for the logged-in learner
 */
export const getEnrolledCourses = async () => {
    const response = await api.get('/enrollments/learner/courses');
    return response.data;
};

/**
 * Get course learning structure with modules/lessons and progress
 * @param {string} courseId - The course ID
 */
export const getCourseLearningStructure = async (courseId) => {
    const response = await api.get(`/enrollments/learner/courses/${courseId}/learn`);
    return response.data;
};

/**
 * Mark a lesson as completed
 * @param {string} courseId - The course ID
 * @param {string} lessonId - The lesson ID to mark complete
 */
export const markLessonComplete = async (courseId, lessonId) => {
    const response = await api.post(
        `/enrollments/learner/courses/${courseId}/lessons/${lessonId}/complete`
    );
    return response.data;
};

/**
 * Get course progress
 * @param {string} courseId - The course ID
 */
export const getCourseProgress = async (courseId) => {
    const response = await api.get(`/enrollments/learner/courses/${courseId}/progress`);
    return response.data;
};

/**
 * Get resume learning info (last accessed lesson)
 * @param {string} courseId - The course ID
 */
export const getResumeLearning = async (courseId) => {
    const response = await api.get(`/enrollments/learner/courses/${courseId}/resume`);
    return response.data;
};

/**
 * Update last accessed lesson (for tracking)
 * @param {string} courseId - The course ID
 * @param {string} lessonId - The lesson ID being accessed
 */
export const updateLastAccessed = async (courseId, lessonId) => {
    const response = await api.post(
        `/enrollments/learner/courses/${courseId}/lessons/${lessonId}/access`
    );
    return response.data;
};

// =============================================================================
// HELPER APIs (for Admin enrollment form)
// =============================================================================

/**
 * Get all learners (for enrollment dropdown)
 */
export const getLearners = async () => {
    const response = await api.get('/auth/users?role=Learner');
    return response.data;
};

/**
 * Get published courses (for enrollment dropdown)
 */
export const getPublishedCourses = async () => {
    const response = await api.get('/courses?status=Published');
    return response.data;
};

export default {
    // Admin APIs
    enrollLearner,
    removeEnrollment,
    getEnrolledLearnersByCourse,
    getAllEnrollments,
    // Learner APIs
    getEnrolledCourses,
    getCourseLearningStructure,
    markLessonComplete,
    getCourseProgress,
    getResumeLearning,
    updateLastAccessed,
    // Helpers
    getLearners,
    getPublishedCourses
};
