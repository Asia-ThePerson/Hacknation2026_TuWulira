// Safety layer (F3). Runs on every transcribed turn before anything is saved.
// Order matters: danger signs are checked first and ignore confidence (D3, PR9).
import { DANGER_SIGNS } from './danger-signs.ts';

export const ASK_A_PERSON = 'Not sure. Please ask a person.';
export const TELL_THE_NURSE = 'Tell the nurse now.';

// ponytail: single global threshold; calibrate per field once eval/results has data (RQ4.2).
export const CONFIDENCE_THRESHOLD = 0.8;

export type Turn = { transcript: string; confidence: number };
export type SafetyResult =
  | { kind: 'danger'; signIds: string[]; message: string }
  | { kind: 'ask_person'; message: string }
  | { kind: 'ok' };

export function findDangerSigns(text: string): string[] {
  const t = text.toLowerCase();
  return DANGER_SIGNS.filter((s) => [...s.phrasesEn, ...s.phrasesLg].some((p) => t.includes(p.toLowerCase()))).map((s) => s.id);
}

export function assessTurn(turn: Turn): SafetyResult {
  const signIds = findDangerSigns(turn.transcript);
  if (signIds.length) return { kind: 'danger', signIds, message: TELL_THE_NURSE };
  // Total failure (silence, crying, noise) arrives as an empty transcript or very low confidence (RQ4.4).
  if (!turn.transcript.trim() || turn.confidence < CONFIDENCE_THRESHOLD) return { kind: 'ask_person', message: ASK_A_PERSON };
  return { kind: 'ok' };
}
