// Clinic device (staff mode): PIN, queue, card and staff screens. Tablet shows queue and record side by side.
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Icon, type IconName } from '../components/Icon.tsx';
import { AppBar, Button, Chip, Tag } from '../components/ui.tsx';
import { navigate } from '../router.ts';
import { CardOverview } from './CardView.tsx';
import { useQueue, time, type QueueRow, type RowState } from './queue.ts';
import { lock, unlock, useUnlocked } from './session.ts';
import { ClerkScreen, ClinicianScreen, NurseScreen, WalkIn } from './StaffScreens.tsx';

export type ClinicView = { cardId?: string; screen?: 'overview' | 'clerk' | 'nurse' | 'clinician' | 'walk-in'; tab?: string };

export function ClinicPage({ view }: { view: ClinicView }) {
  const unlocked = useUnlocked();
  if (!unlocked) return <PinScreen />;
  const role = view.screen === 'clerk' ? 'Clerk' : view.screen === 'nurse' ? 'Triage nurse' : view.screen === 'clinician' ? 'Clinician' : 'All staff';
  const hasRecord = Boolean(view.cardId) || view.screen === 'walk-in';
  return (
    <div className="page page-wide clinic">
      <AppBar
        eyebrow="Clinic device · staff mode"
        title={role}
        onBack={hasRecord ? () => navigate(view.screen && view.screen !== 'overview' && view.cardId ? `/clinic/card/${view.cardId}` : '/clinic') : () => navigate('/')}
        meta={
          <button type="button" className="lock-btn" onClick={lock}>
            <Icon name="lock" size={18} /> Lock
          </button>
        }
      />
      <div className={`clinic-split${hasRecord ? ' has-record' : ''}`}>
        <aside className="pane-queue" aria-label="Queue">
          <QueuePane activeId={view.cardId} />
        </aside>
        <main className="pane-record">{hasRecord ? <Record view={view} /> : <EmptyRecord />}</main>
      </div>
    </div>
  );
}

function Record({ view }: { view: ClinicView }) {
  if (view.screen === 'walk-in') return <WalkIn />;
  const id = view.cardId!;
  if (view.screen === 'clerk') return <ClerkScreen key={id} id={id} />;
  if (view.screen === 'nurse') return <NurseScreen key={id} id={id} />;
  if (view.screen === 'clinician') return <ClinicianScreen key={id} id={id} tab={view.tab} />;
  return <CardOverview key={id} id={id} />;
}

function EmptyRecord() {
  return (
    <div className="record-empty">
      <Icon name="person" size={40} />
      <p className="t-body-lg">Choose a patient from the queue.</p>
    </div>
  );
}

// ---------- PIN ----------

function PinScreen() {
  const [digits, setDigits] = useState('');
  useEffect(() => {
    if (digits.length === 4) {
      const t = window.setTimeout(unlock, 150);
      return () => window.clearTimeout(t);
    }
  }, [digits]);
  const press = (k: string) => setDigits((d) => (k === 'del' ? d.slice(0, -1) : d.length < 4 ? d + k : d));
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (/^\d$/.test(e.key)) press(e.key);
      if (e.key === 'Backspace') press('del');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  return (
    <div className="page">
      <AppBar eyebrow="Clinic device" title="Staff sign-in" onBack={() => navigate('/')} />
      <main className="page-body pin-wrap">
        <h2 className="t-title">Enter staff PIN</h2>
        <div className="pin-dots" role="img" aria-label={`${digits.length} of 4 digits entered`}>
          {[0, 1, 2, 3].map((i) => (
            <i key={i} className={i < digits.length ? 'on' : undefined} />
          ))}
        </div>
        <div className="pin-pad">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((k, i) =>
            k ? (
              <button key={i} type="button" className="pin-key" onClick={() => press(k)} aria-label={k === 'del' ? 'Delete last digit' : k}>
                {k === 'del' ? <Icon name="x" size={24} /> : k}
              </button>
            ) : (
              <span key={i} />
            ),
          )}
        </div>
        <p className="t-body-sm t-muted pin-hint">Enter your 4-digit PIN. It locks again after 2 minutes without use. Prototype: any four digits.</p>
      </main>
    </div>
  );
}

