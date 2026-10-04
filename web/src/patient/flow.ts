// Patient intake flow (path B, staff-assisted on the intake phone), adapted for touch from the Figma
// patient screens (Flash call 1 to 3, Not sure, No consent) and config/questions.lg-UG.json.
// Wording: config `textEn` where it exists, otherwise the Figma prompt for that step, noted per step.
import config from '../../../config/questions.lg-UG.json';
import { YES_NO, type Option } from '../components/answers.ts';
import { ADULT_STANDING_PROMPT, DANGER_SETS, type DangerSet, type DangerSetId } from './danger-sets.ts';

// ---------- the intake record ----------

export type Spoken = { transcript: string; confidence: number };

export type Draft = {
  id: string;
  visitCode: string;
  startedAt: string;
  updatedAt: string;
  lang?: 'lg' | 'en';
  answers: Record<string, string>; // step id -> answer value from the fixed option list
  spoken: Record<string, Spoken>; // step id -> what the on-device speech step returned
  mainAttempts: number;
  mainUnclear: boolean; // main problem: "unclear, clinician to ask"
  urgent: { reasons: string[]; at: string } | null; // "Tell the nurse now"
  resumeAt?: string; // where to continue after the danger screen
  status: 'in_progress' | 'done' | 'no_consent';
};

// ---------- sections (progress) ----------

export const SECTIONS = ['Start', 'Who it is for', 'Safety questions', 'About you', 'Main problem', 'Symptoms', 'Private questions', 'Check'] as const;

// ---------- steps ----------

export type StepKind = 'choice' | 'consent' | 'danger' | 'danger_pending' | 'spoken' | 'main' | 'unclear' | 'dob' | 'estimate' | 'number' | 'intro' | 'readback';

export type Step = {
  id: string;
  section: number;
  kind: StepKind;
  prompt: string;
  hint?: string;
  options?: Option[];
  private?: boolean;
  unit?: string;
  ref?: string; // question id or Figma step, shown small for the team
  danger?: { set: DangerSet; index: number };
};

type ConfigQuestion = { id: string; textEn: string; textLg: string };
const Q = Object.fromEntries((config.questions as ConfigQuestion[]).map((q) => [q.id, q]));
const text = (id: string) => Q[id]?.textEn ?? '';
export const hasLuganda = (id: string) => Boolean(Q[id]?.textLg);

const o = (value: string, label: string, extra: Partial<Option> = {}): Option => ({ value, label, ...extra });
const NOT_SURE = o('not_sure', 'Not sure', { icon: 'question', uncertain: true });
const ASK = o('ask_clinician', 'Ask clinician', { icon: 'person', uncertain: true });
const PREFER_NOT = o('prefer_not', 'Prefer not to say', { icon: 'lock', uncertain: true });
const PRIVATE_YES_NO = [...YES_NO, PREFER_NOT];

