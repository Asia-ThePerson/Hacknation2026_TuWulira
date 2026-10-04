// Turns a stored intake (patient side) into what the clinic card shows. Read-only: the patient's
// answers are never changed here. Staff corrections live separately in staff-store.ts.
import { DANGER_SETS } from '../patient/danger-sets.ts';
import { answerLabel, dangerSetFor, isUnderFive, urgentReasons, type Draft } from '../patient/flow.ts';

export type CheckKind = 'not_sure' | 'ask' | 'unclear' | 'estimated' | 'pending' | 'prefer_not' | 'missing';

export type AnswerRow = {
  key: string; // the intake step id
  label: string;
  value: string; // raw value from the fixed list
  display: string;
  check?: CheckKind; // needs a person to ask or confirm
  private?: boolean;
  unverified?: boolean; // wording or source not yet validated
  note?: string; // e.g. "pending page check" for rules with status verify_page
};

export type CardModel = {
  id: string;
  visitCode: string;
  arrivedAt: string;
  finished: boolean;
  name: string;
  ageText: string;
  ageEstimated: boolean;
  underFive: boolean;
  sex: string;
  visit: string;
  urgentReasons: string[];
  mainProblem: string | null; // null = unclear, clinician to ask
  durationTrend: string;
  flags: string[]; // "Fever reported", "TB symptoms reported: clinician to assess"
  safety: AnswerRow[];
  safetyPending: string | null; // name of the danger-sign set still pending validation
  answers: AnswerRow[]; // symptoms and medicine
  privateAnswers: AnswerRow[]; // shown collapsed, clinician only
  wantsPrivate: boolean;
  registration: AnswerRow[];
  checks: AnswerRow[]; // every row that needs a person to ask or confirm
};

const UNCERTAIN: Record<string, CheckKind> = { not_sure: 'not_sure', ask_clinician: 'ask', prefer_not: 'prefer_not' };

function row(d: Draft, key: string, label: string, extra: Partial<AnswerRow> = {}): AnswerRow | null {
  const value = d.answers[key];
  if (value === undefined) return null;
  return { key, label, value, display: answerLabel(value), check: UNCERTAIN[value], ...extra };
}

export function ageOf(d: Draft): { text: string; estimated: boolean } {
  const dob = d.answers.s3_dob;
  if (dob && dob !== 'unknown') {
    const born = new Date(dob);
    const now = new Date(d.startedAt || Date.now());
    const days = Math.floor((now.getTime() - born.getTime()) / 86400000);
    if (days < 60) return { text: `${days} d`, estimated: false };
    const months = (now.getFullYear() - born.getFullYear()) * 12 + now.getMonth() - born.getMonth() - (now.getDate() < born.getDate() ? 1 : 0);
    if (months < 24) return { text: `${months} mo`, estimated: false };
    return { text: `${Math.floor(months / 12)} y`, estimated: false };
  }
  const est = d.answers.s3_age_est;
  if (est && est !== 'not_sure') {
    const [n, unit] = est.split(' ');
    return { text: `about ${n} ${unit === 'years' ? 'y' : unit === 'months' ? 'mo' : 'd'}`, estimated: true };
  }
  return { text: 'age not known', estimated: true };
}

const WHO_LABEL: Record<string, string> = { under_2_months: 'under 2 months', '2_months_to_5_years': '2 months to 5 years', over_5_years: 'over 5 years' };

