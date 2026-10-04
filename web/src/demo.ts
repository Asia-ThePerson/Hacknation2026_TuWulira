// SYNTHETIC demo data. No real patients. Names, codes and answers follow the Figma wireframes
// (Nakato A. 4821, Sample adult 7306, Sample child 5190) so the demo matches the design hub.
// Every record is rebuilt relative to "now", so a reset always gives the same four queue states.
import type { Draft } from './patient/flow.ts';
import { CARDS_KEY } from './patient/intake-store.ts';
import { DRAFTS_KEY, STAFF_KEY } from './clinic/staff-store.ts';
import { lock } from './clinic/session.ts';
import { read, write } from './store.ts';

// Bump when the stored shape changes: old browser data is then replaced, never half-read.
export const DATA_VERSION = 2;
const VERSION_KEY = 'tuwulira.version';
const DRAFT_KEY = 'tuwulira.intake.draft';

const year = new Date().getFullYear();
const ago = (min: number) => new Date(Date.now() - min * 60000).toISOString();

function draft(id: string, visitCode: string, minutesAgo: number, answers: Record<string, string>, extra: Partial<Draft> = {}): Draft {
  return {
    id,
    visitCode,
    startedAt: ago(minutesAgo),
    updatedAt: ago(minutesAgo - 4),
    lang: 'lg',
    answers: { s0_language: 'lg', s0_consent: 'yes', ...answers },
    spoken: {},
    mainAttempts: 1,
    mainUnclear: false,
    urgent: null,
    status: 'done',
    ...extra,
  };
}

export function demoCards(): Record<string, Draft> {
  const cards: Draft[] = [
    // Urgent: child, danger sign reported (Figma "Sample child, 3 y")
    draft(
      'demo-016',
      '5190',
      12,
      {
        s1_who: 'child',
        s1_child_age: '2_months_to_5_years',
        d_imci_unable_to_drink: 'yes',
        d_imci_vomits_everything: 'no',
        d_imci_convulsions: 'no',
        d_imci_lethargic_unconscious: 'no',
        s3_name: 'Sample child',
        s3_village: 'Sample village, sample parish',
        s3_dob: `${year - 3}-06-05`,
        s3_sex: 'female',
        s3_next_of_kin: 'Sample parent, 0700 000000',
        s3_repeat: 'no',
        s3_referral: 'no',
        s4_main: 'The child has fever and is coughing.',
        s5_duration: '2',
        s5_trend: 'worse',
        s5_fever: 'yes',
        s5_cough: 'yes',
        s5_night_sweats: 'no',
        s5_weight_loss: 'no',
      },
      { urgent: { reasons: ['Child not able to drink or breastfeed'], at: ago(10) }, spoken: { s4_main: { transcript: 'The child has fever and is coughing.', confidence: 0.92 } } },
    ),
    // Normal: adult woman, complete card (Figma "Nakato A., 34 y")
    draft(
      'demo-014',
      '4821',
      40,
      {
        s1_who: 'self',
        s3_sex: 'female',
        s1_pregnant: 'no',
        s1_breastfeeding: 'no',
        d_pending: 'pending',
        s3_name: 'Nakato A.',
        s3_village: 'Sample village, sample parish',
        s3_dob: `${year - 34}-03-12`,
        s3_next_of_kin: 'Sample relative, 0700 000000',
        s3_repeat: 'no',
        s3_referral: 'no',
        s4_main: 'Cough and fever. I feel weak.',
        s5_duration: '5',
        s5_trend: 'worse',
        s5_fever: 'yes',
        s5_cough: 'yes',
        s5_night_sweats: 'no',
        s5_weight_loss: 'no',
        s6_medicines: 'yes',
        s6_daily: 'no',
        s6_allergies: 'no',
        s6_alcohol: 'no',
        s6_private: 'no',
      },
      { spoken: { s4_main: { transcript: 'Cough and fever. I feel weak.', confidence: 0.92 } } },
    ),
    // Ask clinician: unclear main problem, estimated age, not-sure answers (Figma "Sample adult, about 60 y")
    draft('demo-015', '7306', 30, {
      s1_who: 'self',
      s3_sex: 'male',
      d_pending: 'pending',
      s3_name: 'Sample adult',
      s3_village: 'Sample village, sample parish',
      s3_dob: 'unknown',
      s3_age_est: '60 years',
      s3_next_of_kin: 'Sample relative, 0700 000000',
      s3_repeat: 'yes',
      s3_referral: 'yes',
      s4_main: 'unclear',
      s5_duration: 'not_sure',
      s5_trend: 'same',
      s5_fever: 'no',
      s5_cough: 'yes',
      s5_night_sweats: 'not_sure',
      s5_weight_loss: 'yes',
      s6_medicines: 'yes',
      s6_daily: 'no',
      s6_allergies: 'ask_clinician',
      s6_alcohol: 'prefer_not',
      s6_private: 'yes',
    }, { mainUnclear: true, mainAttempts: 2 }),
    // Incomplete: stopped after the name
    draft(
      'demo-017',
      '2047',
      6,
      {
        s1_who: 'self',
        s3_sex: 'female',
        s1_pregnant: 'no',
        s1_breastfeeding: 'prefer_not',
        d_pending: 'pending',
        s3_name: 'Sample woman',
      },
      { status: 'in_progress' },
    ),
  ];
  return Object.fromEntries(cards.map((c) => [c.id, c]));
}

// Clean slate. With patients: the four demo cards. Without: an empty queue.
export function resetDemo(withPatients: boolean) {
  write(DRAFT_KEY, null);
  write('tuwulira.call.draft', null); // basic-phone call in progress (src/call/)
  write(STAFF_KEY, null);
  write(DRAFTS_KEY, null);
  write(CARDS_KEY, withPatients ? demoCards() : null);
  write(VERSION_KEY, DATA_VERSION);
  lock();
}

// First visit, or data from an older build: start from the demo set instead of half-reading old records.
export function ensureFreshData() {
  if (read<number>(VERSION_KEY, 0) !== DATA_VERSION) resetDemo(true);
}
