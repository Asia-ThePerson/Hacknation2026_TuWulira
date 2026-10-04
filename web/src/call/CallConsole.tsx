// Desktop walkthrough for the basic phone (#/call), laid out like docs/design/wireframes.html:
// flows on the left, the working phone in the middle, the steps of the chosen flow on the right.
// Clicking a step jumps the phone there with a prepared synthetic record; pressing keys on the phone
// moves the step list along with it. Step notes follow the Figma patient screens.
import { useMemo, useState } from 'react';
import { newDraft, path, type Draft } from '../patient/flow.ts';
import { CallPage, type CallState, type Jump, type Phase } from './CallPage.tsx';
import type { Outcome } from '../patient/steps.tsx';

type Setup = { phase: Phase; draft?: Draft | null; retry?: boolean; outcome?: Outcome };
type FlowStep = { t: string; n: string; r: string; setup: () => Setup; match: (s: CallState) => boolean };
type Flow = { id: string; title: string; desc: string; steps: FlowStep[] };

// ---------- synthetic records to start each step from ----------

const SAMPLE_MAIN = 'Cough and fever. I feel weak.';
const make = (answers: Record<string, string>, extra: Partial<Draft> = {}): Draft => ({ ...newDraft(), lang: 'en', answers, ...extra });
const EN = { s0_language: 'en', s0_consent: 'yes' };
const ADULT = { ...EN, s1_who: 'self', s3_sex: 'male', d_pending: 'pending' };
const CHILD = { ...EN, s1_who: 'child', s1_child_age: '2_months_to_5_years' };
const REG = { ...ADULT, s3_name: 'Okello B.', s3_village: 'Sample village, sample parish', s3_dob: '1990-03-05', s3_next_of_kin: 'Sample relative, 0700 000000', s3_repeat: 'no', s3_referral: 'no' };
const PROBLEM = { ...REG, s4_main: SAMPLE_MAIN, s5_duration: '5', s5_trend: 'worse', s5_fever: 'yes', s5_cough: 'yes', s5_night_sweats: 'no', s5_weight_loss: 'no' };
const PRIVATE = { ...PROBLEM, s6_medicines: 'no', s6_daily: 'no', s6_allergies: 'no', s6_alcohol: 'no', s6_private: 'no' };
const spokenMain = { s4_main: { transcript: SAMPLE_MAIN, confidence: 0.92 } };
const firstChildDanger = () => path(make(CHILD)).find((id) => id.startsWith('d_') && id !== 'd_pending') ?? 'd_pending';

const at = (id: string, answers: Record<string, string>, extra: Partial<Draft> = {}) => (): Setup => ({ phase: { k: 'step', id }, draft: make(answers, extra) });
const isStep = (id: string, retry?: boolean) => (s: CallState) => s.phase.k === 'step' && s.phase.id === id && (retry === undefined || s.retry === retry);
const isPhase = (k: Phase['k']) => (s: CallState) => s.phase.k === k;

