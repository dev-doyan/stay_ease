import { apiRequest } from './client';

export function getRooms() {
  return apiRequest('/api/rooms');
}

export function getRoom(id) {
  return apiRequest(`/api/rooms/${id}`);
}

export function createRoom(payload) {
  return apiRequest('/api/rooms', { method: 'POST', body: payload });
}

export function updateRoom(id, payload) {
  return apiRequest(`/api/rooms/${id}`, { method: 'PATCH', body: payload });
}

export function updateRoomStatus(id, status) {
  return apiRequest(`/api/rooms/${id}/status`, {
    method: 'PATCH',
    body: { status },
  });
}

export function deleteRoom(id) {
  return apiRequest(`/api/rooms/${id}`, { method: 'DELETE' });
}
