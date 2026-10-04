// Patient intake on the patient's own basic phone (Path A, D38): flash call, the clinic line calls back,
// voice prompts and keypad answers. Same question set, routing and danger-sign rules as the intake phone
// (flow.ts, rules/danger-signs.json). The basic phone runs nothing; speech-to-text runs on the clinic's
// intake phone (D33). Wording follows the Figma patient screens (Flash call 1 to 3, Danger sign (remote),
// Not sure, No consent). Route: #/call. In the prototype the call and the speech step are simulated.
import { useEffect, useState, type ReactNode } from 'react';
import { ASK_A_PERSON, assessTurn } from '../../../app/safety/index.ts';
import { ADULT_STANDING_PROMPT, PENDING_PAGE_CHECK } from '../patient/danger-sets.ts';
import { answerLabel, dangerReason, getStep, hasLuganda, newDraft, nextStep, PENDING_NURSE_REASON, type Draft, type Step } from '../patient/flow.ts';
import { CARDS_KEY, sendToClinic } from '../patient/intake-store.ts';
import { OUTCOMES, signLabels, transcribe, type Outcome } from '../patient/steps.tsx';
import { read, useStored, write } from '../store.ts';

export const CALL_KEY = 'tuwulira.call.draft';

type Key = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '0' | '*' | '#' | 'call' | 'ok' | 'end';
type Phase =
  | { k: 'home' }
  | { k: 'dialing' }
  | { k: 'incoming' }
  | { k: 'step'; id: string }
  | { k: 'permission'; reason: string; resumeAt: string } // D4: come in today, then ask before sharing
  | { k: 'told'; resumeAt: string }
  | { k: 'notsure'; resumeAt: string }
  | { k: 'declined' }
  | { k: 'noconsent' }
  | { k: 'code' }
  | { k: 'hungup'; shared: boolean };

type View = { hear?: string; screen?: ReactNode; opts: string; extra?: ReactNode; keys: Partial<Record<Key, () => void>> };

const load = () => read<Draft | null>(CALL_KEY, null);

// Until the patient agrees to share (end of call, or the danger-sign permission), nothing reaches the clinic.
function save(fn: (d: Draft) => Draft): Draft | null {
  const d = load();
  if (!d) return null;
  const next = { ...fn(d), updatedAt: new Date().toISOString() };
  write(CALL_KEY, next);
  if (next.urgent) sendToClinic(next); // permission given: keep the clinic copy current
  return next;
}

// Drop the call record and any clinic copy: nothing shared, nothing saved.
function discard() {
  const d = load();
  if (d) {
    const { [d.id]: _gone, ...rest } = read<Record<string, Draft>>(CARDS_KEY, {});
    write(CARDS_KEY, rest);
  }
  write(CALL_KEY, null);
}

