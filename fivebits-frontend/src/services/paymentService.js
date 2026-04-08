import api from './authService';

export const createPayment = (data) => api.post('/api/payments/create', data);
export const processPayment = (id) => api.patch(`/api/payments/${id}/process`);
export const getStudentPayments = (studentId) => api.get(`/api/payments/student/${studentId}`);
export const getOwnerPayments = (ownerId) => api.get(`/api/payments/owner/${ownerId}`);
