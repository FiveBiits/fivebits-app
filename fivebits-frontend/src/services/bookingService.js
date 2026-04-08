import api from './authService';

export const createBooking = (data) => api.post('/api/bookings/create', data);
export const confirmBooking = (id) => api.patch(`/api/bookings/${id}/confirm`);
export const cancelBooking = (id) => api.patch(`/api/bookings/${id}/cancel`);
export const completeBooking = (id) => api.patch(`/api/bookings/${id}/complete`);
export const getStudentBookings = (studentId) => api.get(`/api/bookings/student/${studentId}`);
export const getOwnerBookings = (ownerId) => api.get(`/api/bookings/owner/${ownerId}`);
