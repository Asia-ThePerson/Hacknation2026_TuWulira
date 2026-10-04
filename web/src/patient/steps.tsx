// One view per step kind. Every view writes its answer to the draft, then moves on with `advance`.
import { useEffect, useRef, useState } from 'react';
import { DANGER_SIGNS } from '../../../app/safety/danger-signs.ts';
import { ASK_A_PERSON, assessTurn } from '../../../app/safety/index.ts';
import { AnswerButtons } from '../components/AnswerButtons.tsx';
import { Icon } from '../components/Icon.tsx';
import { NumberField } from '../components/NumberField.tsx';
import { Banner, Button } from '../components/ui.tsx';
import { navigate } from '../router.ts';
import { read } from '../store.ts';
import { PENDING_PAGE_CHECK } from './danger-sets.ts';
import { answerLabel, dangerReason, nextStep, PENDING_NURSE_REASON, type Draft, type Step } from './flow.ts';
import { discardIntake, sendToClinic, updateDraft } from './intake-store.ts';

const DRAFT_KEY = 'tuwulira.intake.draft';

function advance(fromId: string) {
  const d = read<Draft | null>(DRAFT_KEY, null);
  if (!d) return navigate('/intake');
  navigate(`/intake/${nextStep(fromId, d)}`);
}

function setAnswer(id: string, value: string) {
  updateDraft((d) => ({ ...d, answers: { ...d.answers, [id]: value } }));
}

// Raise "Tell the nurse now" at once, put the card at the top of the clinic queue, then show the alert.
function raiseUrgent(reason: string, resumeAt: string) {
  updateDraft((d) => ({
    ...d,
    urgent: { reasons: [...new Set([...(d.urgent?.reasons ?? []), reason])], at: d.urgent?.at ?? new Date().toISOString() },
    resumeAt,
  }));
  const d = read<Draft | null>(DRAFT_KEY, null);
  if (d) sendToClinic(d);
  navigate('/intake/alert');
}

export type StepProps = { step: Step; draft: Draft };

// ---------- choice and yes/no ----------

export function ChoiceStep({ step, draft }: StepProps) {
  const [picked, setPicked] = useState<string | undefined>(draft.answers[step.id]);
  const timer = useRef<number>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const choose = (value: string) => {
    setPicked(value);
    setAnswer(step.id, value);
    if (step.id === 's0_language') updateDraft((d) => ({ ...d, lang: value as 'lg' | 'en' }));
    // Short pause so the patient sees the choice register before the next question.
    // A quick second tap replaces the first: only one timer runs, and it reads the latest stored answer.
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const d = read<Draft | null>(DRAFT_KEY, null);
      const latest = d?.answers[step.id] ?? value;
      if (step.danger && d && step.danger.set.urgentAnswers.includes(latest)) {
        const q = step.danger.set.questions[step.danger.index];
        return raiseUrgent(dangerReason(q.label, latest), nextStep(step.id, d));
      }
      advance(step.id);
    }, 280);
  };

  return (
    <>
      {step.danger && (
        <p className="t-body-sm t-muted">
          Safety question {step.danger.index + 1} of {step.danger.set.questions.length} · {step.danger.set.name}
          {step.danger.set.questions[step.danger.index].status === 'verify_page' && ` · ${PENDING_PAGE_CHECK}`}
        </p>
      )}
      <AnswerButtons name={step.prompt} options={step.options} value={picked} onChange={choose} />
    </>
  );
}

// ---------- consent: tap Yes, then the spoken yes is recorded (PR10) ----------

