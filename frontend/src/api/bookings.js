import { apiRequest } from './client';

export function createBooking({ roomId, checkIn, checkOut }) {
  return apiRequest('/api/bookings', {
    method: 'POST',
    body: { roomId, checkIn, checkOut },
  });
}

export function getMyBookings() {
  return apiRequest('/api/bookings/my');
}

export function getBooking(id) {
  return apiRequest(`/api/bookings/${id}`);
}

export function cancelBooking(id) {
  return apiRequest(`/api/bookings/${id}/cancel`, { method: 'PATCH' });
}

export function getAllBookings() {
  return apiRequest('/api/bookings');
}

export function checkInBooking(id) {
  return apiRequest(`/api/bookings/${id}/check-in`, { method: 'PATCH' });
}

export function checkOutBooking(id) {
  return apiRequest(`/api/bookings/${id}/check-out`, { method: 'PATCH' });
}
