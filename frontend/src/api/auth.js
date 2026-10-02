import { apiRequest } from './client';

export function register({ name, email, password }) {
  return apiRequest('/api/user/signup', {
    method: 'POST',
    body: { name, email, password },
  });
}

export function login({ email, password }) {
  return apiRequest('/api/user/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function logout() {
  return apiRequest('/api/user/logout', { method: 'POST' });
}
