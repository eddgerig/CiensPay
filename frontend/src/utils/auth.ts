const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export function getAccess() {
  return localStorage.getItem('access');
}
export function getRefresh() {
  return localStorage.getItem('refresh');
}
export function getUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export function setSession(data: { access: string; refresh: string; user: any }) {
  localStorage.setItem('access', data.access);
  localStorage.setItem('refresh', data.refresh);
  localStorage.setItem('user', JSON.stringify(data.user));
}

export function clearSession() {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user');
}

export async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefresh();
  if (!refresh) return null;

  const res = await fetch(`${API_BASE}/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  const text = await res.text();
  let data: any;
  try { data = JSON.parse(text); } catch { return null; }

  if (!res.ok || !data?.access) return null;

  localStorage.setItem('access', data.access);
  return data.access;
}

// Validar token con tu endpoint /api/auth/me/
export async function fetchMe(access: string) {
  const res = await fetch(`${API_BASE}/api/auth/me/`, {
    headers: { Authorization: `Bearer ${access}` },
  });

  const text = await res.text();
  let data: any;
  try { data = JSON.parse(text); } catch { data = null; }

  if (!res.ok || !data?.success) return null;
  return data.user;
}
