import { API_URL, ApiError } from './client';

export async function uploadRoomImage(roomId, file) {
  const formData = new FormData();
  formData.append('image', file);

  let response;
  try {
    response = await fetch(`${API_URL}/api/rooms/${roomId}/images`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
  } catch {
    throw new ApiError('Unable to reach the server.', 0);
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message || 'Upload failed', response.status, data);
  }

  return data;
}
