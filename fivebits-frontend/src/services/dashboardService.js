import api from './authService';

export const getStudentStats = (studentId) => api.get(`/api/dashboard/student/${studentId}`);
export const getOwnerStats = (ownerId) => api.get(`/api/dashboard/owner/${ownerId}`);
export const getNotifications = (userId) => api.get(`/api/notifications/user/${userId}`);
export const getUnreadCount = (userId) => api.get(`/api/notifications/user/${userId}/unread-count`);
export const markAsRead = (id) => api.patch(`/api/notifications/${id}/read`);
export const markAllAsRead = (userId) => api.patch(`/api/notifications/user/${userId}/read-all`);