export function cardModel(d: Draft): CardModel {
  const a = d.answers;
  const age = ageOf(d);
  const setId = dangerSetFor(d);
  const set = setId ? DANGER_SETS[setId] : null;

  const safety: AnswerRow[] = (set?.questions ?? [])
    .map((q) => row(d, `d_${q.id}`, q.label, { unverified: !q.verified, note: q.status === 'verify_page' ? 'pending page check' : undefined }))
    .filter((r): r is AnswerRow => r !== null);
  const safetyPending = set?.pending ? set.name : null;
  if (safetyPending && a.d_pending) {
    safety.push({
      key: 'd_pending',
      label: `${set!.name} safety questions`,
      value: a.d_pending,
      display: a.d_pending === 'asked_for_nurse' ? 'Asked for the nurse now' : 'Not asked: set pending validation',
      check: 'pending',
      unverified: true,
    });
  }

  const sym = (k: string) => a[k] === 'yes';
  const flags: string[] = [];
  if (sym('s5_fever')) flags.push('Fever reported');
  if (['s5_cough', 's5_night_sweats', 's5_weight_loss', 's5_fever'].some(sym)) flags.push('TB symptoms reported: clinician to assess');

  const answers = [
    row(d, 's5_fever', 'Fever', { unverified: true }),
    row(d, 's5_cough', 'Cough', { unverified: true }),
    row(d, 's5_night_sweats', 'Night sweats'),
    row(d, 's5_weight_loss', 'Weight loss', { unverified: true }),
    row(d, 's6_medicines', 'Medicine taken'),
    row(d, 's6_daily', 'Medicine every day'),
    row(d, 's6_allergies', 'Allergies'),
  ].filter((r): r is AnswerRow => r !== null);

  const privateAnswers = [row(d, 's6_alcohol', 'Alcohol', { private: true })].filter((r): r is AnswerRow => r !== null);
  const wantsPrivate = a.s6_private === 'yes';
  const privateRow = row(d, 's6_private', 'Private matter', { private: true });
  if (privateRow) {
    privateRow.display = a.s6_private === 'yes' ? 'Wants to talk alone' : privateRow.display;
    answers.push(privateRow);
  }

  const registration = [
    a.s3_name !== undefined ? { key: 's3_name', label: 'Name (spoken)', value: a.s3_name, display: a.s3_name === 'ask_clinician' ? 'Not caught' : a.s3_name, check: a.s3_name === 'ask_clinician' ? ('missing' as const) : undefined } : null,
    { key: 'age', label: 'Age', value: age.text, display: age.text, check: age.estimated ? ('estimated' as const) : undefined },
    row(d, 's3_sex', 'Sex'),
    a.s1_who === 'child' ? { key: 's1_child_age', label: 'Visit for', value: a.s1_child_age, display: `A child, ${WHO_LABEL[a.s1_child_age] ?? answerLabel(a.s1_child_age)}`, check: UNCERTAIN[a.s1_child_age] } : null,
    row(d, 's1_pregnant', 'Pregnant'),
    row(d, 's1_breastfeeding', 'Breastfeeding'),
    a.s3_village !== undefined ? { key: 's3_village', label: 'Village, parish', value: a.s3_village, display: a.s3_village === 'ask_clinician' ? 'Not caught' : a.s3_village, check: a.s3_village === 'ask_clinician' ? ('missing' as const) : undefined } : null,
    a.s3_next_of_kin !== undefined ? { key: 's3_next_of_kin', label: 'Next of kin', value: a.s3_next_of_kin, display: a.s3_next_of_kin === 'ask_clinician' ? 'Not caught' : a.s3_next_of_kin, check: a.s3_next_of_kin === 'ask_clinician' ? ('missing' as const) : undefined } : null,
    row(d, 's3_repeat', 'Been before for this'),
    row(d, 's3_referral', 'Referred in'),
  ].filter((r): r is AnswerRow => r != null && r.value !== undefined);

  const unclear = d.mainUnclear || a.s4_main === 'unclear';
  const mainRow: AnswerRow | null = unclear ? { key: 's4_main', label: 'Main problem', value: 'unclear', display: 'Unclear, clinician to ask', check: 'unclear' } : null;

  const trend = a.s5_trend && a.s5_trend !== 'not_sure' ? answerLabel(a.s5_trend) : a.s5_trend ? 'trend not sure' : '';
  const days = a.s5_duration ? (a.s5_duration === 'not_sure' ? 'days not sure' : `${a.s5_duration} day${a.s5_duration === '1' ? '' : 's'}`) : '';

  const all = [...(mainRow ? [mainRow] : []), ...safety, ...answers, ...privateAnswers, ...registration];
  return {
    id: d.id,
    visitCode: d.visitCode,
    arrivedAt: d.startedAt,
    finished: d.status === 'done',
    name: a.s3_name && a.s3_name !== 'ask_clinician' ? a.s3_name : a.s1_who === 'child' ? 'Child, name not given yet' : 'Name not given yet',
    ageText: age.text,
    ageEstimated: age.estimated,
    underFive: isUnderFive(d) || /\b(d|mo)\b/.test(age.text) || (/^\d+ y$/.test(age.text) && parseInt(age.text) < 5),
    sex: a.s3_sex ? answerLabel(a.s3_sex) : '',
    visit: a.s3_repeat === 'yes' ? 'Re-attendance' : a.s3_repeat === 'no' ? 'New visit' : '',
    urgentReasons: urgentReasons(d), // stored reasons plus any danger answer on file, so none is missed
    mainProblem: unclear ? null : (d.spoken.s4_main?.transcript ?? a.s4_main ?? null),
    durationTrend: [days, trend].filter(Boolean).join(' · '),
    flags,
    safety,
    safetyPending,
    answers,
    privateAnswers,
    wantsPrivate,
    registration,
    checks: all.filter((r) => r.check),
  };
}
