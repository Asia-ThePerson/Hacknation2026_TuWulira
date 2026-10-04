// Design tokens: Guidelines handbook style. Mirrors docs/design/design-system.md and the
// Figma "TuWulira tokens" variables; change all three together.
export const color = {
  bg: '#FFFFFF',
  surface: '#F6F9FB', // rows, cards, patient strip
  chip: '#EAF1F6', // unselected filter chip
  line: '#DCE5EC', // dividers, table rules
  outline: '#6F86A0', // input and field borders (3.75:1 on white)
  text: '#14263D',
  textMuted: '#4D5F75',
  primary: '#12355B', // app bar, primary button
  primaryPressed: '#0C2541',
  onPrimary: '#FFFFFF',
  onPrimaryMuted: '#AFC3DA',
  accent: '#24747D', // section labels, line numbers, selected chip, checkbox
  accentOnDark: '#5FC1C9', // tab underline on navy only
  accentTint: '#E3F1F2', // reported-flag tags, cells from the patient card
  flag: '#7A5300', // low confidence: always dashed border plus "Check"
  flagBg: '#FFF3D1',
  danger: '#A1121A', // danger signs only
  dangerBg: '#FCEBEC',
  confirmed: '#1E6B3A', // always with a check icon
  confirmedBg: '#E6F2EA',
} as const;

export const type = {
  display: { fontSize: 28, lineHeight: 34, fontWeight: '500' },
  title: { fontSize: 26, lineHeight: 32, fontWeight: '500' },
  headline: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  value: { fontSize: 26, lineHeight: 32, fontWeight: '700' },
  bodyLg: { fontSize: 20, lineHeight: 28 },
  body: { fontSize: 16, lineHeight: 24 },
  bodySm: { fontSize: 14, lineHeight: 20 },
  label: { fontSize: 16, lineHeight: 22, fontWeight: '600' }, // field labels
  sectionLabel: { fontSize: 12, lineHeight: 16, fontWeight: '700', letterSpacing: 1.1, textTransform: 'uppercase' }, // "1 · MAIN PROBLEM", in accent
  code: { fontSize: 13, lineHeight: 18, fontWeight: '700', fontFamily: 'monospace' },
  prompt: { fontSize: 32, lineHeight: 40, fontWeight: '700' }, // patient-facing instruction
} as const;

export const space = [4, 8, 12, 16, 24, 32, 48] as const;
export const radius = { sm: 4, md: 8, lg: 12 } as const;
export const minTouch = 56; // primary actions; 48 is the floor for anything tappable
