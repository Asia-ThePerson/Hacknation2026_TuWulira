// Patient card (Figma "Full card" and "Card with unclear and estimated items").
// Reading order: who, urgent flag, main problem, reported flags, answers. Never "findings".
import { useState } from 'react';
import { TELL_THE_NURSE } from '../../../app/safety/index.ts';
import { Icon } from '../components/Icon.tsx';
import { Banner, Button, SectionLabel, Tag } from '../components/ui.tsx';
import { navigate } from '../router.ts';
import type { AnswerRow } from './card-model.ts';
import { time, useRow, type QueueRow } from './queue.ts';
import { updateStaff, type Check, type StaffRecord } from './staff-store.ts';

export function MissingCard() {
  return (
    <div className="record-empty">
      <p className="t-body-lg">This card is not on this device.</p>
      <Button variant="outline" onClick={() => navigate('/clinic')}>
        Back to queue
      </Button>
    </div>
  );
}

// ---------- patient strip ----------

export function PatientStrip({ row }: { row: QueueRow }) {
  const { card, staff } = row;
  const name = staff.clerk?.name || card.name;
  return (
    <div className={`pstrip${row.urgent ? ' is-urgent' : ''}`}>
      <div className="pstrip-main">
        <b className="pstrip-name">
          {name}
          {staff.clerk?.name && <Icon name="check" size={16} label="Spelling checked by clerk" />}
        </b>
        <span>{[card.ageText + (card.ageEstimated && card.ageText !== 'age not known' ? ' (estimated)' : ''), card.sex, card.visit].filter(Boolean).join(' · ')}</span>
      </div>
      <div className="pstrip-side">
        {row.urgent && <Tag kind="urgent">Urgent</Tag>}
        {row.state === 'closed' && <Tag kind="confirmed">Closed</Tag>}
        <span className="t-body-sm t-muted">
          Intake phone {time(card.arrivedAt)} · code {card.visitCode}
        </span>
      </div>
    </div>
  );
}

export function UrgentBanner({ row }: { row: QueueRow }) {
  if (!row.urgent) return null;
  const reasons = [...row.card.urgentReasons, ...(row.staff.urgentByStaff ? [`${row.staff.urgentByStaff.reason} (marked by staff)`] : [])];
  return (
    <Banner kind="danger" title={TELL_THE_NURSE}>
      <ul className="plain-list">
        {reasons.map((r) => (
          <li key={r}>
            <b>Danger sign reported:</b> {r}
          </li>
        ))}
      </ul>
    </Banner>
  );
}

// ---------- check a flagged item ----------

const YN = [
  ['yes', 'Yes'],
  ['no', 'No'],
] as const;

function checkOptions(r: AnswerRow): 'yesno' | 'text' | 'private' | 'pending' | 'childage' {
  if (r.check === 'pending') return 'pending';
  if (r.check === 'prefer_not') return 'private';
  if (r.key === 's1_child_age') return 'childage';
  if (r.check === 'unclear' || r.check === 'missing' || r.check === 'estimated') return 'text';
  return 'yesno';
}

function CheckEditor({ id, r, onDone }: { id: string; r: AnswerRow; onDone: () => void }) {
  const [text, setText] = useState('');
  const save = (value: string, extra?: (s: StaffRecord) => StaffRecord) => {
    updateStaff(id, 'Staff', `Checked "${r.label}": ${value}`, (s) => {
      const next = { ...s, checks: { ...s.checks, [r.key]: { value, by: 'Staff' as const, at: new Date().toISOString() } } };
      return extra ? extra(next) : next;
    });
    onDone();
  };
  const markUrgent = (reason: string) => (s: StaffRecord) => ({ ...s, urgentByStaff: { reason, by: 'Staff' as const, at: new Date().toISOString() } });
  const kind = checkOptions(r);
  const isSafety = r.key.startsWith('d_');
  return (
    <div className="check-editor">
      <p className="t-body-sm">
        <b>Ask the patient, then record what they say.</b> The patient’s original answer stays on the card.
      </p>
      {kind === 'yesno' && (
        <div className="row">
          {YN.map(([v, l]) => (
            <Button key={v} variant="outline" onClick={() => save(l, isSafety && v === 'yes' ? markUrgent(r.label) : undefined)}>
              {l}
            </Button>
          ))}
        </div>
      )}
      {kind === 'childage' && (
        <div className="row">
          {['Under 2 months', '2 months to 5 years', 'Over 5 years'].map((l) => (
            <Button key={l} variant="outline" onClick={() => save(l)}>
              {l}
            </Button>
          ))}
        </div>
      )}
      {kind === 'private' && (
        <Button variant="outline" icon="lock" onClick={() => save('Clinician will ask in private')}>
          Clinician will ask in private
        </Button>
      )}
      {kind === 'pending' && (
        <div className="stack">
          <p className="t-body-sm t-muted">Use the clinic’s own danger-sign guide. TuWulira has no validated list for this group yet.</p>
          <div className="row">
            <Button variant="outline" onClick={() => save('Asked in person: no danger sign')}>
              Asked: no danger sign
            </Button>
            <Button variant="danger" icon="alert" onClick={() => save('Asked in person: danger sign found', markUrgent('Danger sign found when asked in person'))}>
              Danger sign found
            </Button>
          </div>
        </div>
      )}
      {kind === 'text' && (
        <div className="stack">
          <label className="field-label" htmlFor={`chk-${r.key}`}>
            {r.check === 'estimated' ? 'Age, as confirmed with the patient' : r.check === 'unclear' ? 'Main problem, in the patient’s words' : r.label}
          </label>
          <input id={`chk-${r.key}`} className="text-input" value={text} onChange={(e) => setText(e.target.value)} />
          <div className="row">
            {r.check === 'estimated' && (
              <Button variant="outline" onClick={() => save('Keep as estimate')}>
                Keep as estimate
              </Button>
            )}
            <Button disabled={!text.trim()} onClick={() => save(text.trim())}>
              Save
            </Button>
          </div>
        </div>
      )}
      <Button variant="quiet" onClick={onDone}>
        Cancel
      </Button>
    </div>
  );
}

