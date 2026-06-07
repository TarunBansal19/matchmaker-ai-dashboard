import { apiRequest } from './apiClient';
import { getStoredMatchmaker } from './authService';

export function getCustomers() {
  const matchmaker = getStoredMatchmaker();
  const query = matchmaker?.id ? `?matchmakerId=${matchmaker.id}` : '';
  return apiRequest(`/api/customers${query}`);
}

export function getCustomerById(id) {
  return apiRequest(`/api/customers/${id}`);
}
