// Constrained extractor (F2, D2). Rule-based: it can only output values that pass the field schema,
// and only values that appear in what the clinician said. Never fills clinician-only fields.
// ponytail: English keyword rules for the stub; Luganda rules come with the speech model (RQ3.1, RQ3.2).
import { isAllowed } from '../shared/field-schemas.ts';
import { CONFIDENCE_THRESHOLD } from '../safety/index.ts';

export type Draft = { field: string; value: string | number; confidence: number; flagged: boolean };

const RULES: { field: string; re: RegExp; parse: (m: RegExpMatchArray) => string | number }[] = [
  { field: 'sex', re: /\b(female|male)\b/, parse: (m) => m[1] },
  { field: 'attendance', re: /\b(new|returning|re-?attendance) (?:patient|visit)\b/, parse: (m) => (m[1] === 'new' ? 'new' : 're_attendance') },
  { field: 'age_years', re: /\bage[d]? (\d{1,3})\b/, parse: (m) => Number(m[1]) },
  { field: 'temperature_c', re: /\btemperature (\d{2}(?:\.\d)?)\b/, parse: (m) => Number(m[1]) },
  { field: 'weight_kg', re: /\bweight (\d{1,3}(?:\.\d)?)\b/, parse: (m) => Number(m[1]) },
];

// `confidence` is the speech model's confidence for the turn; per-word confidence comes later.
export function extract(transcript: string, confidence: number): Draft[] {
  const t = transcript.toLowerCase();
  const drafts: Draft[] = [];
  for (const r of RULES) {
    const m = t.match(r.re);
    if (!m) continue;
    const value = r.parse(m);
    if (!isAllowed(r.field, value)) continue; // out of range or not in the fixed list: never output it
    drafts.push({ field: r.field, value, confidence, flagged: confidence < CONFIDENCE_THRESHOLD });
  }
  return drafts;
}

// A record can be saved only when no drafted field is still flagged (PR6).
export const canSave = (drafts: Draft[]) => drafts.every((d) => !d.flagged);
