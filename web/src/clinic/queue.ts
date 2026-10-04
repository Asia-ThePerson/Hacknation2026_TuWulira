// Queue rows: one per intake, urgent first, then arrival order (Figma "Queue"). Closed visits sink to the end.
import { CARDS_KEY } from '../patient/intake-store.ts';
import type { Draft } from '../patient/flow.ts';
import { useStored } from '../store.ts';
import { cardModel, type CardModel } from './card-model.ts';
import { staffFor, useStaff, type StaffRecord } from './staff-store.ts';

export type RowState = 'urgent' | 'incomplete' | 'ask' | 'ready' | 'closed';

export type QueueRow = { draft: Draft; card: CardModel; staff: StaffRecord; state: RowState; urgent: boolean; openChecks: number; safetyToAsk: boolean };

export function rowFor(draft: Draft, staff: StaffRecord): QueueRow {
  const card = cardModel(draft);
  const urgent = card.urgentReasons.length > 0 || Boolean(staff.urgentByStaff);
  const open = card.checks.filter((c) => !staff.checks[c.key]);
  // A pending safety set is a task for the nurse, not an unclear answer, so it does not make the card "Ask".
  const safetyToAsk = open.some((c) => c.check === 'pending');
  const openChecks = open.filter((c) => c.check !== 'pending').length;
  const state: RowState = staff.closedAt ? 'closed' : urgent ? 'urgent' : !card.finished ? 'incomplete' : openChecks ? 'ask' : 'ready';
  return { draft, card, staff, state, urgent, openChecks, safetyToAsk };
}

export function useQueue(): QueueRow[] {
  const cards = useStored<Record<string, Draft>>(CARDS_KEY, {});
  const staff = useStaff();
  const rank = (r: QueueRow) => (r.state === 'closed' ? 2 : r.urgent ? 0 : 1);
  return Object.values(cards)
    .map((d) => rowFor(d, staffFor(staff, d.id)))
    .sort((a, b) => rank(a) - rank(b) || a.draft.startedAt.localeCompare(b.draft.startedAt));
}

export function useRow(id: string): QueueRow | null {
  const cards = useStored<Record<string, Draft>>(CARDS_KEY, {});
  const staff = useStaff();
  const d = cards[id];
  return d ? rowFor(d, staffFor(staff, id)) : null;
}

export const time = (iso: string) => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
