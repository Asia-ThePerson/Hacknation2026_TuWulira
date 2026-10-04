// Staff PIN session (PR17). Any four digits unlock in the prototype. Locks again after 2 minutes without use.
import { useEffect, useSyncExternalStore } from 'react';

const KEY = 'tuwulira.staff.unlockedUntil';
export const LOCK_MS = 2 * 60 * 1000;
const listeners = new Set<() => void>();

function get(): number {
  try {
    return Number(sessionStorage.getItem(KEY) ?? 0);
  } catch {
    return 0;
  }
}
function set(until: number) {
  try {
    sessionStorage.setItem(KEY, String(until));
  } catch {
    /* private mode: the session simply ends on reload */
  }
  listeners.forEach((l) => l());
}

export const unlock = () => set(Date.now() + LOCK_MS);
export const lock = () => set(0);

export function useUnlocked(): boolean {
  const until = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    get,
  );
  // Any tap or key press keeps the session open; a timer locks it when it runs out.
  useEffect(() => {
    if (!until) return;
    const bump = () => {
      if (get() > Date.now()) set(Date.now() + LOCK_MS);
    };
    const events = ['pointerdown', 'keydown'] as const;
    events.forEach((e) => window.addEventListener(e, bump));
    const t = window.setInterval(() => {
      if (get() && get() <= Date.now()) lock();
    }, 5000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      window.clearInterval(t);
    };
  }, [until]);
  return until > Date.now();
}
