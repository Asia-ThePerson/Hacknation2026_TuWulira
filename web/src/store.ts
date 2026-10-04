// localStorage-backed state shared between tabs. Stands in for the encrypted QR handoff (D33) in the prototype.
// Every read and write is guarded: private windows or blocked storage fall back to in-memory values.
import { useMemo, useSyncExternalStore } from 'react';

const memory = new Map<string, string>();
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function getRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return memory.get(key) ?? null;
  }
}

export function read<T>(key: string, fallback: T): T {
  const raw = getRaw(key);
  if (raw == null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function write<T>(key: string, value: T | null) {
  const raw = value == null ? null : JSON.stringify(value);
  try {
    if (raw == null) localStorage.removeItem(key);
    else localStorage.setItem(key, raw);
  } catch {
    if (raw == null) memory.delete(key);
    else memory.set(key, raw);
  }
  notify();
}

if (typeof window !== 'undefined') window.addEventListener('storage', notify); // other tabs

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export function useStored<T>(key: string, fallback: T): T {
  const raw = useSyncExternalStore(subscribe, () => getRaw(key));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => read(key, fallback), [raw]);
}
