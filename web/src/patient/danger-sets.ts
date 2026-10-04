// Danger-sign question sets for the four patient groups (s1_who decides which one, Figma "Who is the visit for?").
// Everything comes from rules/danger-signs.json via app/safety/danger-signs.ts (docs/product/danger-signs.md):
// wording, source, status and the pregnancy "not sure counts as yes" rule. Nothing here invents a sign.
// Disabled signs are never loaded. A group with no loaded signs (adults, for now) is `pending`: the intake
// shows the standing prompt and the card tells the nurse to ask in person. The step is never skipped.
import { ADULT_STANDING_PROMPT, DANGER_SIGNS, type DangerStatus } from '../../../app/safety/danger-signs.ts';

export type DangerSetId = 'newborn' | 'child' | 'pregnancy' | 'adult';

export type DangerQuestion = {
  id: string;
  question: string; // what the patient sees
  label: string; // what the card shows, "patient reported"
  source: string;
  status: DangerStatus; // cited, or verify_page ("pending page check")
  verified: boolean;
};

export type DangerSet = {
  id: DangerSetId;
  name: string;
  questions: DangerQuestion[];
  pending: boolean; // no sourced, enabled signs for this group yet
  pendingSource: string; // where the missing signs must come from
  urgentAnswers: string[]; // answers that raise "Tell the nurse now"
};

export { ADULT_STANDING_PROMPT };

function build(id: DangerSetId, name: string, pendingSource: string): DangerSet {
  const signs = DANGER_SIGNS.filter((s) => s.set === id);
  const notSureIsYes = signs.some((s) => s.notSureIsYes);
  return {
    id,
    name,
    questions: signs.map((s) => ({ id: s.id, question: s.question, label: s.label, source: s.source, status: s.status, verified: s.verified })),
    pending: signs.length === 0,
    pendingSource,
    // Pregnancy: Not sure counts as yes (rules), and so does Ask clinician (Figma paper form, D22).
    urgentAnswers: notSureIsYes ? ['yes', 'not_sure', 'ask_clinician'] : ['yes'],
  };
}

export const DANGER_SETS: Record<DangerSetId, DangerSet> = {
  newborn: build('newborn', 'Baby under 2 months', 'WHO IMCI young infant module'),
  child: build('child', 'Child 2 months to 5 years', 'WHO IMCI general danger signs'),
  pregnancy: build('pregnancy', 'Pregnant woman', 'WHO PCPNC danger signs'),
  adult: build('adult', 'Adult', 'Uganda Clinical Guidelines 2023, Chapter 1, or WHO Basic Emergency Care'),
};

export const PENDING_PAGE_CHECK = 'pending page check';