const STATIC: Record<string, Omit<Step, 'id'>> = {
  s0_language: { section: 0, kind: 'choice', prompt: text('s0_language'), options: [o('lg', 'Luganda'), o('en', 'English')], ref: 's0_language' },
  s0_consent: { section: 0, kind: 'consent', prompt: text('s0_consent'), hint: 'Nothing is asked or recorded before you say yes.', ref: 's0_consent · PR10' },
  s1_who: { section: 1, kind: 'choice', prompt: text('s1_who'), options: [o('self', 'Me', { icon: 'person' }), o('child', 'A child', { icon: 'person' })], ref: 's1_who' },
  s1_child_age: {
    section: 1,
    kind: 'choice',
    prompt: text('s1_child_age'),
    options: [o('under_2_months', 'Under 2 months'), o('2_months_to_5_years', '2 months to 5 years'), o('over_5_years', 'Over 5 years'), NOT_SURE],
    ref: 's1_child_age',
  },
  s1_pregnant: { section: 1, kind: 'choice', prompt: text('s1_pregnant'), options: YES_NO, ref: 's1_pregnant · D22' },
  // Figma, Flash call 1 step 6: "Next: Are you breastfeeding? 1 Yes · 2 No · 3 Prefer not to say"
  s1_breastfeeding: { section: 1, kind: 'choice', prompt: 'Are you breastfeeding?', options: [YES_NO[0], YES_NO[1], PREFER_NOT], ref: 'PREG-BF · D22' },
  d_pending: { section: 2, kind: 'danger_pending', prompt: ADULT_STANDING_PROMPT, ref: 's2_danger · RQ4.1' }, // standing prompt from rules/
  s3_name: { section: 3, kind: 'spoken', prompt: text('s3_name'), ref: 's3_name · HMIS 031 col 2' },
  s3_village: { section: 3, kind: 'spoken', prompt: text('s3_village'), ref: 's3_village · HMIS 031 col 3 to 5' },
  // Figma, Flash call 2 step 3
  s3_dob: { section: 3, kind: 'dob', prompt: 'Enter the date of birth: day, month, then year.', ref: 'REG-DOB · PR20' },
  // Figma, Flash call 2 step 4
  s3_age_est: { section: 3, kind: 'estimate', prompt: 'About how old?', hint: 'This age is marked “estimated” on the card.', ref: 'REG-AGE-EST · PR20' },
  s3_sex: { section: 3, kind: 'choice', prompt: text('s3_sex'), options: [o('female', 'Female'), o('male', 'Male')], ref: 's3_sex' },
  s3_next_of_kin: { section: 3, kind: 'spoken', prompt: text('s3_next_of_kin'), ref: 's3_next_of_kin · HMIS 031 col 7' },
  s3_repeat: { section: 3, kind: 'choice', prompt: text('s3_repeat'), options: YES_NO, ref: 's3_repeat · HMIS 031 col 8' },
  s3_referral: { section: 3, kind: 'choice', prompt: text('s3_referral'), options: YES_NO, ref: 's3_referral · HMIS 031 col 11' },
  s4_main: { section: 4, kind: 'main', prompt: text('s4_main'), hint: 'Speak after you tap the button. Tap again when you are done.', ref: 's4_main · PR3' },
  // Figma, Not sure step 3
  s4_unclear: { section: 4, kind: 'unclear', prompt: 'We are not sure we understood. A person at the clinic will ask you about this.', ref: 'PR6 · PR8' },
  s5_duration: { section: 5, kind: 'number', prompt: text('s5_duration'), unit: 'days', ref: 's5_duration' },
  s5_trend: { section: 5, kind: 'choice', prompt: text('s5_trend'), options: [o('better', 'Better'), o('worse', 'Worse'), o('same', 'The same'), NOT_SURE], ref: 's5_trend' },
  // Fever and TB symptom screen (Figma, Flash call 3 step 3). Only "night sweats" wording is in Figma;
  // the other three follow the card labels. Wording still to check against national TB guidance (Figma note).
  s5_fever: { section: 5, kind: 'choice', prompt: 'Do you have a fever?', options: YES_NO, ref: 'SYM-FEVER · PR21' },
  s5_cough: { section: 5, kind: 'choice', prompt: 'Do you have a cough?', options: YES_NO, ref: 'TB-1' },
  s5_night_sweats: { section: 5, kind: 'choice', prompt: 'Do you sweat a lot at night?', options: YES_NO, ref: 'TB-2' },
  s5_weight_loss: { section: 5, kind: 'choice', prompt: 'Have you been losing weight?', options: YES_NO, ref: 'TB-3' },
  // Private questions: tap only, never spoken (PR15). Figma, Flash call 3 step 4.
  s6_intro: { section: 6, kind: 'intro', prompt: 'The next questions are private. Answer only by tapping. Do not say your answer out loud.', private: true, ref: 'PR15 · D23' },
  s6_medicines: { section: 6, kind: 'choice', prompt: text('s6_medicines'), options: PRIVATE_YES_NO, private: true, ref: 's6_medicines' },
  s6_daily: { section: 6, kind: 'choice', prompt: text('s6_daily'), options: PRIVATE_YES_NO, private: true, ref: 's6_daily' },
  s6_allergies: { section: 6, kind: 'choice', prompt: text('s6_allergies'), options: PRIVATE_YES_NO, private: true, ref: 's6_allergies' },
  s6_alcohol: { section: 6, kind: 'choice', prompt: 'Do you drink alcohol?', options: PRIVATE_YES_NO, private: true, ref: 'RB-ALC' },
  s6_private: { section: 6, kind: 'choice', prompt: text('s6_private'), options: PRIVATE_YES_NO, private: true, ref: 's6_private' },
  s7_readback: { section: 7, kind: 'readback', prompt: text('s7_readback'), ref: 's7_readback' },
};