// Keypad digits for a fixed option list: Ask clinician is always 0, the rest 1, 2, 3 in order (design system).
function keyMap(step: Step) {
  let n = 1;
  return (step.options ?? []).map((o) => ({ key: (o.value === 'ask_clinician' ? '0' : String(n++)) as Key, option: o }));
}

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export function CallPage() {
  const draft = useStored<Draft | null>(CALL_KEY, null);
  const [phase, setPhase] = useState<Phase>({ k: 'home' });
  const [callStart, setCallStart] = useState(0);
  const [recStart, setRecStart] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [entry, setEntry] = useState('');
  const [err, setErr] = useState('');
  const [retry, setRetry] = useState(false);
  const [outcome, setOutcome] = useState<Outcome>('clear');
  const [flash, setFlash] = useState<Key | null>(null);
  const [code, setCode] = useState('');

  // A call that was not finished (page reload) is dropped, as a real call would be. Shared answers stay.
  useEffect(() => {
    const d = load();
    if (d && !d.urgent) write(CALL_KEY, null);
  }, []);

  const onCall = !['home', 'dialing', 'incoming', 'hungup'].includes(phase.k);
  useEffect(() => {
    if (!onCall) return;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [onCall]);

  const go = (id: string) => {
    setEntry('');
    setErr('');
    setRetry(false);
    setRecStart(Date.now());
    if (id === 'end') return finish();
    setPhase({ k: 'step', id });
  };
  const advanceFrom = (id: string) => {
    const d = load();
    if (d) go(nextStep(id, d));
  };
  const answer = (id: string, value: string) => save((d) => ({ ...d, answers: { ...d.answers, [id]: value } }));
  const finish = () => {
    const d = save((x) => ({ ...x, status: 'done' }));
    if (d) sendToClinic(d);
    setCode(d?.visitCode ?? '');
    setPhase({ k: 'code' });
  };
  const danger = (reason: string, resumeAt: string) => {
    const d = load();
    if (d?.urgent) {
      // Already shared with permission: add the reason and tell the clinic again.
      save((x) => ({ ...x, urgent: { reasons: [...new Set([...(x.urgent?.reasons ?? []), reason])], at: x.urgent!.at }, resumeAt }));
      return setPhase({ k: 'told', resumeAt });
    }
    setPhase({ k: 'permission', reason, resumeAt });
  };
  const hangUp = () => {
    const shared = Boolean(load()?.urgent);
    if (shared) save((x) => x); // the clinic keeps what the patient agreed to share
    else discard();
    write(CALL_KEY, null);
    setPhase({ k: 'hungup', shared });
  };
  const home = () => {
    write(CALL_KEY, null);
    setPhase({ k: 'home' });
  };

  const view = buildView();

  function buildView(): View {
    switch (phase.k) {
      case 'home':
        return {
          screen: (
            <div className="dial">
              <span className="tag">Basic phone</span>
              <b>Ring the clinic line</b>
              <p className="hint">Give the clinic line a missed call. It is free. The clinic calls you back and asks the questions.</p>
            </div>
          ),
          opts: 'Call: ring the clinic line',
          keys: { call: () => setPhase({ k: 'dialing' }) },
        };
      case 'dialing':
        return {
          screen: (
            <div className="dial">
              <span className="tag">Calling</span>
              <b>[clinic line]</b>
              <p className="hint">Ring once, then hang up. The call is free.</p>
            </div>
          ),
          opts: 'End: hang up',
          keys: { end: () => setPhase({ k: 'incoming' }) },
        };
      case 'incoming':
        return {
          screen: (
            <div className="dial">
              <span className="tag">Incoming call</span>
              <b>TuWulira clinic</b>
              <p className="hint">[clinic line] · Ringing</p>
            </div>
          ),
          opts: 'Call: answer',
          keys: {
            call: () => {
              write(CALL_KEY, newDraft());
              setCallStart(Date.now());
              go('s0_language');
            },
          },
        };
      case 'permission':
        return {
          hear: 'Please come to the clinic today. May we tell the clinic now and share your answers? Press 1 for yes. Press 2 for no.',
          opts: '1 Yes, tell the clinic · 2 No',
          keys: {
            '1': () => {
              save((x) => ({ ...x, urgent: { reasons: [...new Set([...(x.urgent?.reasons ?? []), phase.reason])], at: new Date().toISOString() }, resumeAt: phase.resumeAt }));
              setPhase({ k: 'told', resumeAt: phase.resumeAt });
            },
            '2': () => {
              discard();
              setPhase({ k: 'declined' });
            },
            end: hangUp,
          },
        };
      case 'told':
        return {
          hear: 'Thank you. We have told the clinic. Please come in today. Press 1 to answer the other questions now. Press End to finish.',
          opts: '1 Continue · End to finish',
          extra: (
            <>
              <p className="note">The card is now at the top of the clinic queue, marked urgent.</p>
              <p className="note">SMS to this phone: “[Clinic name]: please come in today.”</p>
            </>
          ),
          keys: { '1': () => go(phase.resumeAt), end: finish },
        };
      case 'notsure':
        return {
          hear: `${ASK_A_PERSON} A person at the clinic will ask you about this. Press 1 to continue.`,
          opts: '1 Continue',
          keys: { '1': () => go(phase.resumeAt), end: hangUp },
        };
      case 'declined':
        return {
          hear: 'That is fine. We have not shared anything with the clinic and nothing was saved. Please still come to the clinic today. Goodbye.',
          opts: 'End to finish',
          extra: <p className="box">Nothing shared. Nothing saved. No card, no alert, no SMS.</p>,
          keys: { end: home },
        };
      case 'noconsent':
        return { hear: 'That is fine. You can still come to the clinic. Goodbye.', opts: 'End to finish', extra: <p className="note">Nothing was recorded. No card and no SMS.</p>, keys: { end: home } };
      case 'hungup':
        return {
          screen: (
            <div className="dial">
              <span className="tag">Call ended</span>
              <p className="hint">{phase.shared ? 'The clinic has the answers you agreed to share.' : 'Nothing was shared with the clinic and nothing was saved.'}</p>
            </div>
          ),
          opts: 'Call or End: back to start',
          keys: { call: home, end: home },
        };
      case 'code': {
        const digits = code;
        return {
          hear: `Thank you. Your visit code is ${digits.split('').join(', ')}. Show it at the clinic desk. Press 9 to hear it again.`,
          opts: '9 Repeat · End to finish',
          extra: (
            <>
              <div className="bigcode">{digits}</div>
              <p className="note">Card sent to the clinic device. On a call the code is spoken, not texted.</p>
            </>
          ),
          keys: { '9': () => {}, end: home },
        };
      }
      case 'step':
        return stepView(phase.id);
    }
  }

  function stepView(id: string): View {
    const d = draft ?? load();
    const step = d && getStep(id, d);
    if (!d || !step) return { hear: ASK_A_PERSON, opts: 'End to finish', keys: { end: home } };
    const isChild = d.answers.s1_who === 'child';
    const lgNote = d.lang === 'lg' && !hasLuganda(id) ? <p className="note">Luganda audio not recorded yet. English until a native speaker records it.</p> : null;
    const withNote = (v: View): View => ({ ...v, extra: [lgNote, v.extra].some(Boolean) ? <>{v.extra}{lgNote}</> : undefined, keys: { ...v.keys, end: hangUp } });

    switch (step.kind) {
      case 'choice':
      case 'danger': {
        const map = keyMap(step);
        const hear = id === 's0_language' ? 'Press 1 for Luganda. Press 2 for English.' : step.prompt;
        const q = step.danger?.set.questions[step.danger.index];
        return withNote({
          hear,
          opts: map.map((m) => `${m.key} ${m.option.label}`).join(' · '),
          extra: q ? (
            <p className="note">
              Safety question {step.danger!.index + 1} of {step.danger!.set.questions.length}
              {q.status === 'verify_page' ? ` · ${PENDING_PAGE_CHECK}` : ''}
            </p>
          ) : undefined,
          keys: Object.fromEntries(
            map.map((m) => [
              m.key,
              () => {
                const v = m.option.value;
                answer(id, v);
                if (id === 's0_language') save((x) => ({ ...x, lang: v as 'lg' | 'en' }));
                const latest = load()!;
                if (step.danger && q && step.danger.set.urgentAnswers.includes(v)) return danger(dangerReason(q.label, v), nextStep(id, latest));
                advanceFrom(id);
              },
            ]),
          ),
        });
      }
      case 'consent':
        return withNote({
          hear: `${step.prompt} Say yes, or press 1.`,
          opts: '1 Yes · 2 No',
          extra: <p className="note">Prototype: pressing 1 stands in for the recorded spoken yes.</p>,
          keys: {
            '1': () => {
              answer(id, 'yes');
              advanceFrom(id);
            },
            '2': () => {
              write(CALL_KEY, null);
              setPhase({ k: 'noconsent' });
            },
          },
        });
      case 'danger_pending':
        return withNote({
          hear: `${ADULT_STANDING_PROMPT} Press 1 to continue. Press 0 if you need a person now.`,
          opts: '1 Continue · 0 I need a person now',
          extra: <p className="note">Adult safety questions are pending validation. The card tells the nurse to ask in person.</p>,
          keys: {
            '1': () => {
              answer(id, 'pending');
              advanceFrom(id);
            },
            '0': () => {
              const x = answer(id, 'asked_for_nurse');
              if (x) danger(PENDING_NURSE_REASON, nextStep(id, x));
            },
          },
        });
      case 'spoken':
      case 'main': {
        const main = step.kind === 'main';
        const secs = Math.max(0, Math.floor((now - recStart) / 1000));
        const process = () => {
          const effective = outcome === 'danger' && !(main && isChild) ? 'clear' : outcome;
          const turn = transcribe(id, effective, isChild, d.answers.s3_sex === 'male');
          const safety = assessTurn(turn);
          if (safety.kind === 'danger') {
            if (main) save((x) => ({ ...x, spoken: { ...x.spoken, [id]: turn }, answers: { ...x.answers, [id]: turn.transcript }, mainUnclear: false }));
            return danger(`Heard${main ? ' in main problem' : ''}: ${signLabels(safety.signIds)}`, nextStep(id, load()!));
          }
          if (safety.kind === 'ask_person') {
            if (!retry) {
              setRetry(true);
              setRecStart(Date.now());
              return;
            }
            if (main) {
              save((x) => ({ ...x, mainUnclear: true, mainAttempts: x.mainAttempts + 2, answers: { ...x.answers, [id]: 'unclear' } }));
              return go('s4_unclear');
            }
            const x = answer(id, 'ask_clinician');
            return setPhase({ k: 'notsure', resumeAt: nextStep(id, x!) });
          }
          save((x) => ({ ...x, ...(main ? { mainUnclear: false } : {}), spoken: { ...x.spoken, [id]: turn }, answers: { ...x.answers, [id]: turn.transcript } }));
          advanceFrom(id);
        };
        return withNote({
          hear: retry ? 'Sorry, we did not hear you. Please try once more after the beep. Press hash when you are done.' : `${step.prompt} After the beep, say your answer. Press hash when you are done.`,
          opts: '# Done',
          extra: (
            <div className="rec">
              <i aria-hidden="true" /> Recording {mmss(secs)}
            </div>
          ),
          keys: { '#': process },
        });
      }
      case 'unclear':
        return withNote({
          hear: `${ASK_A_PERSON} A person at the clinic will ask you about this. Press 1 to continue.`,
          opts: '1 Continue',
          extra: (
            <p className="box">
              Card: <b>Main problem: unclear, clinician to ask</b>
            </p>
          ),
          keys: { '1': () => advanceFrom(id) },
        });
      case 'number':
      case 'dob':
      case 'estimate':
        return withNote(numberView(step));
      case 'intro':
        return withNote({
          hear: 'The next questions are private. Answer only with the keypad. Do not say your answer out loud. Press 1 to continue.',
          opts: '1 Continue',
          keys: { '1': () => advanceFrom(id) },
        });
      case 'readback': {
        const a = d.answers;
        const days = a.s5_duration && a.s5_duration !== 'not_sure' ? `for ${a.s5_duration} day${a.s5_duration === '1' ? '' : 's'}` : 'how long: not sure';
        const trend = a.s5_trend && a.s5_trend !== 'not_sure' ? answerLabel(a.s5_trend) : 'better or worse: not sure';
        const what = d.mainUnclear ? 'main problem unclear, a person will ask' : `“${d.spoken.s4_main?.transcript ?? a.s4_main ?? ''}”`;
        return withNote({
          hear: `Here is what we noted: ${what}, ${days}, ${trend}. Press 1 if this is correct. Press 2 to change it.`,
          opts: '1 Correct · 2 Change',
          extra: <p className="note">Private answers are not read back.</p>,
          keys: { '1': finish, '2': () => go('s4_main') },
        });
      }
    }
  }

  // Numbers typed on the keypad: hash to confirm, star for "not sure", OK to clear. Out of range is refused, never guessed.
  function numberView(step: Step): View {
    const id = step.id;
    const digit = (k: string) => () => {
      setErr('');
      setEntry((e) => (e.length < (step.kind === 'dob' ? 8 : 3) ? e + k : e));
    };
    const digits = Object.fromEntries('0123456789'.split('').map((k) => [k, digit(k)]));
    let hear = '';
    let shown = entry || ' ';
    let check: () => string | null;
    let starValue = 'not_sure';
    if (step.kind === 'dob') {
      hear = 'Enter the date of birth: day, month, then year. Then press hash. Press star if you do not know.';
      const e = entry.padEnd(8, '_');
      shown = `${e.slice(0, 2)} / ${e.slice(2, 4)} / ${e.slice(4)}`;
      starValue = 'unknown';
      check = () => {
        if (entry.length !== 8) return null;
        const iso = `${entry.slice(4)}-${entry.slice(2, 4)}-${entry.slice(0, 2)}`;
        const date = new Date(iso);
        const ok = !Number.isNaN(date.getTime()) && date.getUTCDate() === Number(entry.slice(0, 2)) && date <= new Date() && Number(entry.slice(4)) >= 1900;
        return ok ? iso : null;
      };
    } else if (step.kind === 'estimate') {
      const newborn = step.prompt === 'How many days old?';
      const unit = newborn ? 'days' : 'years';
      hear = `${newborn ? 'How many days old?' : 'About how old, in years?'} Type the number, then press hash. Press star if you are not sure.`;
      shown = entry ? `${entry} ${unit}` : ' ';
      check = () => {
        const n = Number(entry);
        return entry !== '' && n >= 0 && n <= (newborn ? 60 : 120) ? `${n} ${unit}` : null;
      };
    } else {
      hear = `${step.prompt} Type the number, then press hash. Press star if you are not sure.`;
      shown = entry ? `${entry} ${step.unit ?? ''}` : ' ';
      check = () => {
        const n = Number(entry);
        return entry !== '' && n >= 0 && n <= 365 ? String(n) : null;
      };
    }
    return {
      hear,
      opts: '# Done · * Not sure · OK Clear',
      extra: (
        <>
          <div className="entry" aria-live="polite">
            {shown}
          </div>
          {err && <p className="box">{err}</p>}
        </>
      ),
      keys: {
        ...digits,
        ok: () => {
          setEntry('');
          setErr('');
        },
        '*': () => {
          answer(id, starValue);
          advanceFrom(id);
        },
        '#': () => {
          const v = check();
          if (v == null) return setErr('Check: that number cannot be right. Not saved. Type it again.');
          answer(id, v);
          advanceFrom(id);
        },
      },
    };
  }

  const press = (k: Key) => {
    const fn = view.keys[k];
    if (!fn) return;
    setFlash(k);
    window.setTimeout(() => setFlash(null), 160);
    fn();
  };

  // A computer keyboard works too: digits, * and #, Enter for #, Escape for End, C for Call.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.closest('input, select, textarea, [contenteditable="true"]') || e.metaKey || e.ctrlKey || e.altKey)) return;
      const k = /^[0-9*#]$/.test(e.key) ? (e.key as Key) : e.key === 'Enter' ? '#' : e.key === 'Escape' ? 'end' : e.key.toLowerCase() === 'c' ? 'call' : null;
      if (k && view.keys[k]) {
        e.preventDefault();
        press(k);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const hot = new Set(Object.keys(view.keys));
  const isSpoken = phase.k === 'step' && draft && ['spoken', 'main'].includes(getStep(phase.id, draft)?.kind ?? '');
  const childMain = phase.k === 'step' && phase.id === 's4_main' && draft?.answers.s1_who === 'child';
  const clock = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="call-page">
      <main className="basic-phone" aria-label="Patient's basic phone">
        <div className="bp-status">
          <span>{clock}</span>
          <span>Signal ▂▄▆ · basic phone</span>
        </div>
        <div className="bp-screen" aria-live="polite">
          {onCall && (
            <div className="bp-who">
              <b>TuWulira clinic</b>
              <span>On call {mmss(Math.max(0, Math.floor((now - callStart) / 1000)))}</span>
            </div>
          )}
          {view.screen}
          {view.hear && (
            <div className="hear">
              <span className="tag">You hear</span>
              <h1 className="hear-text">“{view.hear}”</h1>
            </div>
          )}
          <p className="opts">Keypad: {view.opts}</p>
          {view.extra}
        </div>
        <div className="bp-keypad" role="group" aria-label="Keypad">
          {KEYS.map(([k, label, sub]) => (
            <button
              key={k}
              type="button"
              className={`${hot.has(k) ? 'hot' : ''}${flash === k ? ' pressed' : ''}`}
              aria-disabled={!hot.has(k)}
              onClick={() => press(k)}
            >
              {label}
              {sub && <small>{sub}</small>}
            </button>
          ))}
        </div>
      </main>
      <section className="call-controls" aria-label="Prototype controls">
        <label>
          <span>Prototype: what the speech step hears</span>
          <select value={outcome} onChange={(e) => setOutcome(e.target.value as Outcome)} disabled={!isSpoken}>
            {OUTCOMES.filter((o) => !o.childOnly || childMain).map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <p>Simulated call and synthetic transcripts. The basic phone runs no app and no AI; speech-to-text runs on the clinic's intake phone. Your keyboard works too: digits, * and #.</p>
      </section>
    </div>
  );
}

const KEYS: [Key, string, string?][] = [
  ['call', 'Call'],
  ['ok', 'OK'],
  ['end', 'End'],
  ['1', '1'],
  ['2', '2', 'abc'],
  ['3', '3', 'def'],
  ['4', '4', 'ghi'],
  ['5', '5', 'jkl'],
  ['6', '6', 'mno'],
  ['7', '7', 'pqrs'],
  ['8', '8', 'tuv'],
  ['9', '9', 'wxyz'],
  ['*', '*'],
  ['0', '0'],
  ['#', '#'],
];
