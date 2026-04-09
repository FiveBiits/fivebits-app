import api from './authService';

export const getAllPlaces = () => api.get('/api/places');
export const getOwnerPlaces = (ownerId) => api.get(`/api/places/owner/${ownerId}`);
export const searchPlaces = (params) => api.get('/api/places/search', { params });
export const getRecommendations = (params) => api.get('/api/places/recommendations', { params });
export const createPlace = (ownerId, data) => api.post(`/api/places/add?ownerId=${ownerId}`, data);
export const deletePlace = (id) => api.delete(`/api/places/${id}`);