// ---------- Queue ----------

type Filter = 'all' | RowState;
const FILTERS: [Filter, string][] = [
  ['all', 'All'],
  ['urgent', 'Urgent'],
  ['ask', 'Ask'],
  ['incomplete', 'Not finished'],
  ['ready', 'Card ready'],
  ['closed', 'Closed'],
];

const TAG: Record<RowState, ReactNode> = {
  urgent: <Tag kind="urgent">Urgent</Tag>,
  incomplete: <Tag kind="outline">Not finished</Tag>,
  ask: <Tag kind="flag">Ask</Tag>,
  ready: <Tag kind="card">Card ready</Tag>,
  closed: <Tag kind="confirmed">Closed</Tag>,
};

function subline(r: QueueRow): string {
  const parts: string[] = [];
  if (r.urgent) {
    const reason = r.card.urgentReasons[0];
    parts.push(reason ? `Reported: ${reason}` : r.staff.urgentByStaff ? `Staff: ${r.staff.urgentByStaff.reason}` : 'Urgent');
  }
  else if (r.state === 'ask') parts.push(r.card.mainProblem === null ? 'Main problem unclear' : `${r.openChecks} to ask or confirm`);
  if (r.safetyToAsk && r.state !== 'closed') parts.push('Nurse to ask safety questions');
  parts.push(`Intake phone · code ${r.card.visitCode} · ${time(r.card.arrivedAt)}`);
  if (!r.card.finished && r.state !== 'closed') parts.push('intake not finished');
  return parts.join(' · ');
}

const ROW_ICON: Record<RowState, IconName> = { urgent: 'alert', incomplete: 'clock', ask: 'question', ready: 'person', closed: 'check' };

function QueuePane({ activeId }: { activeId?: string }) {
  const rows = useQueue();
  const [filter, setFilter] = useState<Filter>('all');
  const [code, setCode] = useState('');
  const counts = useMemo(() => Object.fromEntries(FILTERS.map(([f]) => [f, f === 'all' ? rows.length : rows.filter((r) => r.state === f).length])), [rows]);
  const shown = rows.filter((r) => (filter === 'all' || r.state === filter) && (!code || r.card.visitCode.startsWith(code)));
  return (
    <div className="queue">
      <label className="code-search">
        <span className="field-label">Find by visit code</span>
        <input className="text-input" inputMode="numeric" maxLength={4} placeholder="4 digits" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} />
      </label>
      <div className="row chip-row" role="group" aria-label="Filter the queue">
        {FILTERS.filter(([f]) => f === 'all' || counts[f] > 0 || f === filter).map(([f, label]) => (
          <Chip key={f} selected={filter === f} onClick={() => setFilter(f)}>
            {label} {counts[f]}
          </Chip>
        ))}
      </div>
      <ul className="qlist" aria-live="polite">
        {shown.map((r) => (
          <li key={r.draft.id}>
            <button
              type="button"
              className={`qrow qrow-${r.state}`}
              aria-current={r.draft.id === activeId ? 'true' : undefined}
              onClick={() => navigate(`/clinic/card/${r.draft.id}`)}
            >
              <Icon name={ROW_ICON[r.state]} size={22} />
              <span className="qtext">
                <b>
                  {r.staff.clerk?.name || r.card.name}
                  {r.card.ageText !== 'age not known' ? `, ${r.card.ageText}` : ''}
                </b>
                <small>{subline(r)}</small>
              </span>
              {TAG[r.state]}
              <Icon name="chevron" />
            </button>
          </li>
        ))}
      </ul>
      {shown.length === 0 && (
        <p className="t-body-sm t-muted qempty">{rows.length ? 'No patients match this filter.' : 'No cards yet. Cards arrive here when a patient finishes intake, or straight away if a danger sign is reported.'}</p>
      )}
      <Button variant="outline" icon="person" block onClick={() => navigate('/clinic/walk-in')}>
        Walk-in without a code
      </Button>
      <p className="sync-note">
        <Icon name="sync" size={16} /> Showing {shown.length} of {rows.length} · Saved on this device
      </p>
    </div>
  );
}