function CheckedNote({ c }: { c: Check }) {
  return (
    <span className="checked">
      <Tag kind="confirmed">Staff: {c.value}</Tag>
      <span className="t-body-sm t-muted">
        {c.by} · {time(c.at)}
      </span>
    </span>
  );
}

function AnswerList({ id, rows, staff }: { id: string; rows: AnswerRow[]; staff: StaffRecord }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <dl className="ans">
      {rows.map((r) => {
        const c = staff.checks[r.key];
        return (
          <div key={r.key} className="ans-row">
            <dt>
              {r.label}
              {r.unverified && (
                <span className="unverified" title="Not yet validated">
                  {' '}
                  *
                </span>
              )}
              {r.note && <small className="row-note">{r.note}</small>}
            </dt>
            <dd>
              {r.check ? <Tag kind="flag">{r.display}</Tag> : r.value === 'yes' && r.key.startsWith('d_') ? <Tag kind="urgent">Yes</Tag> : r.key === 's6_private' && r.value === 'yes' ? <b>{r.display}</b> : r.display}
              {c && <CheckedNote c={c} />}
              {r.check && !c && open !== r.key && (
                <Button variant="quiet" onClick={() => setOpen(r.key)}>
                  Ask and record
                </Button>
              )}
            </dd>
            {open === r.key && <CheckEditor id={id} r={r} onDone={() => setOpen(null)} />}
          </div>
        );
      })}
    </dl>
  );
}

// ---------- the card ----------

