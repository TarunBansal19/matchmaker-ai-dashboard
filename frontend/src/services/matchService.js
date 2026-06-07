import { apiRequest } from './apiClient';
import { getStoredMatchmaker } from './authService';

export function getAllMatches() {
  const matchmaker = getStoredMatchmaker();
  const query = matchmaker?.id ? `?matchmakerId=${matchmaker.id}` : '';
  return apiRequest(`/api/matches${query}`);
}

export function generateMatchesForCustomer(customerId) {
  return apiRequest(`/api/matches/generate/${customerId}`, {
    method: 'POST',
  });
}

export function sendMatch(matchId) {
  return apiRequest(`/api/matches/${matchId}/send`, {
    method: 'POST',
  });
}
