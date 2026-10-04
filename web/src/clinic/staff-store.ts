// Staff and clinician entries, kept apart from the patient's answers so the original stays as reported.
// Keyed by intake id. Lives on the clinic device (localStorage in the prototype).
import { read, useStored, write } from '../store.ts';

export const STAFF_KEY = 'tuwulira.staff';

export type Role = 'Clerk' | 'Nurse' | 'Clinician' | 'Staff';

export type Check = { value: string; note?: string; by: Role; at: string }; // a person asked or confirmed a flagged item

export type StaffRecord = {
  checks: Record<string, Check>; // key: the patient-reported row it answers
  urgentByStaff?: { reason: string; by: Role; at: string };
  clerk?: { name?: string; reportType?: string; referralNote?: string; savedAt: string };
  nurse?: { weight?: string; temperature?: string; length?: string; muac?: string; malnutrition?: string; savedAt: string };
  clinician?: {
    history?: string;
    diagnoses?: string[];
    malariaTest?: string;
    malariaResult?: string;
    malariaTreated?: boolean;
    presumptiveTb?: boolean;
    medicine?: string;
    units?: string;
    doses?: string;
    days?: string;
    referralOut?: string;
    outcome?: string;
    sensitive?: string[];
    savedAt: string;
  };
  closedAt?: string;
  log: { at: string; by: Role; what: string }[]; // who changed what, newest last
};

const empty = (): StaffRecord => ({ checks: {}, log: [] });

export const useStaff = () => useStored<Record<string, StaffRecord>>(STAFF_KEY, {});

export function staffFor(all: Record<string, StaffRecord>, id: string): StaffRecord {
  return all[id] ?? empty();
}

export function updateStaff(id: string, by: Role, what: string, fn: (r: StaffRecord) => StaffRecord) {
  const all = read<Record<string, StaffRecord>>(STAFF_KEY, {});
  const next = fn(all[id] ?? empty());
  write(STAFF_KEY, { ...all, [id]: { ...next, log: [...next.log, { at: new Date().toISOString(), by, what }] } });
}
