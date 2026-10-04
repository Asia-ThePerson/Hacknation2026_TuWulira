// Patient intake on the intake phone (path B, staff-assisted). Route: #/intake and #/intake/:step
import type { ReactNode } from 'react';
import { TELL_THE_NURSE } from '../../../app/safety/index.ts';
import { Icon } from '../components/Icon.tsx';
import { Progress } from '../components/Progress.tsx';
import { AppBar, Banner, Button } from '../components/ui.tsx';
import { navigate } from '../router.ts';
import { getStep, hasLuganda, path, SECTIONS, type Draft, type Step } from './flow.ts';
import { clearDraft, sendToClinic, startDraft, updateDraft, useDraft } from './intake-store.ts';
import {
  ChoiceStep,
  ConsentStep,
  DangerPendingStep,
  DobStep,
  EstimateStep,
  IntroStep,
  MainStep,
  NumberStep,
  ReadbackStep,
  SpokenStep,
  UnclearStep,
  type StepProps,
} from './steps.tsx';

const VIEWS: Record<Step['kind'], (p: StepProps) => ReactNode> = {
  choice: ChoiceStep,
  danger: ChoiceStep,
  consent: ConsentStep,
  danger_pending: DangerPendingStep,
  spoken: SpokenStep,
  main: MainStep,
  unclear: UnclearStep,
  number: NumberStep,
  dob: DobStep,
  estimate: EstimateStep,
  intro: IntroStep,
  readback: ReadbackStep,
};

function Frame({ children, onBack, actions }: { children: ReactNode; onBack?: () => void; actions?: ReactNode }) {
  return (
    <div className="page page-intake">
      <AppBar eyebrow="Intake phone · staff can help" title="Patient intake" onBack={onBack} />
      <main className="page-body">{children}</main>
      {actions && (
        <div className="page-actions">
          <div className="page-actions-inner">{actions}</div>
        </div>
      )}
    </div>
  );
}

const back = () => window.history.back();

// ---------- #/intake ----------

