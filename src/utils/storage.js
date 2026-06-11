const KEY = 'aksal_candidatures_v4';

export function getCandidatures() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveCandidatures(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr));
}

export function addCandidature(obj) {
  const arr = getCandidatures();
  arr.unshift(obj);
  saveCandidatures(arr);
}

export function updateCandidatureStatus(id, status) {
  const arr = getCandidatures();
  const idx = arr.findIndex((c) => c.id === id);
  if (idx !== -1) { arr[idx].status = status; saveCandidatures(arr); }
}

export function clearCandidatures() {
  localStorage.removeItem(KEY);
}
