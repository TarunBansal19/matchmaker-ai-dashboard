import { apiRequest } from './apiClient';
import { getStoredMatchmaker } from './authService';

export function getNotesByCustomer(customerId) {
  return apiRequest(`/api/notes/customer/${customerId}`);
}

export function createNote(customerId, noteText) {
  const matchmaker = getStoredMatchmaker();
  return apiRequest(`/api/notes/customer/${customerId}`, {
    method: 'POST',
    body: JSON.stringify({ note: noteText, matchmakerId: matchmaker?.id }),
  });
}
