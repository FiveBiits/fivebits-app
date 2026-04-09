import api from './authService';

export const getStudentStats = (studentId) => api.get(`/api/dashboard/student/${studentId}`);
export const getOwnerStats = (ownerId) => api.get(`/api/dashboard/owner/${ownerId}`);
