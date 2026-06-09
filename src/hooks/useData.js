import { useState, useEffect } from 'react';

/**
 * Fetches a JSON file from /public/data/ and returns { data, loading, error }.
 * The file is re-read on every page load so GitHub edits are picked up on next deploy.
 */
function useJsonFile(filename) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/${filename}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load ${filename}: ${res.status}`);
        return res.json();
      })
      .then((json) => { setData(json); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [filename]);

  return { data, loading, error };
}

export function useJobs() {
  return useJsonFile('jobs.json');
}

export function useConfig() {
  return useJsonFile('config.json');
}

export function useContent() {
  return useJsonFile('content.json');
}

/**
 * Loads all three files in parallel. Returns combined state.
 * Usage: const { jobs, config, content, loading, error } = useAppData();
 */
export function useAppData() {
  const jobs    = useJsonFile('jobs.json');
  const config  = useJsonFile('config.json');
  const content = useJsonFile('content.json');

  const loading = jobs.loading || config.loading || content.loading;
  const error   = jobs.error   || config.error   || content.error;

  return {
    jobs:    jobs.data,
    config:  config.data,
    content: content.data,
    loading,
    error,
  };
}
