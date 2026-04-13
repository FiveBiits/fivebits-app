import api from './authService';

export const placeBid = (placeId, studentId, offeredPrice) =>
  api.post('/api/bids/place', { placeId, studentId, offeredPrice });

export const getPlaceBids = (placeId) =>
  api.get(`/api/bids/place/${placeId}`);

export const getStudentBids = (studentId) =>
  api.get(`/api/bids/student/${studentId}`);

export const acceptBid = (bidId) =>
  api.patch(`/api/bids/${bidId}/accept`);

export const rejectBid = (bidId) =>
  api.patch(`/api/bids/${bidId}/reject`);

export const withdrawBid = (bidId) =>
  api.delete(`/api/bids/${bidId}`);

export const toggleBidding = (placeId, allowBidding) =>
  api.patch(`/api/places/${placeId}/bidding-toggle?allowBidding=${allowBidding}`);