export function ConsentStep({ step, draft }: StepProps) {
  const [phase, setPhase] = useState<'ask' | 'listening' | 'recorded'>(draft.answers.s0_consent === 'yes' ? 'recorded' : 'ask');
  const consentTimer = useRef<number>(undefined);
  useEffect(() => {
    if (phase !== 'listening') return;
    const t = window.setTimeout(() => {
      setAnswer(step.id, 'yes');
      setPhase('recorded');
    }, 1600);
    consentTimer.current = t;
    return () => window.clearTimeout(t);
  }, [phase, step.id]);

  // "No, stop": the timer is cleared by the effect cleanup when the view goes away; clear it here too.
  const stop = () => {
    window.clearTimeout(consentTimer.current);
    discardIntake();
    navigate('/intake/no-consent');
  };

  if (phase === 'ask')
    return (
      <AnswerButtons
        name={step.prompt}
        options={[
          { value: 'yes', label: 'Yes', icon: 'check' },
          { value: 'no', label: 'No', icon: 'x' },
        ]}
        value={undefined}
        onChange={(v) => {
          if (v === 'yes') return setPhase('listening');
          setAnswer(step.id, 'no');
          updateDraft((d) => ({ ...d, status: 'no_consent' }));
          navigate('/intake/no-consent');
        }}
      />
    );
  return (
    <div className="stack">
      <div className={`listen${phase === 'listening' ? ' is-live' : ''}`} role="status">
        <Icon name="mic" size={32} />
        <div>
          <p className="t-body-lg">
            <b>{phase === 'listening' ? 'Please say “yes” out loud.' : 'Spoken yes recorded.'}</b>
          </p>
          <p className="t-body-sm t-muted">{phase === 'listening' ? 'Listening for “yes”…' : 'Kept with the card as the record of consent.'}</p>
          <p className="t-body-sm t-muted">Prototype: simulated spoken yes. No audio is recorded.</p>
        </div>
      </div>
      {phase === 'recorded' && (
        <Button block onClick={() => advance(step.id)}>
          Next
        </Button>
      )}
      <Button block variant="outline" icon="x" onClick={stop}>
        No, stop
      </Button>
    </div>
  );
}

// ---------- danger-sign set still pending validation ----------

export function DangerPendingStep({ step, draft }: StepProps) {
  const set = step.danger!.set;
  return (
    <div className="stack">
      <Banner kind="info" title="Safety questions: pending validation">
        <p>
          No {set.name.toLowerCase()} safety questions are confirmed yet. They must come from the {set.pendingSource}, checked by a clinician.
          The card tells the nurse to ask in person.
        </p>
      </Banner>
      <Button
        block
        onClick={() => {
          setAnswer(step.id, 'pending');
          advance(step.id);
        }}
      >
        Continue
      </Button>
      <Button
        block
        variant="outline"
        icon="alert"
        onClick={() => {
          setAnswer(step.id, 'asked_for_nurse');
          raiseUrgent(PENDING_NURSE_REASON, nextStep(step.id, { ...draft, answers: { ...draft.answers, [step.id]: 'asked_for_nurse' } }));
        }}
      >
        I need the nurse now
      </Button>
    </div>
  );
}

// ---------- spoken answers (synthetic speech-to-text in the prototype) ----------

type Outcome = 'clear' | 'unclear' | 'silence' | 'danger';
const OUTCOMES: { value: Outcome; label: string; childOnly?: boolean }[] = [
  { value: 'clear', label: 'Clear speech' },
  { value: 'unclear', label: 'Unclear (low confidence)' },
  { value: 'silence', label: 'Silence or noise' },
  { value: 'danger', label: 'Mentions a danger sign', childOnly: true },
];

// SYNTHETIC transcripts. English stands in for the Luganda transcript until the speech model is wired in.
const SAMPLE: Record<string, { self: string; child: string }> = {
  s3_name: { self: 'Nakato A.', child: 'Sample child' },
  s3_village: { self: 'Sample village, sample parish', child: 'Sample village, sample parish' },
  s3_next_of_kin: { self: 'Sample relative, 0700 000000', child: 'Sample parent, 0700 000000' },
  s4_main: { self: 'Cough and fever. I feel weak.', child: 'The child has fever and is coughing.' },
};
const DANGER_SAMPLE = 'The child has had convulsions since morning.';

function transcribe(stepId: string, outcome: Outcome, isChild: boolean) {
  if (outcome === 'silence') return { transcript: '', confidence: 0 };
  if (outcome === 'unclear') return { transcript: '…', confidence: 0.42 };
  if (outcome === 'danger') return { transcript: DANGER_SAMPLE, confidence: 0.9 };
  const male = read<Draft | null>(DRAFT_KEY, null)?.answers.s3_sex === 'male';
  if (stepId === 's3_name' && !isChild && male) return { transcript: 'Okello B.', confidence: 0.92 };
  return { transcript: SAMPLE[stepId]?.[isChild ? 'child' : 'self'] ?? '', confidence: 0.92 };
}

