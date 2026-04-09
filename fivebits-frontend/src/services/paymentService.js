import api from './authService';

export const getStudentPayments = (studentId) => api.get(`/api/payments/student/${studentId}`);
export const getOwnerPayments = (ownerId) => api.get(`/api/payments/owner/${ownerId}`);
