import api from './authService';

export const getAllPlaces = () => api.get('/api/places');
export const getOwnerPlaces = (ownerId) => api.get(`/api/places/owner/${ownerId}`);
export const searchPlaces = (params) => api.get('/api/places/search', { params });
export const getRecommendations = (params) => api.get('/api/places/recommendations', { params });
export const createPlace = (ownerId, data) => api.post(`/api/places/add?ownerId=${ownerId}`, data);
export const deletePlace = (id) => api.delete(`/api/places/${id}`);

export const uploadPlaceImages = (placeId, files, mainIndex) => {
  const formData = new FormData();
  files.forEach(f => formData.append('files', f));
  formData.append('mainIndex', mainIndex);
  return api.post(`/api/places/${placeId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const deletePlaceImage = (imageId) => api.delete(`/api/places/images/${imageId}`);
export const setMainPlaceImage = (imageId) => api.patch(`/api/places/images/${imageId}/main`);
