import { useState } from 'react';
import { getCandidatures } from '../utils/storage.js';
import { seedMockIfEmpty } from '../utils/mockData.js';

export function useCandidatures() {
  const [candidatures, setCandidatures] = useState(() => {
    seedMockIfEmpty();
    return getCandidatures();
  });

  function reload() {
    setCandidatures(getCandidatures());
  }

  return { candidatures, reload };
}
