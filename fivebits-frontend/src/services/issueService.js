import api from './authService';

export const submitIssue = (data) => api.post('/api/issues/submit', data);
export const resolveIssue = (id, reply) => api.patch(`/api/issues/${id}/resolve`, { reply });
export const getStudentIssues = (studentId) => api.get(`/api/issues/student/${studentId}`);
export const getOwnerIssues = (ownerId) => api.get(`/api/issues/owner/${ownerId}`);
