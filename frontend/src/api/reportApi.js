import api from './axios';

// =============================================================================
// ADMIN REPORT APIs
// =============================================================================

/**
 * Get organization-wide overview report (Admin only)
 */
export const getAdminOverview = async () => {
    const response = await api.get('/reports/admin/overview');
    return response.data;
};

/**
 * Export report as CSV (Admin only)
 * @param {string} type - 'users', 'courses', or 'enrollments'
 */
export const exportReportCSV = async (type) => {
    const response = await api.get(`/reports/admin/export/${type}`, {
        responseType: 'blob'
    });

    // Trigger browser download
    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type}_report.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

// =============================================================================
// TRAINER ANALYTICS APIs
// =============================================================================

/**
 * Get analytics summary for all trainer's courses
 */
export const getTrainerCoursesAnalytics = async () => {
    const response = await api.get('/reports/trainer/courses');
    return response.data;
};

/**
 * Get detailed analytics for a specific course
 * @param {string} courseId
 */
export const getCourseAnalytics = async (courseId) => {
    const response = await api.get(`/reports/trainer/courses/${courseId}`);
    return response.data;
};

export default {
    getAdminOverview,
    exportReportCSV,
    getTrainerCoursesAnalytics,
    getCourseAnalytics
};