const FLOWS: Flow[] = [
  {
    id: 'start',
    title: 'Call back, consent and safety',
    desc: 'The patient gives the clinic line a missed call, which costs nothing. The clinic line calls back and asks the question set by voice. The patient answers with the keypad, and speaks only where asked.',
    steps: [
      { t: 'Ring the clinic line', n: 'The basic phone at rest. Press Call to ring the clinic line.', r: 'Path A · D38', setup: () => ({ phase: { k: 'home' }, draft: null }), match: isPhase('home') },
      { t: 'Flash call', n: 'The patient rings once and hangs up. A missed call is free for the patient. Press End.', r: 'Path A · PRD section 6', setup: () => ({ phase: { k: 'dialing' }, draft: null }), match: isPhase('dialing') },
      { t: 'The clinic line calls back', n: 'The clinic line calls back within a minute. Press Call to answer.', r: 'Path A · open question 7', setup: () => ({ phase: { k: 'incoming' }, draft: null }), match: isPhase('incoming') },
      { t: 'Choose a language', n: 'Every question is a recorded voice prompt. Luganda audio is not recorded yet and needs a native speaker; until then the prompts are in English.', r: 's0_language · PR3 · D14', setup: at('s0_language', {}), match: isStep('s0_language') },
      { t: 'Consent', n: 'Nothing is asked or recorded before a yes. Press 1 for yes, or 2 to see what happens on a no.', r: 's0_consent · PR10 · RQ5.1', setup: at('s0_consent', { s0_language: 'en' }), match: isStep('s0_consent') },
      { t: 'Who is the visit for?', n: 'Decides which danger-sign set is asked: newborn, child 2 months to 5 years, pregnancy, or the adult standing prompt.', r: 's1_who · s1_child_age · Component 3', setup: at('s1_who', EN), match: isStep('s1_who') },
      { t: 'Child’s age', n: 'The age band picks the child or newborn danger-sign set.', r: 's1_child_age', setup: at('s1_child_age', { ...EN, s1_who: 'child' }), match: isStep('s1_child_age') },
      { t: 'Danger-sign questions', n: 'One yes/no question per sign, from rules/danger-signs.json. Rules, not AI. Press 1 to see the remote danger path.', r: 's2_danger · PR9 · D3 · RQ4.1', setup: () => at(firstChildDanger(), CHILD)(), match: (s) => s.phase.k === 'step' && s.phase.id === firstChildDanger() },
      { t: 'Adults: standing prompt', n: 'Adult danger signs are pending validation, so adults hear the standing prompt from the rules file. Press 0 to ask for a person now.', r: 'adultStandingPrompt · RQ4.1', setup: at('d_pending', { ...EN, s1_who: 'self', s3_sex: 'male' }), match: isStep('d_pending') },
    ],
  },
  {
    id: 'register',
    title: 'Registration',
    desc: 'Register details the patient can answer, captured once by voice or keypad. They pre-fill HMIS 031 columns 2 to 5, 7, 8 and 11.',
    steps: [
      { t: 'Name (spoken)', n: 'After the beep the patient says their name, then presses #. The clerk checks the spelling on the clinic device.', r: 's3_name · HMIS 031 col 2', setup: at('s3_name', ADULT), match: isStep('s3_name') },
      { t: 'Village and parish (spoken)', n: 'Spoken, then # when done. Speech-to-text runs on the clinic’s intake phone, not on the basic phone (D33).', r: 's3_village · HMIS 031 col 3 to 5', setup: at('s3_village', { ...ADULT, s3_name: 'Okello B.' }), match: isStep('s3_village') },
      { t: 'Date of birth', n: 'Typed on the keypad: day, month, year, then #. Press * for “I do not know”. A date that cannot be right is refused, never guessed.', r: 'REG-DOB · PR20 · D16', setup: at('s3_dob', { ...ADULT, s3_name: 'Okello B.', s3_village: 'Sample village, sample parish' }), match: isStep('s3_dob') },
      { t: 'Next of kin (spoken)', n: 'Who to contact, and their number.', r: 's3_next_of_kin · HMIS 031 col 7', setup: at('s3_next_of_kin', { ...ADULT, s3_name: 'Okello B.', s3_village: 'Sample village, sample parish', s3_dob: '1990-03-05' }), match: isStep('s3_next_of_kin') },
      { t: 'Repeat visit and referral', n: 'Two keypad questions.', r: 's3_repeat · s3_referral · HMIS 031 col 8, 11', setup: at('s3_repeat', { ...REG, s3_repeat: '', s3_referral: '' }), match: (s) => isStep('s3_repeat')(s) || isStep('s3_referral')(s) },
    ],
  },
  {
    id: 'problem',
    title: 'The problem',
    desc: 'One spoken answer for the main problem, keypad answers for the rest, private questions on the keypad only, a read-back, then a visit code to show at the desk.',
    steps: [
      { t: 'Main problem (spoken)', n: 'The one free answer, kept word for word. Speech-to-text gives a confidence score; danger words are checked before anything else.', r: 's4_main · Component 4 · PR3', setup: at('s4_main', REG), match: isStep('s4_main', false) },
      { t: 'How many days', n: 'Typed on the keypad, then #. Press * for not sure.', r: 's5_duration', setup: at('s5_duration', { ...REG, s4_main: SAMPLE_MAIN }, { spoken: spokenMain }), match: isStep('s5_duration') },
      { t: 'Better or worse', n: 'A choice on the keypad.', r: 's5_trend', setup: at('s5_trend', { ...REG, s4_main: SAMPLE_MAIN, s5_duration: '5' }, { spoken: spokenMain }), match: isStep('s5_trend') },
      { t: 'Fever and TB symptom screen', n: 'Fever puts “fever reported” on the card. Any TB yes puts “TB symptoms reported: clinician to assess”. Wording still to check against national TB guidance.', r: 'SYM-FEVER · TB-1 to TB-3 · PR21', setup: at('s5_fever', { ...REG, s4_main: SAMPLE_MAIN, s5_duration: '5', s5_trend: 'worse' }, { spoken: spokenMain }), match: (s) => ['s5_fever', 's5_cough', 's5_night_sweats', 's5_weight_loss'].some((id) => isStep(id)(s)) },
      { t: 'Private questions (keypad only)', n: 'The patient hears the question in their ear and answers on the keypad, so nobody nearby hears the answer. Not asked for ages 0 to 4.', r: 's6_* · PR15 · D23', setup: at('s6_intro', PROBLEM, { spoken: spokenMain }), match: (s) => s.phase.k === 'step' && s.phase.id.startsWith('s6_') },
      { t: 'Read-back', n: 'The patient hears what was noted and confirms or changes it. Private answers are not read back.', r: 's7_readback · Component 1', setup: at('s7_readback', PRIVATE, { spoken: spokenMain }), match: isStep('s7_readback') },
      { t: 'Visit code', n: 'On a call the code is spoken, not texted. The card is now in the clinic queue. Press End to finish.', r: 'Visit code · D30', setup: () => ({ phase: { k: 'code' }, draft: make(PRIVATE, { spoken: spokenMain, status: 'done' }) }), match: isPhase('code') },
    ],
  },
  {
    id: 'danger',
    title: 'Danger sign (remote)',
    desc: 'Decision D4. A danger-sign yes tells the patient to come in today, then asks permission before the clinic is told or sees any answers. The SMS says only the clinic’s name.',
    steps: [
      { t: 'Danger-sign question', n: 'Rule-based. Checked before, and independently of, any AI confidence. Press 1 (Yes).', r: 'PR9 · D3', setup: () => at(firstChildDanger(), CHILD)(), match: () => false },
      { t: 'Come in today, then permission', n: 'Press 1: the alert and card go to the clinic, top of the queue. Press 2: nothing shared, nothing saved.', r: 'D4 · PR9', setup: () => ({ phase: { k: 'permission', reason: 'Child not able to drink or breastfeed', resumeAt: 's3_name' }, draft: make({ ...CHILD }) }), match: isPhase('permission') },
      { t: 'Clinic told', n: 'The card is at the top of the clinic queue, marked urgent. The SMS says only “[Clinic name]: please come in today.” The patient can answer the other questions or hang up.', r: 'D4 · D5 · PR12', setup: () => ({ phase: { k: 'told', resumeAt: 's3_name' }, draft: make({ ...CHILD }) }), match: isPhase('told') },
      { t: 'Declined: nothing shared', n: 'After a 2 on the permission question. No card, no alert, no SMS. The patient is still told to come in today.', r: 'D4 · PR9 · PR10', setup: () => ({ phase: { k: 'declined' }, draft: null }), match: isPhase('declined') },
    ],
  },
  {
    id: 'notsure',
    title: 'Not sure: ask a person',
    desc: 'When speech-to-text understands nothing (silence, a crying child, noise) the tool asks once more, then hands over to a person. It never guesses.',
    steps: [
      { t: 'Recording with no speech', n: 'The speech control is set to “Silence or noise”. Press # to finish the recording.', r: 'PR8 · RQ4.4', setup: () => ({ ...at('s4_main', REG)(), outcome: 'silence' }), match: () => false },
      { t: 'Ask once more', n: 'One retry only (retryOnLowConfidence: 1). Press # again.', r: 'Component 4', setup: () => ({ ...at('s4_main', REG)(), retry: true, outcome: 'silence' }), match: isStep('s4_main', true) },
      { t: 'Not sure. Please ask a person.', n: 'Nothing from that answer is saved. The card shows “unclear, clinician to ask”, and the call continues with keypad questions.', r: 'PR6 · PR8 · Brief 09 fail-safe', setup: at('s4_unclear', { ...REG, s4_main: 'unclear' }, { mainUnclear: true }), match: isStep('s4_unclear') },
    ],
  },
  {
    id: 'noconsent',
    title: 'No consent',
    desc: 'If the patient says no, nothing is recorded. They can still come to the clinic and register on paper.',
    steps: [
      { t: 'Consent question', n: 'Press 2 for no.', r: 's0_consent · PR10', setup: at('s0_consent', { s0_language: 'en' }), match: () => false },
      { t: 'Consent declined', n: 'No recording, no card, no SMS. Press End.', r: 'end_no_consent · PR10', setup: () => ({ phase: { k: 'noconsent' }, draft: null }), match: isPhase('noconsent') },
    ],
  },
];

