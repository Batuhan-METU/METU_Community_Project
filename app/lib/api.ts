import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export const AUTH_TOKEN_KEY = 'user_token';

const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api'
    : 'http://localhost:8080/api';

export async function getStoredToken(): Promise<string | null> {
  return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
}

export async function clearStoredToken(): Promise<void> {
  return SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = await getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...((options?.headers as Record<string, string>) ?? {}),
  };
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  health: () => request<{ status: string }>('/health'),

  getCommunities: () => request<any[]>('/communities'),
  searchCommunities: (q: string) => request<any[]>(`/communities/search?q=${encodeURIComponent(q)}`),

  getEvents: () => request<any[]>('/events'),
  searchEvents: (q: string) => request<any[]>(`/events/search?q=${encodeURIComponent(q)}`),

  login: (email: string, password: string) =>
    request<any>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, full_name: string) =>
    request<any>('/users/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name }),
    }),

  getProfile: () => request<any>('/me/profile'),

  joinEvent: (eventId: string) =>
    request<any>(`/events/join/${eventId}`, { method: 'POST' }),
};