// ---------- routing ----------

export function dangerSetFor(d: Draft): DangerSetId | null {
  const a = d.answers;
  if (a.s1_who === 'child') {
    if (!a.s1_child_age) return null;
    if (a.s1_child_age === 'under_2_months') return 'newborn';
    if (a.s1_child_age === 'over_5_years') return 'adult';
    return 'child'; // 2 months to 5 years, or not sure (the longer child set)
  }
  if (a.s1_who === 'self') {
    if (!a.s3_sex) return null;
    if (a.s3_sex === 'male') return 'adult';
    if (!a.s1_pregnant) return null;
    // Not sure or ask clinician about pregnancy: ask the pregnancy set (Figma D22).
    return a.s1_pregnant === 'no' ? 'adult' : 'pregnancy';
  }
  return null;
}

export const isUnderFive = (d: Draft) => d.answers.s1_who === 'child' && ['under_2_months', '2_months_to_5_years'].includes(d.answers.s1_child_age);

// The ordered list of steps for this patient, given the answers so far.
export function path(d: Draft): string[] {
  const a = d.answers;
  const p = ['s0_language', 's0_consent'];
  if (a.s0_consent !== 'yes') return p;
  p.push('s1_who');
  if (a.s1_who === 'child') p.push('s1_child_age');
  // Prototype fix (Figma discrepancy, to reconcile): Figma asks "Are you pregnant?" before sex, so men are asked it.
  // Here sex is asked first for "Me", and pregnancy and breastfeeding only when the answer is not Male.
  if (a.s1_who === 'self') {
    p.push('s3_sex');
    if (a.s3_sex && a.s3_sex !== 'male') p.push('s1_pregnant', 's1_breastfeeding');
  }
  const setId = dangerSetFor(d);
  if (!setId) return p;
  const set = DANGER_SETS[setId];
  p.push(...set.questions.map((q) => `d_${q.id}`));
  if (set.pending) p.push('d_pending');
  p.push('s3_name', 's3_village', 's3_dob');
  if (a.s3_dob === 'unknown') p.push('s3_age_est');
  if (a.s1_who !== 'self') p.push('s3_sex'); // already asked in section 1 for "Me"
  p.push('s3_next_of_kin', 's3_repeat', 's3_referral', 's4_main');
  if (d.mainUnclear) p.push('s4_unclear');
  p.push('s5_duration', 's5_trend', 's5_fever', 's5_cough', 's5_night_sweats', 's5_weight_loss');
  // Private questions are not asked for ages 0 to 4 (Figma, Flash call 3 step 4).
  if (!isUnderFive(d)) p.push('s6_intro', 's6_medicines', 's6_daily', 's6_allergies', 's6_alcohol', 's6_private');
  p.push('s7_readback');
  return p;
}

