import api from "../api/axios";

// Get all notifications for a user
export const getNotifications = async (userId) => {
    const response = await api.get(`/notifications/${userId}`);
    return response.data;
};

// Create a notification (mainly for testing or specific client-side triggers)
export const createNotification = async (data) => {
    const response = await api.post("/notifications", data);
    return response.data;
};

// Get unread count
export const getUnreadCount = async (userId) => {
    const response = await api.get(`/notifications/unread/count/${userId}`);
    return response.data;
};

// Mark all as read
export const markAsRead = async (userId) => {
    const response = await api.put(`/notifications/mark-as-read/${userId}`);
    return response.data;
};
