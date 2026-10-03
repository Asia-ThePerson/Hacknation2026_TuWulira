// Intake card (F1, PR4). Holds only what the patient said, word for word, under "Patient reported".
// No mapping to clinical terms yet: local illness terms may not map cleanly (RQ3.4).
import { assessTurn, type SafetyResult, type Turn } from '../safety/index.ts';

export const INTAKE_CARD_LABEL = 'Patient reported';

export type IntakeCard = { label: typeof INTAKE_CARD_LABEL; patientWords: string[]; safety: SafetyResult[] };

export function buildIntakeCard(turns: Turn[]): IntakeCard {
  const safety = turns.map(assessTurn);
  // Turns the tool did not understand are not added; staff are asked to step in instead.
  const patientWords = turns.filter((_, i) => safety[i].kind !== 'ask_person').map((t) => t.transcript.trim());
  return { label: INTAKE_CARD_LABEL, patientWords, safety: safety.filter((s) => s.kind !== 'ok') };
}