function PatientReported({ row }: { row: QueueRow }) {
  const { card, staff } = row;
  const id = row.draft.id;
  const mainCheck = staff.checks.s4_main;
  const notAskedYet = card.mainProblem === null && !card.checks.some((c) => c.key === 's4_main');
  return (
    <section className="block block-patient" aria-labelledby="pr-h">
      <header className="block-head">
        <h2 id="pr-h" className="block-title">
          <Icon name="person" size={20} /> Patient reported
        </h2>
        <p className="t-body-sm t-muted">Not findings. Take your own history.</p>
      </header>

      {!card.finished && <Banner kind="info" title="Intake not finished">The patient stopped part way, or was sent to the nurse first. Only answers given so far are shown.</Banner>}

      <div className="pcs">
        <SectionLabel>Main problem</SectionLabel>
        {card.mainProblem !== null ? (
          <>
            <p className="mainp">“{card.mainProblem}”</p>
            <details className="own-words">
              <summary>Patient’s own words (Luganda)</summary>
              <p className="t-body-sm t-muted">Original transcript shown here. Prototype: synthetic English stands in; no Luganda recording is stored.</p>
            </details>
          </>
        ) : notAskedYet ? (
          <p className="t-body-lg t-muted">Not asked yet</p>
        ) : (
          <AnswerList id={id} rows={card.checks.filter((c) => c.key === 's4_main')} staff={staff} />
        )}
        {mainCheck && card.mainProblem === null && <p className="t-body-sm t-muted">The note above was typed by staff, not transcribed.</p>}
        {card.durationTrend && <p className="subp">{card.durationTrend}</p>}
      </div>

      {card.flags.length > 0 && (
        <div className="pcs">
          <SectionLabel>Reported flags</SectionLabel>
          <div className="row">
            {card.flags.map((f) => (
              <Tag key={f} kind="reported">
                {f}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {(card.safety.length > 0 || card.safetyPending) && (
        <div className="pcs">
          <SectionLabel>Safety questions</SectionLabel>
          {card.safetyPending && !card.safety.some((s) => s.key === 'd_pending') && (
            <p className="t-body-sm flag-text">{card.safetyPending}: set pending validation. Not asked yet.</p>
          )}
          <AnswerList id={id} rows={card.safety} staff={staff} />
        </div>
      )}

      {card.answers.length > 0 && (
        <div className="pcs">
          <SectionLabel>Answers</SectionLabel>
          <AnswerList id={id} rows={card.answers} staff={staff} />
        </div>
      )}

      {card.privateAnswers.length > 0 && (
        <details className="pcs private-details">
          <summary>
            <Icon name="lock" size={18} /> Private answers · clinician only
          </summary>
          <p className="t-body-sm t-muted">Answered by tapping only. Ask in private if you need more.</p>
          <AnswerList id={id} rows={card.privateAnswers} staff={staff} />
        </details>
      )}

      <details className="pcs" open={card.registration.some((r) => r.check && !staff.checks[r.key])}>
        <summary>Registration details</summary>
        <AnswerList id={id} rows={card.registration} staff={staff} />
      </details>

      {[...card.safety, ...card.answers].some((r) => r.unverified) && (
        <p className="t-body-sm t-muted">
          * Not yet validated: safety questions with a source page still to check (rules/danger-signs.json), or symptom wording written for this
          prototype (to check against national TB guidance).
        </p>
      )}
    </section>
  );
}

const v = (x?: string, unit = '') => (x ? `${x}${unit ? ` ${unit}` : ''}` : null);

export function StaffEntered({ row }: { row: QueueRow }) {
  const { staff } = row;
  const id = row.draft.id;
  const cl = staff.clinician;
  const items: [string, string | null, string][] = [
    ['Name spelling', v(staff.clerk?.name), 'clerk'],
    ['Report type', v(staff.clerk?.reportType), 'clerk'],
    ['Referral note', v(staff.clerk?.referralNote), 'clerk'],
    ['Weight', v(staff.nurse?.weight, 'kg'), 'nurse'],
    ['Temperature', v(staff.nurse?.temperature, '°C'), 'nurse'],
    ['Height or length', v(staff.nurse?.length, 'cm'), 'nurse'],
    ['MUAC', v(staff.nurse?.muac, 'cm'), 'nurse'],
    ['Diagnoses', cl?.diagnoses?.length ? cl.diagnoses.join(', ') : null, 'clinician/diagnoses'],
    ['Treatment', v(cl?.medicine), 'clinician/treatment'],
    ['Outcome', v(cl?.outcome), 'clinician/outcome'],
  ];
  const shown = items.filter(([label, val]) => val || ['Report type', 'Weight', 'Temperature', 'Diagnoses', 'Outcome'].includes(label));
  return (
    <section className="block block-staff" aria-labelledby="se-h">
      <header className="block-head">
        <h2 id="se-h" className="block-title">
          <Icon name="lock" size={20} /> Staff and clinician entered
        </h2>
        <p className="t-body-sm t-muted">Typed by staff on this device. TuWulira suggests none of these.</p>
      </header>
      <dl className="ans">
        {shown.map(([label, val, to]) => (
          <div key={label} className="ans-row">
            <dt>{label}</dt>
            <dd>
              {val ?? <span className="t-muted">Not entered</span>}
              {row.state !== 'closed' && (
                <Button variant="quiet" onClick={() => navigate(`/clinic/card/${id}/${to}`)}>
                  {val ? 'Edit' : 'Add'}
                </Button>
              )}
            </dd>
          </div>
        ))}
      </dl>
      {staff.log.length > 0 && (
        <details className="pcs">
          <summary>Change history ({staff.log.length})</summary>
          <ol className="log">
            {[...staff.log].reverse().map((l, i) => (
              <li key={i}>
                <span className="t-muted">
                  {time(l.at)} · {l.by}
                </span>{' '}
                {l.what}
              </li>
            ))}
          </ol>
        </details>
      )}
    </section>
  );
}

export function CardOverview({ id }: { id: string }) {
  const row = useRow(id);
  if (!row) return <MissingCard />;
  const closed = row.state === 'closed';
  return (
    <div className="record">
      <div className="record-body">
        <PatientStrip row={row} />
        <UrgentBanner row={row} />
        {closed && (
          <Banner kind="info" title={`Visit closed ${time(row.staff.closedAt!)}`}>
            Saved on this device. Register and tally are not part of this prototype.
          </Banner>
        )}
        <div className="card-cols">
          <PatientReported row={row} />
          <StaffEntered row={row} />
        </div>
      </div>
      {!closed && (
        <div className="record-actions">
          <Button variant="outline" onClick={() => navigate(`/clinic/card/${id}/clerk`)}>
            Clerk check
          </Button>
          <Button variant="outline" onClick={() => navigate(`/clinic/card/${id}/nurse`)}>
            Enter measurements
          </Button>
          <Button onClick={() => navigate(`/clinic/card/${id}/clinician`)}>Start consultation</Button>
        </div>
      )}
    </div>
  );
}

