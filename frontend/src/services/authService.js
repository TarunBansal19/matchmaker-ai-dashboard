import { hasSupabaseConfig, supabase } from '../lib/supabase';
import { apiRequest } from './apiClient';

const MATCHMAKER_STORAGE_KEY = 'matchmaker';

async function fetchMatchmaker(email) {
  const matchmaker = await apiRequest('/api/auth/me', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });

  localStorage.setItem(MATCHMAKER_STORAGE_KEY, JSON.stringify(matchmaker));
  return matchmaker;
}

export async function login({ email, password }) {
  if (!hasSupabaseConfig) {
    throw new Error('Supabase env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  const session = data.session;

  if (!session?.user?.email) {
    throw new Error('Supabase did not return a valid user session.');
  }

  const matchmaker = await fetchMatchmaker(session.user.email);

  return {
    session,
    matchmaker,
  };
}

export async function logout() {
  localStorage.removeItem(MATCHMAKER_STORAGE_KEY);
  return supabase.auth.signOut();
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
}

export function getStoredMatchmaker() {
  const storedMatchmaker = localStorage.getItem(MATCHMAKER_STORAGE_KEY);

  if (!storedMatchmaker) {
    return null;
  }

  try {
    return JSON.parse(storedMatchmaker);
  } catch {
    localStorage.removeItem(MATCHMAKER_STORAGE_KEY);
    return null;
  }
}
