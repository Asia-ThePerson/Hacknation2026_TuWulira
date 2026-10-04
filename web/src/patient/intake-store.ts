// The intake in progress, and the hand-off of finished (or urgent) intakes to the clinic device.
// In the product the card moves by encrypted QR (D33); here both sides read the same localStorage.
import { read, useStored, write } from '../store.ts';
import { newDraft, path, urgentReasons, type Draft } from './flow.ts';

const DRAFT_KEY = 'tuwulira.intake.draft';
export const CARDS_KEY = 'tuwulira.cards';

export const useDraft = () => useStored<Draft | null>(DRAFT_KEY, null);

export function startDraft(): Draft {
  const d = newDraft();
  write(DRAFT_KEY, d);
  return d;
}

// After consent, every answer also updates the clinic copy, so staff can see a partly finished intake
// ("Not finished"). Prototype stand-in for one-device mode; in the two-device model the card moves by QR at the end.
export function updateDraft(fn: (d: Draft) => Draft) {
  const d = read<Draft | null>(DRAFT_KEY, null);
  if (!d) return;
  const next = { ...fn(d), updatedAt: new Date().toISOString() };
  write(DRAFT_KEY, next);
  if (next.answers.s0_consent === 'yes') sendToClinic(next);
}

export function clearDraft() {
  write(DRAFT_KEY, null);
}

// Patient said no: drop the draft and any clinic copy, so nothing is saved or shared.
export function discardIntake() {
  const d = read<Draft | null>(DRAFT_KEY, null);
  if (d) {
    const { [d.id]: _gone, ...rest } = read<Record<string, Draft>>(CARDS_KEY, {});
    write(CARDS_KEY, rest);
  }
  clearDraft();
}

// Answers left over from a branch the patient later changed (e.g. "Me" then "A child") are dropped,
// so the card only holds what belongs to the questions this patient was actually asked. Urgent reasons are kept.
export function cleanAnswers(d: Draft): Draft {
  const keep = new Set(path(d));
  const answers = Object.fromEntries(Object.entries(d.answers).filter(([k]) => keep.has(k)));
  const spoken = Object.fromEntries(Object.entries(d.spoken).filter(([k]) => keep.has(k)));
  const cleaned = { ...d, answers, spoken };
  // Never silently drop a danger flag: reasons whose answer changed stay, marked (see urgentReasons).
  const reasons = urgentReasons(cleaned);
  return { ...cleaned, urgent: reasons.length ? { reasons, at: d.urgent?.at ?? new Date().toISOString() } : null };
}

// Puts this intake in the clinic queue (or updates it there). Called on "Tell the nurse now" and at the end.
export function sendToClinic(d: Draft) {
  const cards = read<Record<string, Draft>>(CARDS_KEY, {});
  write(CARDS_KEY, { ...cards, [d.id]: cleanAnswers(d) });
}
