// Logic checks for the safety-critical paths. Run: npm test (Node 22.6+ strips the types).
// All inputs are SYNTHETIC.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assessTurn, ASK_A_PERSON, TELL_THE_NURSE } from './safety/index.ts';
import { extract, canSave } from './scribe/extract.ts';
import { buildIntakeCard } from './intake/intake-card.ts';
import { isAllowed } from './shared/field-schemas.ts';
import { SyncQueue, followUpSms } from './sync/queue.ts';

test('silence and low confidence go to "ask a person" (RQ4.4)', () => {
  assert.equal(assessTurn({ transcript: '', confidence: 0 }).kind, 'ask_person');
  assert.equal(assessTurn({ transcript: '   ', confidence: 0.99 }).kind, 'ask_person');
  assert.deepEqual(assessTurn({ transcript: 'mumble', confidence: 0.3 }), { kind: 'ask_person', message: ASK_A_PERSON });
});

test('danger signs win even at low confidence (PR9, D3)', () => {
  const r = assessTurn({ transcript: 'she had convulsions', confidence: 0.2 });
  assert.equal(r.kind, 'danger');
  assert.equal(r.kind === 'danger' && r.message, TELL_THE_NURSE);
});

test('extractor only outputs schema values that were said', () => {
  const d = extract('New patient female aged 34 temperature 38.5 weight 61', 0.95);
  assert.deepEqual(Object.fromEntries(d.map((x) => [x.field, x.value])), { sex: 'female', attendance: 'new', age_years: 34, temperature_c: 38.5, weight_kg: 61 });
  assert.equal(canSave(d), true);
  assert.deepEqual(extract('temperature 99', 0.95), []); // out of range: dropped, never guessed
  assert.deepEqual(extract('patient looks unwell', 0.95), []); // nothing said: nothing filled
});

test('low confidence fields are flagged and block save (PR6)', () => {
  const d = extract('male aged 50', 0.5);
  assert.ok(d.length > 0 && d.every((x) => x.flagged));
  assert.equal(canSave(d), false);
});

test('clinician-only fields can never be filled by the AI (PR7)', () => {
  for (const f of ['diagnosis', 'treatment', 'tests_and_results', 'referral_destination', 'clinician_name']) assert.equal(isAllowed(f, 'anything'), false);
});

test('intake card is "Patient reported" and drops turns it did not understand', () => {
  const c = buildIntakeCard([{ transcript: 'my head hurts', confidence: 0.9 }, { transcript: '', confidence: 0 }]);
  assert.equal(c.label, 'Patient reported');
  assert.deepEqual(c.patientWords, ['my head hurts']);
});

test('queue never duplicates and keeps unconfirmed records (RQ6.2)', async () => {
  const q = new SyncQueue();
  q.add({ record_id: 'r1', fields: {} });
  q.add({ record_id: 'r1', fields: {} });
  q.add({ record_id: 'r2', fields: {} });
  assert.equal(q.size, 2);
  await q.flush(async (r) => r.record_id === 'r1');
  assert.equal(q.size, 1);
});

test('SMS says only a date and the clinic name (PR12)', () => {
  assert.equal(followUpSms('Example Clinic', '12 Oct'), 'Example Clinic: your next visit is 12 Oct.');
});
