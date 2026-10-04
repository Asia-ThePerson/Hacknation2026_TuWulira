// Staff screens from Figma: Clerk, Nurse, Clinician (five tabs plus review), Walk-in without a code.
// Every value here is typed by a person. TuWulira suggests none of them (no diagnosis, no prescription).
import { useState, type ReactNode } from 'react';
import { fieldByName } from '../../../app/shared/field-schemas.ts';
import hmis from '../../../config/hmis105-diagnoses.json';
import { AnswerButtons } from '../components/AnswerButtons.tsx';
import { Icon } from '../components/Icon.tsx';
import { NumberField, numberProblem } from '../components/NumberField.tsx';
import { Banner, Button, SectionLabel } from '../components/ui.tsx';
import { navigate } from '../router.ts';
import { MissingCard, PatientStrip, UrgentBanner } from './CardView.tsx';
import { time, useRow } from './queue.ts';
import { lock } from './session.ts';
import { clearFormDraft, updateStaff, useFormDraft, type Role, type StaffRecord } from './staff-store.ts';

const range = (name: string) => {
  const f = fieldByName(name);
  return f && f.kind === 'number' ? { min: f.min, max: f.max } : {};
};
const numOk = (v: string | undefined, r: { min?: number; max?: number }) => numberProblem(v, r.min, r.max) === null;

// Shown when a form was refilled from what staff typed before but did not save.
function DraftNote({ show }: { show: boolean }) {
  return show ? <p className="t-body-sm t-muted">Unsaved changes from before are filled in. Not saved yet.</p> : null;
}

function Screen({ id, title, children, actions }: { id: string; title: string; children: ReactNode; actions: ReactNode }) {
  const row = useRow(id);
  if (!row) return <MissingCard />;
  return (
    <div className="record">
      <div className="record-body">
        <PatientStrip row={row} />
        <h2 className="t-title">{title}</h2>
        {children}
      </div>
      <div className="record-actions">{actions}</div>
    </div>
  );
}

function Saved({ at, by }: { at?: string; by: Role }) {
  if (!at) return null;
  return (
    <p className="saved-line">
      <Icon name="check" size={18} /> Saved on this device by {by} at {time(at)}
    </p>
  );
}

const seg = (values: string[]) => values.map((v) => ({ value: v, label: v }));

// ---------- Clerk ----------

export function ClerkScreen({ id }: { id: string }) {
  const row = useRow(id);
  const clerk = row?.staff.clerk;
  const heard = row?.draft.answers.s3_name;
  const [form, setForm, restored] = useFormDraft(id, 'clerk', () => ({
    name: clerk?.name ?? (heard && heard !== 'ask_clinician' ? heard : ''),
    reportType: clerk?.reportType,
    note: clerk?.referralNote ?? '',
  }));
  const { name, reportType, note } = form;
  const setName = (name: string) => setForm((x) => ({ ...x, name }));
  const setReportType = (reportType: string) => setForm((x) => ({ ...x, reportType }));
  const setNote = (note: string) => setForm((x) => ({ ...x, note }));
  if (!row) return <MissingCard />;
  const referred = row.draft.answers.s3_referral === 'yes';
  const save = () => {
    updateStaff(id, 'Clerk', 'Saved name, report type and referral note', (s) => ({
      ...s,
      clerk: { name: name.trim() || undefined, reportType, referralNote: note.trim() || undefined, savedAt: new Date().toISOString() },
    }));
    clearFormDraft(id, 'clerk');
    navigate(`/clinic/card/${id}`);
  };
  return (
    <Screen id={id} title="Clerk check" actions={<Button onClick={save}>Save and back to card</Button>}>
      <section className="stack">
        <SectionLabel n={1}>Name</SectionLabel>
        <p className="reported">
          Patient reported (spoken): <b>“{heard && heard !== 'ask_clinician' ? heard : 'not caught'}”</b>
        </p>
        <label className="field-label" htmlFor="clerk-name">
          Spelling
        </label>
        <input id="clerk-name" className="text-input" value={name} onChange={(e) => setName(e.target.value)} />
        <p className="t-body-sm t-muted">Confirm with the patient. The spoken answer stays on the card.</p>
      </section>
      <section className="stack">
        <SectionLabel n={2}>
          Report type <span className="req">Required</span>
        </SectionLabel>
        <p className="t-body-sm t-muted">Entered by the clerk only. The patient is never asked about origin or status.</p>
        <AnswerButtons name="Report type" options={seg(['National', 'Refugee', 'Foreigner'])} value={reportType} onChange={setReportType} compact />
      </section>
      {referred && (
        <section className="stack">
          <SectionLabel n={3}>Referral note number</SectionLabel>
          <p className="reported">Patient reported: sent here by a health worker</p>
          <input className="text-input" aria-label="Referral note number" value={note} onChange={(e) => setNote(e.target.value)} />
        </section>
      )}
      <DraftNote show={restored} />
      <Saved at={clerk?.savedAt} by="Clerk" />
    </Screen>
  );
}

