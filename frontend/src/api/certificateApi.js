import axiosInstance from './axios';

/**
 * Get all certificates for a user
 * @param {string} userId - User ID
 * @returns {Promise} - API response with certificates array
 */
export const getUserCertificates = async (userId) => {
    const response = await axiosInstance.get(`/certifications/user/${userId}`);
    return response.data;
};

/**
 * Get a single certificate by ID
 * @param {string} certificateId - Certificate ID
 * @returns {Promise} - API response with certificate data
 */
export const getCertificate = async (certificateId) => {
    const response = await axiosInstance.get(`/certifications/${certificateId}`);
    return response.data;
};

/**
 * Verify certificate authenticity
 * @param {string} certificateId - Certificate ID
 * @returns {Promise} - API response with verification status
 */
export const verifyCertificate = async (certificateId) => {
    const response = await axiosInstance.get(`/certifications/verify/${certificateId}`);
    return response.data;
};

/**
 * Manually generate certificate (if needed)
 * @param {string} userId - User ID
 * @param {string} courseId - Course ID
 * @returns {Promise} - API response with certificate data
 */
export const generateCertificate = async (userId, courseId) => {
    const response = await axiosInstance.post('/certifications/generate', {
        userId,
        courseId
    });
    return response.data;
};

/**
 * Get certificate download URL
 * @param {string} certificateUrl - Relative certificate URL
 * @returns {string} - Full download URL
 */
export const getCertificateDownloadUrl = (certificateUrl) => {
    // Get base URL (http://localhost:5000/api)
    const apiBaseURL = axiosInstance.defaults.baseURL || 'http://localhost:5000/api';

    // Remove '/api' from the end to get the root URL (http://localhost:5000)
    const rootURL = apiBaseURL.replace(/\/api\/?$/, '');

    return `${rootURL}${certificateUrl}`;
};
