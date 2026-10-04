// Small inline stroke icons, so nothing is fetched at runtime. Always paired with a text label.
const PATHS = {
  alert: 'M12 3 2 20h20L12 3Zm0 6v5m0 3v.01',
  check: 'M4 12.5 9.5 18 20 6.5',
  x: 'M6 6l12 12M18 6 6 18',
  question: 'M9 9a3 3 0 1 1 4.5 2.6c-.9.5-1.5 1.2-1.5 2.4m0 3v.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z',
  person: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0',
  phone: 'M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z',
  chat: 'M4 5h16v11H9l-5 4V5Z',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2',
  chevron: 'm9 5 7 7-7 7',
  back: 'm15 5-7 7 7 7',
  lock: 'M6 11h12v10H6V11Zm2 0V8a4 4 0 1 1 8 0v3',
  mic: 'M12 3a3 3 0 0 0-3 3v6a3 3 0 1 0 6 0V6a3 3 0 0 0-3-3Zm-7 9a7 7 0 0 0 14 0m-7 7v3',
  speaker: 'M4 9v6h4l5 4V5L8 9H4Zm13 0a4 4 0 0 1 0 6',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Zm5-2 5 5',
  sync: 'M20 11a8 8 0 0 0-14.6-4M4 4v4h4m-4 5a8 8 0 0 0 14.6 4M20 20v-4h-4',
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, size = 20, label }: { name: IconName; size?: number; label?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      style={{ flex: 'none' }}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
