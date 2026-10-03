// Fixed list of answers for the register form. Mirrors docs/product/register-field-map.md (RQ4.3).
// Field names are working names; check against the Uganda HMIS outpatient register (RQ1.2).

export type FillLevel = 'ai_fill' | 'ai_draft_confirm' | 'clinician_only';

export type FieldSchema =
  | { name: string; level: FillLevel; kind: 'enum'; values: readonly string[] }
  | { name: string; level: FillLevel; kind: 'number'; min: number; max: number }
  | { name: string; level: FillLevel; kind: 'date' | 'verbatim' | 'id' };

export const FIELDS: readonly FieldSchema[] = [
  { name: 'visit_date', level: 'ai_fill', kind: 'date' },
  { name: 'record_id', level: 'ai_fill', kind: 'id' },
  { name: 'consent_recorded', level: 'ai_fill', kind: 'enum', values: ['yes'] },
  { name: 'age_years', level: 'ai_draft_confirm', kind: 'number', min: 0, max: 120 },
  { name: 'sex', level: 'ai_draft_confirm', kind: 'enum', values: ['female', 'male'] },
  { name: 'attendance', level: 'ai_draft_confirm', kind: 'enum', values: ['new', 're_attendance'] },
  { name: 'village', level: 'ai_draft_confirm', kind: 'verbatim' },
  { name: 'weight_kg', level: 'ai_draft_confirm', kind: 'number', min: 0.5, max: 250 },
  { name: 'temperature_c', level: 'ai_draft_confirm', kind: 'number', min: 30, max: 45 },
  { name: 'patient_reported_symptoms', level: 'ai_draft_confirm', kind: 'verbatim' },
  { name: 'danger_sign_flag', level: 'ai_draft_confirm', kind: 'id' },
  { name: 'referral', level: 'ai_draft_confirm', kind: 'enum', values: ['none', 'referred'] },
  { name: 'next_visit_date', level: 'ai_draft_confirm', kind: 'date' },
  { name: 'diagnosis', level: 'clinician_only', kind: 'verbatim' },
  { name: 'tests_and_results', level: 'clinician_only', kind: 'verbatim' },
  { name: 'treatment', level: 'clinician_only', kind: 'verbatim' },
  { name: 'referral_destination', level: 'clinician_only', kind: 'verbatim' },
  { name: 'clinician_name', level: 'clinician_only', kind: 'verbatim' },
];

export const fieldByName = (name: string) => FIELDS.find((f) => f.name === name);

// True only if the value is allowed by the schema. The extractor must pass every value through this.
export function isAllowed(name: string, value: unknown): boolean {
  const f = fieldByName(name);
  if (!f || f.level === 'clinician_only') return false;
  if (f.kind === 'enum') return typeof value === 'string' && f.values.includes(value);
  if (f.kind === 'number') return typeof value === 'number' && value >= f.min && value <= f.max;
  return typeof value === 'string' && value.length > 0;
}