// ---------- Nurse ----------

export function NurseScreen({ id }: { id: string }) {
  const row = useRow(id);
  const n = row?.staff.nurse;
  const [form, setForm, restored] = useFormDraft(id, 'nurse', () => ({ weight: n?.weight ?? '', temperature: n?.temperature ?? '', length: n?.length ?? '', muac: n?.muac ?? '' }));
  const { weight, temperature, length, muac } = form;
  const setWeight = (weight: string) => setForm((x) => ({ ...x, weight }));
  const setTemperature = (temperature: string) => setForm((x) => ({ ...x, temperature }));
  const setLength = (length: string) => setForm((x) => ({ ...x, length }));
  const setMuac = (muac: string) => setForm((x) => ({ ...x, muac }));
  if (!row) return <MissingCard />;
  const wR = range('weight_kg');
  const tR = range('temperature_c');
  const ok = numOk(weight, wR) && numOk(temperature, tR) && numOk(length, {}) && numOk(muac, {});
  const save = () => {
    updateStaff(id, 'Nurse', `Saved measurements${weight ? ` · weight ${weight} kg` : ''}${temperature ? ` · temperature ${temperature} °C` : ''}`, (s) => ({
      ...s,
      nurse: { weight: weight || undefined, temperature: temperature || undefined, length: length || undefined, muac: muac || undefined, savedAt: new Date().toISOString() },
    }));
    clearFormDraft(id, 'nurse');
    navigate(`/clinic/card/${id}`);
  };
  return (
    <Screen
      id={id}
      title="Measurements"
      actions={
        <Button disabled={!ok} onClick={save}>
          {ok ? 'Save and back to card' : 'Check the flagged value to save'}
        </Button>
      }
    >
      <UrgentBanner row={row} />
      <div className="nf-grid">
        <NumberField label="Weight" unit="kg" {...wR} value={weight} onChange={setWeight} />
        <NumberField label="Temperature" unit="°C" {...tR} value={temperature} onChange={setTemperature} />
      </div>
      {row.card.underFive && (
        <section className="stack">
          <SectionLabel>Under-5 measures</SectionLabel>
          <div className="nf-grid">
            <NumberField label="Height or length" unit="cm" value={length} onChange={setLength} />
            <NumberField label="MUAC" unit="cm" value={muac} onChange={setMuac} />
          </div>
          <label className="field-label" htmlFor="mcat">
            Malnutrition category
          </label>
          <select id="mcat" className="text-input" defaultValue="">
            <option value="">Select, nurse decides</option>
            <option disabled>Categories from the national guideline (to add)</option>
          </select>
          <p className="t-body-sm t-muted">TuWulira records the measurement only. It never suggests a category.</p>
        </section>
      )}
      <DraftNote show={restored} />
      <Saved at={n?.savedAt} by="Nurse" />
    </Screen>
  );
}

// ---------- Clinician ----------

const TABS = [
  ['card', 'Card'],
  ['diagnoses', 'Diagnoses'],
  ['malaria', 'Malaria'],
  ['treatment', 'Treatment'],
  ['outcome', 'Outcome'],
  ['review', 'Review'],
] as const;
type Tab = (typeof TABS)[number][0];

type DxItem = { code: string; label: string; pickable?: boolean };
type DxSection = { section: string; name: string; items: DxItem[] };
const DX = (hmis.diagnoses as DxSection[]).map((s) => ({ ...s, items: s.items.filter((i) => i.pickable !== false) }));
const DX_LABEL = Object.fromEntries(DX.flatMap((s) => s.items.map((i) => [i.code, i.label])));
const OUTCOMES = ['Went home', 'Referred out', 'Admitted', 'Died'];
const SENSITIVE = ['Gender-based violence rows (CD05, MH02, IN03, MC01)', 'Attempted self-harm (NE21)'];

