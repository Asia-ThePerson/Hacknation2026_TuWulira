// Store-and-forward (F4) and the follow-up SMS (F5).
// ponytail: in-memory queue for the hello-world; swap for expo-sqlite so records survive a restart (PR11).

export type ConfirmedRecord = { record_id: string; fields: Record<string, string | number> };

export class SyncQueue {
  private pending = new Map<string, ConfirmedRecord>(); // keyed by record_id, so re-adding never duplicates

  add(r: ConfirmedRecord) { this.pending.set(r.record_id, r); }
  get size() { return this.pending.size; }

  // `send` returns true only when the server confirms receipt. Unconfirmed records stay queued.
  async flush(send: (r: ConfirmedRecord) => Promise<boolean>) {
    for (const [id, r] of [...this.pending]) if (await send(r)) this.pending.delete(id);
  }
}

// SMS to a shared household phone: a date and the clinic's name, nothing else (PR12, RQ5.2).
export function followUpSms(clinicName: string, nextVisitDate: string): string {
  return `${clinicName}: your next visit is ${nextVisitDate}.`;
}