export function getStep(id: string, d: Draft): Step | null {
  if (id.startsWith('d_') && id !== 'd_pending') {
    const setId = dangerSetFor(d);
    if (!setId) return null;
    const set = DANGER_SETS[setId];
    const index = set.questions.findIndex((q) => `d_${q.id}` === id);
    if (index < 0) return null;
    const q = set.questions[index];
    return { id, section: 2, kind: 'danger', prompt: q.question, options: YES_NO, danger: { set, index }, ref: `s2_danger · ${q.source}` };
  }
  const s = STATIC[id];
  if (!s) return null;
  const step: Step = { id, ...s };
  // Answering for a child: the same questions, said for the child.
  if (d.answers.s1_who === 'child' && step.section >= 3 && step.section <= 6) {
    step.hint = [step.hint, 'Answer for the child.'].filter(Boolean).join(' ');
  }
  if (id === 's3_sex' && d.answers.s1_who === 'self') step.section = 1;
  if (id === 's3_age_est' && dangerSetFor(d) === 'newborn') step.prompt = 'How many days old?'; // Figma REG-NEWBORN
  if (id === 'd_pending') {
    const set = DANGER_SETS[dangerSetFor(d) ?? 'adult'];
    step.danger = { set, index: set.questions.length };
  }
  return step;
}

export function nextStep(id: string, d: Draft): string {
  const p = path(d);
  const i = p.indexOf(id);
  return i >= 0 && i < p.length - 1 ? p[i + 1] : 'end';
}

export function progressOf(id: string, d: Draft) {
  const step = getStep(id, d);
  return { section: step?.section ?? 0, total: SECTIONS.length };
}

// ---------- labels for the read-back and the card ----------

const LABELS: Record<string, string> = {
  yes: 'Yes',
  no: 'No',
  not_sure: 'Not sure',
  ask_clinician: 'Ask clinician',
  prefer_not: 'Prefer not to say',
  better: 'getting better',
  worse: 'getting worse',
  same: 'staying the same',
  female: 'Female',
  male: 'Male',
};
export const answerLabel = (v: string | undefined) => (v ? (LABELS[v] ?? v) : '');

// ---------- urgent reasons, derived from the stored answers ----------

export const PENDING_NURSE_REASON = 'Asked to see the nurse now (safety questions pending validation)';
export const STALE_SUFFIX = ' (reported before answers changed)';

// Same wording the intake shows on "Tell the nurse now".
export const dangerReason = (label: string, value: string) => (value === 'yes' ? label : `${label}: ${answerLabel(value)}`);

// Every danger answer currently stored for this patient's set that raises "Tell the nurse now".
export function currentDangerReasons(d: Draft): string[] {
  const setId = dangerSetFor(d);
  if (!setId) return [];
  const set = DANGER_SETS[setId];
  const out = set.questions.filter((q) => set.urgentAnswers.includes(d.answers[`d_${q.id}`])).map((q) => dangerReason(q.label, d.answers[`d_${q.id}`]));
  if (d.answers.d_pending === 'asked_for_nurse') out.push(PENDING_NURSE_REASON);
  return out;
}

// True for a reason that came from a tapped danger answer (not from speech), so it can be re-checked.
const ALL_LABELS = Object.values(DANGER_SETS).flatMap((s) => s.questions.map((q) => q.label));
const fromDangerAnswer = (r: string) => r === PENDING_NURSE_REASON || ALL_LABELS.some((l) => r === l || r.startsWith(`${l}: `));

// Urgent reasons for the card: stored reasons plus any danger answer on file, deduped. A stored reason whose
// answer was later changed is never dropped; it is kept and marked so the clinician can ask.
export function urgentReasons(d: Draft): string[] {
  const now = currentDangerReasons(d);
  const stored = (d.urgent?.reasons ?? []).map((r) => {
    const base = r.endsWith(STALE_SUFFIX) ? r.slice(0, -STALE_SUFFIX.length) : r;
    return fromDangerAnswer(base) && !now.includes(base) ? base + STALE_SUFFIX : base;
  });
  return [...new Set([...stored, ...now])];
}

// ---------- new record ----------

export function newDraft(): Draft {
  const now = new Date().toISOString();
  return {
    id: `intake-${Date.now().toString(36)}`,
    visitCode: String(1000 + Math.floor(Math.random() * 9000)),
    startedAt: now,
    updatedAt: now,
    answers: {},
    spoken: {},
    mainAttempts: 0,
    mainUnclear: false,
    urgent: null,
    status: 'in_progress',
  };
}