type ClinicianForm = NonNullable<StaffRecord['clinician']>;

export function ClinicianScreen({ id, tab: tabParam }: { id: string; tab?: string }) {
  const row = useRow(id);
  const tab: Tab = (TABS.find(([t]) => t === tabParam)?.[0] ?? 'card') as Tab;
  const [f, setF, restored] = useFormDraft<ClinicianForm>(id, 'clinician', () => row?.staff.clinician ?? { savedAt: '' });
  const [q, setQ] = useState('');
  if (!row) return <MissingCard />;
  const set = (patch: Partial<ClinicianForm>) => setF((x) => ({ ...x, ...patch }));
  const closed = row.state === 'closed';
  const i = TABS.findIndex(([t]) => t === tab);

  // Units, doses and days: a bad number is refused, never guessed. It stays in the unsaved draft until fixed.
  const numbersOk = [f.units, f.doses, f.days].every((x) => numOk(x, {}));
  const persist = () => {
    updateStaff(id, 'Clinician', `Saved ${TABS[i][1].toLowerCase()}`, (s) => ({ ...s, clinician: { ...f, savedAt: new Date().toISOString() } }));
    clearFormDraft(id, 'clinician');
  };
  const go = (t: Tab) => {
    if (!closed && numbersOk) persist();
    navigate(`/clinic/card/${id}/clinician/${t}`);
  };

  const dx = f.diagnoses ?? [];
  const malariaDx = dx.some((c) => c.startsWith('EP01'));
  const feverReported = row.card.flags.includes('Fever reported');
  const total = [f.units, f.doses, f.days].every((x) => x && !Number.isNaN(Number(x))) ? Number(f.units) * Number(f.doses) * Number(f.days) : null;
  const missing = [
    !row.staff.clerk?.reportType && ['Report type (clerk)', `/clinic/card/${id}/clerk`],
    !dx.length && ['At least one diagnosis', `/clinic/card/${id}/clinician/diagnoses`],
    !f.outcome && ['Visit outcome', `/clinic/card/${id}/clinician/outcome`],
    !numbersOk && ['Check the flagged treatment numbers', `/clinic/card/${id}/clinician/treatment`],
  ].filter(Boolean) as [string, string][];

  const close = () => {
    updateStaff(id, 'Clinician', 'Closed the visit', (s) => ({ ...s, clinician: { ...f, savedAt: new Date().toISOString() }, closedAt: new Date().toISOString() }));
    clearFormDraft(id, 'clinician');
  };

  const next = i < TABS.length - 1 ? TABS[i + 1] : null;
  const actions = closed ? (
    <Button onClick={() => navigate('/clinic')}>Next patient</Button>
  ) : tab === 'review' ? (
    <>
      <Button variant="outline" onClick={() => go('diagnoses')}>
        Edit answers
      </Button>
      <Button disabled={missing.length > 0} onClick={close}>
        Close visit
      </Button>
    </>
  ) : (
    <Button disabled={!numbersOk} onClick={() => go(next![0])}>
      {!numbersOk ? 'Check the flagged value to go on' : next![0] === 'review' ? 'Review and close' : `Next: ${next![1]}`}
    </Button>
  );

  return (
    <Screen id={id} title="Consultation" actions={actions}>
      <nav className="tabs" aria-label="Record sections">
        {TABS.map(([t, label], j) => (
          <button key={t} type="button" aria-current={t === tab ? 'step' : undefined} className={j < i ? 'tab-done' : undefined} onClick={() => go(t)}>
            {j < i && <Icon name="check" size={16} />}
            {label}
          </button>
        ))}
      </nav>
      <DraftNote show={restored && !closed} />

      {tab === 'card' && (
        <>
          <div className="mini">
            <p className="section-label">Patient reported</p>
            <p className="t-body-lg">
              <b>{row.card.mainProblem ?? 'Main problem unclear, clinician to ask'}</b>
              {row.card.durationTrend && ` · ${row.card.durationTrend}`}
            </p>
            <div className="row">
              {row.card.flags.map((fl) => (
                <span key={fl} className="tag tag-reported">
                  {fl}
                </span>
              ))}
              {row.card.wantsPrivate && <span className="tag tag-outline">Wants to talk alone</span>}
            </div>
            <Button variant="quiet" onClick={() => navigate(`/clinic/card/${id}`)}>
              Open full card
            </Button>
          </div>
          <label className="field-label" htmlFor="hist">
            Your history and examination
          </label>
          <textarea id="hist" className="text-input textarea" rows={5} placeholder="Your own questions and findings" value={f.history ?? ''} onChange={(e) => set({ history: e.target.value })} disabled={closed} />
        </>
      )}

      {tab === 'diagnoses' && (
        <>
          <label className="search">
            <Icon name="search" size={18} />
            <input placeholder="Search diagnoses or codes" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search diagnoses or codes" />
          </label>
          <p className="t-body-sm">
            <b>{dx.length} selected</b> · {dx.length} register line{dx.length === 1 ? '' : 's'} · HMIS 105 section 1.3, print version September 2019
          </p>
          <div className="dx-list">
            {DX.map((s) => {
              const items = s.items.filter((it) => !q || `${it.code} ${it.label}`.toLowerCase().includes(q.toLowerCase()));
              if (!items.length) return null;
              return (
                <div key={s.section}>
                  <p className="section-label">
                    {s.section} {s.name}
                  </p>
                  {items.map((it) => (
                    <label key={it.code} className="check-row">
                      <input
                        type="checkbox"
                        disabled={closed}
                        checked={dx.includes(it.code)}
                        onChange={(e) => set({ diagnoses: e.target.checked ? [...dx, it.code] : dx.filter((c) => c !== it.code) })}
                      />
                      <code>{it.code}</code>
                      <span>{it.label}</span>
                    </label>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'malaria' &&
        (feverReported || malariaDx ? (
          <>
            <p className="reported">
              {[feverReported && 'Fever reported', malariaDx && 'Malaria diagnosis ticked'].filter(Boolean).join(' · ')}
            </p>
            <SectionLabel>Test done</SectionLabel>
            <AnswerButtons name="Test done" options={seg(['RDT', 'Blood slide', 'None'])} value={f.malariaTest} onChange={(v) => set({ malariaTest: v })} compact />
            <SectionLabel>Result</SectionLabel>
            <AnswerButtons name="Result" options={seg(['Positive', 'Negative'])} value={f.malariaResult} onChange={(v) => set({ malariaResult: v })} compact />
            <label className="check-row big">
              <input type="checkbox" checked={Boolean(f.malariaTreated)} onChange={(e) => set({ malariaTreated: e.target.checked })} disabled={closed} />
              <span>Treated for malaria</span>
            </label>
          </>
        ) : (
          <Banner kind="info" title="Not needed for this patient">
            Shown when fever is reported or a malaria diagnosis is ticked.
          </Banner>
        ))}

      {tab === 'treatment' && (
        <>
          <label className="check-row big">
            <input type="checkbox" checked={Boolean(f.presumptiveTb)} onChange={(e) => set({ presumptiveTb: e.target.checked })} disabled={closed} />
            <span>
              Presumptive TB
              <small>Your decision. The intake flag only says symptoms were reported.</small>
            </span>
          </label>
          <label className="field-label" htmlFor="med">
            Medicine
          </label>
          <input id="med" className="text-input" placeholder="Type the medicine" value={f.medicine ?? ''} onChange={(e) => set({ medicine: e.target.value })} disabled={closed} />
          <div className="nf-grid three">
            <NumberField label="Units" unit="" value={f.units ?? ''} onChange={(v) => set({ units: v })} step={1} />
            <NumberField label="Doses / day" unit="" value={f.doses ?? ''} onChange={(v) => set({ doses: v })} step={1} />
            <NumberField label="Days" unit="" value={f.days ?? ''} onChange={(v) => set({ days: v })} step={1} />
          </div>
          <p className="t-body-lg">
            <b>Total: {total ?? '–'} units</b>
          </p>
          <label className="field-label" htmlFor="refout">
            Referral-out number
          </label>
          <input id="refout" className="text-input" value={f.referralOut ?? ''} onChange={(e) => set({ referralOut: e.target.value })} disabled={closed} />
          <p className="t-body-sm t-muted">Leave empty if not referred.</p>
        </>
      )}

      {tab === 'outcome' && (
        <>
          <fieldset className="radios">
            <legend className="field-label">Visit outcome</legend>
            {OUTCOMES.map((o) => (
              <label key={o} className="check-row big">
                <input type="radio" name="outcome" checked={f.outcome === o} onChange={() => set({ outcome: o })} disabled={closed} />
                <span>{o}</span>
              </label>
            ))}
          </fieldset>
          {f.outcome === 'Died' && <Banner kind="ask" title="You are recording a death (DT01).">Check it before you close the visit.</Banner>}
          <details className="pcs">
            <summary>Record a sensitive HMIS 105 row</summary>
            <p className="t-body-sm t-muted">Clinician only. TuWulira never asks the patient.</p>
            {SENSITIVE.map((sv) => (
              <label key={sv} className="check-row">
                <input
                  type="checkbox"
                  disabled={closed}
                  checked={(f.sensitive ?? []).includes(sv)}
                  onChange={(e) => set({ sensitive: e.target.checked ? [...(f.sensitive ?? []), sv] : (f.sensitive ?? []).filter((x) => x !== sv) })}
                />
                <span>{sv}</span>
              </label>
            ))}
          </details>
        </>
      )}

      {tab === 'review' &&
        (closed ? (
          <div className="visit-done">
            <span className="done-icon">
              <Icon name="check" size={36} />
            </span>
            <h3 className="t-title">Visit closed</h3>
            <ul className="status-list">
              <li>
                <Icon name="check" /> Saved on this device · {time(row.staff.closedAt!)}
              </li>
              <li>
                <Icon name="clock" /> Register and tally are not part of this prototype
              </li>
            </ul>
          </div>
        ) : (
          <>
            <h3 className="t-title">Review before closing</h3>
            <dl className="ans">
              <div className="ans-row">
                <dt>Diagnoses</dt>
                <dd>{dx.length ? dx.map((c) => `${c} ${DX_LABEL[c] ?? ''}`).join('; ') : '–'}</dd>
              </div>
              <div className="ans-row">
                <dt>Malaria</dt>
                <dd>{[f.malariaTest, f.malariaResult, f.malariaTreated && 'Treated'].filter(Boolean).join(' · ') || '–'}</dd>
              </div>
              <div className="ans-row">
                <dt>Treatment</dt>
                <dd>{[f.medicine, total !== null && `${f.units} × ${f.doses} × ${f.days} days`].filter(Boolean).join(' · ') || '–'}</dd>
              </div>
              <div className="ans-row">
                <dt>Presumptive TB</dt>
                <dd>{f.presumptiveTb ? 'Yes' : 'No'}</dd>
              </div>
              <div className="ans-row">
                <dt>Referral out</dt>
                <dd>{f.referralOut || 'None'}</dd>
              </div>
              <div className="ans-row">
                <dt>Outcome</dt>
                <dd>{f.outcome ?? '–'}</dd>
              </div>
            </dl>
            {missing.length > 0 ? (
              <Banner kind="ask" title="Needed before the visit can close">
                <ul className="plain-list">
                  {missing.map(([label, to]) => (
                    <li key={label}>
                      <button type="button" className="link" onClick={() => navigate(to)}>
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </Banner>
            ) : (
              <p className="t-body-sm t-muted">Nothing is final until you tap Close visit.</p>
            )}
          </>
        ))}
    </Screen>
  );
}

// ---------- Walk-in without a code ----------

export function WalkIn() {
  return (
    <div className="record">
      <div className="record-body">
        <h2 className="t-title">Walk-in without a code</h2>
        <p className="reported">No card on file. The patient did not give consent, or has no code.</p>
        <Button
          variant="outline"
          block
          onClick={() => {
            lock(); // the patient holds the device next: staff screens need the PIN again
            navigate('/intake');
          }}
        >
          Start in-clinic intake on this device
        </Button>
        <p className="t-body-sm t-muted">One-device mode: the intake runs here, then the card appears in this queue.</p>
      </div>
      <div className="record-actions">
        <Button onClick={() => navigate('/clinic')}>Give a paper form, back to queue</Button>
      </div>
    </div>
  );
}
