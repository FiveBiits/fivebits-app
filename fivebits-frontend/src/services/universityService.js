import api from './authService';

export const getAllUniversities = () => api.get('/api/universities');
