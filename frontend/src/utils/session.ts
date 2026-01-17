export function getAccess() {
  return localStorage.getItem('access');
}

export function getUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

export function isLoggedIn() {
  return !!getAccess();
}

export function isAdmin() {
  const u = getUser();
  return u?.email === 'admin@cienspay.com';
}
