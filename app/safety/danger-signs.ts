// Danger signs that trigger "Tell the nurse now" (PR9, RQ4.1).
// The list itself lives in rules/danger-signs.json (component 3, rule-based on purpose).
// Edit the JSON, never this file, and NEVER add a sign without a source.
import rules from '../../rules/danger-signs.json' with { type: 'json' };

export type DangerSign = {
  id: string;
  label: string;
  set: 'newborn' | 'child' | 'pregnancy' | 'adult';
  source: string;
  verified: boolean; // checked against the source document by a team member
  phrasesEn: string[]; // English demo phrases only, for synthetic test clips
  phrasesLg: string[]; // empty until a native speaker writes them
};

export const DANGER_SIGNS: readonly DangerSign[] = rules.signs as DangerSign[];