function Recorder({ onDone, outcome, setOutcome, dangerDemo }: { onDone: () => void; outcome: Outcome; setOutcome: (o: Outcome) => void; dangerDemo: boolean }) {
  const [live, setLive] = useState(false);
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (!live) return;
    const t = window.setInterval(() => setSecs((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [live]);
  return (
    <div className="stack">
      <button
        type="button"
        className={`record-btn${live ? ' is-live' : ''}`}
        aria-pressed={live}
        onClick={() => {
          if (live) {
            setLive(false);
            onDone();
          } else {
            setSecs(0);
            setLive(true);
          }
        }}
      >
        <Icon name="mic" size={40} />
        <span className="t-body-lg">
          <b>{live ? `Recording 00:${String(secs).padStart(2, '0')} · Tap to stop` : 'Tap to record'}</b>
        </span>
      </button>
      <details className="demo-controls">
        <summary>Prototype: choose what the speech step hears</summary>
        <div role="radiogroup" aria-label="Recording result" className="demo-options">
          {OUTCOMES.filter((o) => dangerDemo || !o.childOnly).map((o) => (
            <label key={o.value}>
              <input type="radio" name="outcome" checked={outcome === o.value} onChange={() => setOutcome(o.value)} /> {o.label}
            </label>
          ))}
        </div>
        <p className="t-body-sm t-muted">Synthetic transcripts only. No real speech model runs in this prototype.</p>
      </details>
    </div>
  );
}

// Name, village, next of kin: staff can correct the spelling of what was heard.
export function SpokenStep({ step, draft }: StepProps) {
  const isChild = draft.answers.s1_who === 'child';
  const [outcome, setOutcome] = useState<Outcome>('clear');
  const [heard, setHeard] = useState<string | null>(draft.answers[step.id] ?? null);
  const [failed, setFailed] = useState(false);

  const done = () => {
    const turn = transcribe(step.id, outcome, isChild);
    const safety = assessTurn(turn);
    if (safety.kind === 'danger') {
      const d = read<Draft | null>(DRAFT_KEY, null)!;
      return raiseUrgent(`Heard: ${signLabels(safety.signIds)}`, nextStep(step.id, d));
    }
    if (safety.kind === 'ask_person') return setFailed(true);
    setFailed(false);
    setHeard(turn.transcript);
    updateDraft((d) => ({ ...d, spoken: { ...d.spoken, [step.id]: turn } }));
  };

  if (heard !== null && !failed)
    return (
      <div className="stack">
        <label className="field-label" htmlFor="heard">
          What we heard <span className="t-muted">(staff can correct the spelling)</span>
        </label>
        <input id="heard" className="text-input" value={heard} onChange={(e) => setHeard(e.target.value)} />
        <div className="row">
          <Button variant="outline" icon="mic" onClick={() => setHeard(null)}>
            Record again
          </Button>
          <Button
            disabled={!heard.trim()}
            onClick={() => {
              setAnswer(step.id, heard.trim());
              advance(step.id);
            }}
          >
            Next
          </Button>
        </div>
      </div>
    );

  return (
    <div className="stack">
      {failed && (
        <Banner kind="ask" title={ASK_A_PERSON}>
          We did not catch that. Try once more, or let a staff member ask.
        </Banner>
      )}
      <Recorder onDone={done} outcome={outcome} setOutcome={setOutcome} dangerDemo={false} />
      {failed && (
        <Button
          variant="outline"
          block
          onClick={() => {
            setAnswer(step.id, 'ask_clinician');
            advance(step.id);
          }}
        >
          Skip: staff will ask
        </Button>
      )}
    </div>
  );
}

const signLabels = (ids: string[]) => ids.map((id) => DANGER_SIGNS.find((s) => s.id === id)?.label ?? id).join(', ');

// Main problem: the one free answer. One retry, then "Not sure. A person will ask." (retryOnLowConfidence: 1)
export function MainStep({ step, draft }: StepProps) {
  const isChild = draft.answers.s1_who === 'child';
  const [outcome, setOutcome] = useState<Outcome>('clear');
  const prior = draft.spoken[step.id];
  const [heard, setHeard] = useState<string | null>(prior && !draft.mainUnclear ? prior.transcript : null);
  const [retry, setRetry] = useState(false);

  const done = () => {
    const turn = transcribe(step.id, outcome, isChild);
    const safety = assessTurn(turn);
    if (safety.kind === 'danger') {
      updateDraft((d) => ({ ...d, spoken: { ...d.spoken, [step.id]: turn }, answers: { ...d.answers, [step.id]: turn.transcript }, mainUnclear: false }));
      const d = read<Draft | null>(DRAFT_KEY, null)!;
      return raiseUrgent(`Heard in main problem: ${signLabels(safety.signIds)}`, nextStep(step.id, d));
    }
    if (safety.kind === 'ask_person') {
      if (!retry) return setRetry(true); // ask once more
      // Second miss: nothing from the answer is saved. A person will ask.
      updateDraft((d) => ({ ...d, mainUnclear: true, mainAttempts: d.mainAttempts + 2, answers: { ...d.answers, [step.id]: 'unclear' } }));
      return navigate('/intake/s4_unclear');
    }
    setRetry(false);
    setHeard(turn.transcript);
    updateDraft((d) => ({ ...d, mainUnclear: false, spoken: { ...d.spoken, [step.id]: turn }, answers: { ...d.answers, [step.id]: turn.transcript } }));
  };

  if (heard !== null)
    return (
      <div className="stack">
        <div className="heard">
          <p className="section-label">Patient’s own words</p>
          <p className="t-body-lg">“{heard}”</p>
          <p className="t-body-sm t-muted">Kept word for word. Synthetic transcript.</p>
        </div>
        <div className="row">
          <Button variant="outline" icon="mic" onClick={() => setHeard(null)}>
            Record again
          </Button>
          <Button onClick={() => advance(step.id)}>Next</Button>
        </div>
      </div>
    );

  return (
    <div className="stack">
      {retry && (
        <Banner kind="ask" title="Sorry, we did not hear you.">
          Please try once more after you tap the button.
        </Banner>
      )}
      <Recorder onDone={done} outcome={outcome} setOutcome={setOutcome} dangerDemo={isChild} />
    </div>
  );
}

export function UnclearStep({ step }: StepProps) {
  return (
    <div className="stack">
      <Banner kind="ask" title={ASK_A_PERSON}>
        The card will say: <b>Main problem: unclear, clinician to ask</b>. Nothing from that recording is saved.
      </Banner>
      <Button block onClick={() => advance(step.id)}>
        Continue
      </Button>
    </div>
  );
}

// ---------- numbers ----------

export function NumberStep({ step, draft }: StepProps) {
  const prev = draft.answers[step.id];
  const [v, setV] = useState(prev && prev !== 'not_sure' ? prev : '');
  const n = Number(v);
  const ok = v !== '' && Number.isInteger(n) && n >= 0 && n <= 365;
  return (
    <div className="stack">
      <NumberField label="Number of days" unit={step.unit ?? ''} min={0} max={365} step={1} value={v} onChange={setV} />
      <div className="row">
        <Button
          variant="outline"
          icon="question"
          onClick={() => {
            setAnswer(step.id, 'not_sure');
            advance(step.id);
          }}
        >
          Not sure
        </Button>
        <Button
          disabled={!ok}
          onClick={() => {
            setAnswer(step.id, String(n));
            advance(step.id);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export function DobStep({ step, draft }: StepProps) {
  const prev = draft.answers[step.id];
  const [y0, m0, d0] = prev && prev !== 'unknown' ? prev.split('-') : ['', '', ''];
  const [day, setDay] = useState(d0);
  const [month, setMonth] = useState(m0);
  const [year, setYear] = useState(y0);
  const iso = `${year.padStart(4, '0')}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  const date = new Date(iso);
  const valid = year.length === 4 && !Number.isNaN(date.getTime()) && date.getUTCDate() === Number(day) && date <= new Date() && Number(year) >= 1900;
  const showError = day && month && year.length === 4 && !valid;
  return (
    <div className="stack">
      <div className="dob" role="group" aria-label="Date of birth">
        {(
          [
            ['Day', day, setDay, 2, 'DD'],
            ['Month', month, setMonth, 2, 'MM'],
            ['Year', year, setYear, 4, 'YYYY'],
          ] as const
        ).map(([label, val, set, max, ph]) => (
          <label key={label} className="dob-part">
            <span className="field-label">{label}</span>
            <input className="text-input t-num" inputMode="numeric" placeholder={ph} maxLength={max} value={val} onChange={(e) => set(e.target.value.replace(/\D/g, ''))} />
          </label>
        ))}
      </div>
      {showError && <p className="t-body-sm flag-text">Check: that is not a date in the past. Not saved.</p>}
      <div className="row">
        <Button
          variant="outline"
          icon="question"
          onClick={() => {
            setAnswer(step.id, 'unknown');
            advance(step.id);
          }}
        >
          I do not know
        </Button>
        <Button
          disabled={!valid}
          onClick={() => {
            setAnswer(step.id, iso);
            advance(step.id);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export function EstimateStep({ step, draft }: StepProps) {
  const newborn = step.prompt === 'How many days old?';
  const prev = draft.answers[step.id];
  const [n0, u0] = prev && prev !== 'not_sure' ? prev.split(' ') : ['', newborn ? 'days' : 'years'];
  const [v, setV] = useState(n0);
  const [unit, setUnit] = useState(u0);
  const n = Number(v);
  const max = { days: 60, months: 60, years: 120 }[unit] ?? 120;
  const ok = v !== '' && Number.isInteger(n) && n >= 0 && n <= max;
  return (
    <div className="stack">
      <NumberField label="Age" unit={unit} min={0} max={max} step={1} value={v} onChange={setV} />
      {!newborn && (
        <AnswerButtons
          name="Unit"
          options={[
            { value: 'days', label: 'Days' },
            { value: 'months', label: 'Months' },
            { value: 'years', label: 'Years' },
          ]}
          value={unit}
          onChange={setUnit}
          compact
        />
      )}
      <div className="row">
        <Button
          variant="outline"
          icon="question"
          onClick={() => {
            setAnswer(step.id, 'not_sure');
            advance(step.id);
          }}
        >
          Not sure
        </Button>
        <Button
          disabled={!ok}
          onClick={() => {
            setAnswer(step.id, `${n} ${unit}`);
            advance(step.id);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

// ---------- private intro and read-back ----------

export function IntroStep({ step }: StepProps) {
  return (
    <div className="stack">
      <Banner kind="info" title="Only the clinician sees these answers.">
        If you would rather not answer, choose “Prefer not to say”. The clinician can ask you in private.
      </Banner>
      <Button block onClick={() => advance(step.id)}>
        I understand
      </Button>
    </div>
  );
}

export function ReadbackStep({ step, draft }: StepProps) {
  const a = draft.answers;
  const days = a.s5_duration && a.s5_duration !== 'not_sure' ? `for ${a.s5_duration} day${a.s5_duration === '1' ? '' : 's'}` : 'how long: not sure';
  const trend = a.s5_trend && a.s5_trend !== 'not_sure' ? answerLabel(a.s5_trend) : 'better or worse: not sure';
  const finish = () => {
    updateDraft((d) => ({ ...d, status: 'done' }));
    sendToClinic(read<Draft>(DRAFT_KEY, draft));
    navigate('/intake/end');
  };
  return (
    <div className="stack">
      <div className="heard">
        <p className="section-label">Here is what we noted</p>
        <p className="t-body-lg">
          <b>{draft.mainUnclear ? 'Main problem: unclear. A person will ask.' : `“${draft.spoken.s4_main?.transcript ?? a.s4_main ?? ''}”`}</b>
        </p>
        <p className="t-body-lg">
          {days}, {trend}.
        </p>
        <p className="t-body-sm t-muted">Private answers are not read back.</p>
      </div>
      <AnswerButtons
        name={step.prompt}
        options={[
          { value: 'correct', label: 'Correct', icon: 'check' },
          { value: 'change', label: 'Change it', icon: 'back' },
        ]}
        value={undefined}
        onChange={(v) => (v === 'correct' ? finish() : navigate('/intake/s4_main'))}
      />
    </div>
  );
}
