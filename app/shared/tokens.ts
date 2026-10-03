// Design tokens. Mirrors docs/design/design-system.md; change both together.
export const color = {
  bg: '#FFFFFF',
  surface: '#F4F6F7',
  text: '#111417',
  textMuted: '#4A5560',
  primary: '#0F4C5C',
  onPrimary: '#FFFFFF',
  flag: '#8A5A00',
  flagBg: '#FFF4D6',
  danger: '#A1121A', // danger signs only
  dangerBg: '#FDE7E8',
  confirmed: '#1E6B3A',
} as const;

export const type = {
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  body: { fontSize: 20, lineHeight: 28 },
  label: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  prompt: { fontSize: 32, lineHeight: 40, fontWeight: '700' },
} as const;

export const space = [4, 8, 12, 16, 24, 32] as const;
export const minTouch = 56;
