import { apiRequest } from './apiClient';
import { getStoredMatchmaker } from './authService';

export function getDashboardStats() {
  const matchmaker = getStoredMatchmaker();
  if (!matchmaker) throw new Error("Matchmaker not found");
  return apiRequest(`/api/dashboard/stats?matchmakerId=${matchmaker.id}`);
}
