// Danger signs that trigger "Tell the nurse now" (PR9, RQ4.1).
// The list itself lives in rules/danger-signs.json (component 3, rule-based on purpose).
// Edit the JSON, never this file, and NEVER add a sign without a source.
import rules from '../../rules/danger-signs.json' with { type: 'json' };

export type DangerStatus = 'cited' | 'verify_page' | 'disabled';

export type DangerSign = {
  id: string;
  ruleId: string;
  label: string;
  question: string; // English text asked; Luganda comes from a native speaker
  set: 'newborn' | 'child' | 'pregnancy' | 'adult';
  appliesWhen: string;
  source: string;
  status: DangerStatus;
  verified: boolean; // true only when the source has been checked (status "cited")
  notSureIsYes: boolean; // pregnancy: "Not sure" also raises the flag
  phrasesEn: string[]; // English demo phrases only, for synthetic test clips
  phrasesLg: string[]; // empty until a native speaker writes them
  note?: string;
};

export const ALL_DANGER_SIGNS: readonly DangerSign[] = rules.signs as DangerSign[];

// Disabled entries have no checked source, so they are never loaded (docs/product/danger-signs.md).
export const DANGER_SIGNS: readonly DangerSign[] = ALL_DANGER_SIGNS.filter((s) => s.status !== 'disabled');

export const ADULT_STANDING_PROMPT: string = rules.adultStandingPrompt;