export function IntakeStart() {
  const draft = useDraft();
  const inProgress = draft && draft.status === 'in_progress' && Object.keys(draft.answers).length > 0;
  const begin = () => {
    startDraft();
    navigate('/intake/s0_language');
  };
  return (
    <Frame onBack={() => navigate('/')}>
      <p className="t-prompt">Before the visit</p>
      <p className="t-body-lg">
        A few questions for the patient, about 4 minutes. Hand the phone to the patient, or read the questions with them. Nothing is recorded
        before they say yes.
      </p>
      {inProgress ? (
        <div className="stack">
          <Banner kind="info" title="An intake is not finished">
            Started {new Date(draft.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Answers are saved on this phone.
          </Banner>
          <Button block onClick={() => navigate(`/intake/${lastStep(draft)}`)}>
            Continue that intake
          </Button>
          <Button block variant="outline" onClick={begin}>
            Start a new patient
          </Button>
        </div>
      ) : (
        <Button block onClick={begin}>
          Start
        </Button>
      )}
    </Frame>
  );
}

// First step on the path that has no answer yet.
function lastStep(d: Draft) {
  return path(d).find((id) => d.answers[id] === undefined) ?? 's7_readback';
}

// ---------- #/intake/:step ----------

export function IntakeStep({ id }: { id: string }) {
  const draft = useDraft();
  if (id === 'alert') return <DangerAlert />;
  if (id === 'end') return <Finished />;
  if (id === 'no-consent') return <NoConsent />;
  if (!draft) {
    return (
      <Frame onBack={() => navigate('/')}>
        <Banner kind="info" title="No intake open on this phone" />
        <Button block onClick={() => navigate('/intake')}>
          Go to start
        </Button>
      </Frame>
    );
  }
  const step = getStep(id, draft);
  if (!step) {
    navigate(`/intake/${lastStep(draft)}`);
    return null;
  }
  const View = VIEWS[step.kind];
  const showLgNote = draft.lang === 'lg' && !hasLuganda(id);
  return (
    <Frame onBack={id === 's0_language' ? () => navigate('/intake') : back}>
      <Progress step={step.section + 1} total={SECTIONS.length} section={SECTIONS[step.section]} />
      {step.private && (
        <p className="private-note">
          <Icon name="lock" size={18} /> Private. Answer by tapping only.
        </p>
      )}
      <section className={`prompt${step.kind === 'danger' ? ' prompt-safety' : ''}`} aria-labelledby="prompt">
        <p className="prompt-eyebrow">
          <Icon name="speaker" size={18} />
          {step.kind === 'danger' ? 'Safety question' : 'Question'}
          <span className="t-muted"> · audio not recorded yet</span>
        </p>
        <h2 id="prompt" className="t-prompt">
          {step.prompt}
        </h2>
        {step.hint && <p className="t-body-lg t-muted">{step.hint}</p>}
        {showLgNote && <p className="t-body-sm lg-note">Luganda not ready yet. Showing English until a native speaker records it.</p>}
      </section>
      <View key={id} step={step} draft={draft} />
    </Frame>
  );
}

// ---------- Tell the nurse now ----------

function DangerAlert() {
  const draft = useDraft();
  const reasons = draft?.urgent?.reasons ?? [];
  return (
    <div className="page page-alert">
      <AppBar eyebrow="Intake phone" title="Patient intake" />
      <main className="page-body">
        <section className="alert" role="alert" aria-live="assertive">
          <Icon name="alert" size={56} />
          <h2 className="alert-title">{TELL_THE_NURSE}</h2>
          <p className="t-body-lg">Show this screen to a nurse or staff member straight away.</p>
        </section>
        <section className="stack">
          <p className="section-label">Patient reported</p>
          <ul className="reason-list">
            {reasons.map((r) => (
              <li key={r}>
                <Icon name="alert" size={20} /> {r}
              </li>
            ))}
          </ul>
          <p className="t-body-sm t-muted">This is not a diagnosis. The card is now at the top of the clinic queue, marked urgent.</p>
        </section>
      </main>
      <div className="page-actions">
        <div className="page-actions-inner page-actions-stack">
          <Button
            onClick={() => {
              if (draft?.resumeAt) navigate(`/intake/${draft.resumeAt}`);
            }}
          >
            Staff: nurse told, continue questions
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              updateDraft((d) => ({ ...d, status: 'done' }));
              if (draft) sendToClinic({ ...draft, status: 'done' });
              navigate('/intake/end');
            }}
          >
            Stop here: the nurse takes over
          </Button>
        </div>
      </div>
    </div>
  );
}

// ---------- end screens ----------

function Finished() {
  const draft = useDraft();
  const next = () => {
    clearDraft();
    navigate('/intake');
  };
  return (
    <Frame actions={<Button onClick={next}>Start next patient</Button>}>
      <p className="t-prompt">Thank you. Please wait to be called.</p>
      {draft?.urgent && <Banner kind="danger" title={TELL_THE_NURSE}>This patient is marked urgent in the clinic queue.</Banner>}
      <section className="code-box" aria-label="Visit code">
        <p className="section-label">Your visit code</p>
        <p className="visit-code">{draft?.visitCode.split('').join(' ')}</p>
        <p className="t-body-lg">Show it at the clinic desk.</p>
      </section>
      <p className="sync-line">
        <Icon name="check" /> Card sent to the clinic device · Saved on this device
      </p>
    </Frame>
  );
}

function NoConsent() {
  const next = () => {
    clearDraft();
    navigate('/intake');
  };
  return (
    <Frame actions={<Button onClick={next}>Start next patient</Button>}>
      <p className="t-prompt">That is fine. You can still see the clinician.</p>
      <p className="t-body-lg">Please wait to be called. A staff member will register you on paper.</p>
      <Banner kind="info" title="Nothing was recorded">
        No answers, no card and no SMS. Staff will see a walk-in with no code.
      </Banner>
    </Frame>
  );
}