export function CallConsole() {
  const [flowIx, setFlowIx] = useState(0);
  const [stepIx, setStepIx] = useState(0);
  const [jump, setJump] = useState<Jump | undefined>(undefined);
  const [live, setLive] = useState<CallState>({ phase: { k: 'home' }, retry: false });
  const [jumpSig, setJumpSig] = useState('');

  const flow = FLOWS[flowIx];
  // The step list follows the phone: the current flow first, then any other flow that has this screen.
  const current = useMemo(() => {
    // Right after a click on a step, that step stays selected until a key moves the phone on.
    if (jumpSig && JSON.stringify(live) === jumpSig) return { f: flowIx, s: stepIx };
    const own = flow.steps.findIndex((s) => s.match(live));
    if (own >= 0) return { f: flowIx, s: own };
    for (let f = 0; f < FLOWS.length; f++) {
      const i = FLOWS[f].steps.findIndex((s) => s.match(live));
      if (i >= 0) return { f, s: i };
    }
    return { f: flowIx, s: stepIx };
  }, [live, flowIx, stepIx, flow, jumpSig]);

  const shownFlow = FLOWS[current.f];
  const step = shownFlow.steps[current.s];

  const goTo = (f: number, s: number) => {
    const st = FLOWS[f].steps[s].setup();
    setFlowIx(f);
    setStepIx(s);
    setJump({ nonce: Date.now(), phase: st.phase, draft: st.draft ?? null, retry: st.retry, outcome: st.outcome });
    setJumpSig(JSON.stringify({ phase: st.phase, retry: st.retry ?? false }));
  };
  const next = () => (current.s < shownFlow.steps.length - 1 ? goTo(current.f, current.s + 1) : current.f < FLOWS.length - 1 && goTo(current.f + 1, 0));
  const prev = () => (current.s > 0 ? goTo(current.f, current.s - 1) : current.f > 0 && goTo(current.f - 1, FLOWS[current.f - 1].steps.length - 1));

  return (
    <div className="console">
      <nav className="console-nav" aria-label="Flows">
        <div>
          <h1>Basic phone</h1>
          <p className="console-sub">Patient’s own phone · flash call</p>
        </div>
        <p className="console-intro">Choose a flow to walk through it step by step, or just press the keys on the phone. Keys the phone accepts now are filled black.</p>
        <div className="console-flows">
          {FLOWS.map((f, i) => (
            <button key={f.id} type="button" className="console-flow" aria-current={current.f === i} onClick={() => goTo(i, 0)}>
              <span>{f.title}</span>
              <span className="n">{f.steps.length} steps</span>
            </button>
          ))}
        </div>
        <p className="console-note">All names and numbers are synthetic sample data. The call and the speech step are simulated.</p>
      </nav>

      <main className="console-stage">
        <CallPage jump={jump} onState={setLive} inConsole />
      </main>

      <aside className="console-panel" aria-label="Steps">
        <p className="eyebrow">
          Flow {current.f + 1} of {FLOWS.length} · Patient’s own basic phone
        </p>
        <h2>{shownFlow.title}</h2>
        <p className="desc">{shownFlow.desc}</p>
        <div className="stepcard">
          <p className="eyebrow">
            Step {current.s + 1} of {shownFlow.steps.length}
          </p>
          <h3>{step.t}</h3>
          <p>{step.n}</p>
          <p className="refs">{step.r}</p>
          <div className="pn">
            <button type="button" className="b ghost" onClick={prev} disabled={current.f === 0 && current.s === 0}>
              Previous
            </button>
            <button type="button" className="b primary" onClick={next} disabled={current.f === FLOWS.length - 1 && current.s === shownFlow.steps.length - 1}>
              Next
            </button>
          </div>
        </div>
        <ol className="console-steps">
          {shownFlow.steps.map((s, i) => (
            <li key={s.t}>
              <button type="button" aria-current={i === current.s} onClick={() => goTo(current.f, i)}>
                {s.t}
              </button>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
