// Tiny hash router: works from a file or any static host, offline, with no server rewrites.
import { useSyncExternalStore } from 'react';

const subscribe = (cb: () => void) => {
  window.addEventListener('hashchange', cb);
  return () => window.removeEventListener('hashchange', cb);
};
const getPath = () => window.location.hash.replace(/^#/, '') || '/';

export function usePath(): string {
  return useSyncExternalStore(subscribe, getPath);
}

export function navigate(path: string) {
  window.location.hash = path;
}

// Returns params when `pattern` (e.g. "/clinic/card/:id") matches `path`, otherwise null.
export function match(pattern: string, path: string): Record<string, string> | null {
  const p = pattern.split('/');
  const s = path.split('/');
  if (p.length !== s.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < p.length; i++) {
    if (p[i].startsWith(':')) params[p[i].slice(1)] = decodeURIComponent(s[i]);
    else if (p[i] !== s[i]) return null;
  }
  return params;
}
