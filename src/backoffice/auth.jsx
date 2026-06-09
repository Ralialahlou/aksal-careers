const BO_KEY = 'aksal_bo_auth';
const PASSWORD = 'aksal2026';

export function isAuthenticated() {
  return sessionStorage.getItem(BO_KEY) === 'true';
}

export function login(password) {
  if (password === PASSWORD) {
    sessionStorage.setItem(BO_KEY, 'true');
    return true;
  }
  return false;
}

export function logout() {
  sessionStorage.removeItem(BO_KEY);
}
