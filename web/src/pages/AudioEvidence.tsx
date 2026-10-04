// Evidence page for judges: the Luganda speech smoke test. Route #/evaluation/audio, not linked from the
// patient or clinic flows. Shows saved results only; no speech model runs in the web app.
// Privacy: real Common Voice recordings (and the noisy copy made from one) are never bundled here.
// The only playable file is the purely generated silence clip.
import silenceUrl from '../../../evaluation/test-sets/synthetic_silence_01.wav?url';
import result from '../../../evaluation/results/2026-10-04-luganda-asr-smoke.json';
import { AppBar, Banner, SectionLabel, Tag } from '../components/ui.tsx';
import { navigate } from '../router.ts';

type Row = {
  clip: string;
  kind: string;
  audio_seconds: number;
  transcript: string;
  confidence: number;
  processing_seconds: number;
  official_transcript: string | null;
  word_errors?: number;
  reference_words?: number;
  verdict?: string;
  tuwulira_safety: string;
};

// Only generated audio is playable. Do not add real recordings here: they must not reach the public build.
const AUDIO: Record<string, string> = { 'synthetic_silence_01.wav': silenceUrl };

const rows = result.results as Row[];
const real = rows.filter((r) => r.kind === 'common_voice_test');
const failure = rows.filter((r) => r.kind !== 'common_voice_test');
const FAILURE_LABEL: Record<string, string> = {
  synthetic_silence: '5 s of near-silence (generated, no voice)',
  real_clip_plus_noise: 'Clip 1 with loud noise added (contains a real voice, kept local)',
};
const secs = (rs: Row[]) => `${Math.min(...rs.map((r) => r.processing_seconds)).toFixed(1)} to ${Math.max(...rs.map((r) => r.processing_seconds)).toFixed(1)} s`;

// Marks words that differ from the official transcript (same position), so errors are visible without colour.
function Heard({ text, reference }: { text: string; reference: string | null }) {
  const hyp = text.split(' ');
  const ref = reference?.split(' ') ?? [];
  const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}']/gu, '');
  if (!reference || hyp.length !== ref.length) return <>{text}</>;
  return (
    <>
      {hyp.map((w, i) => (
        <span key={i}>
          {i > 0 && ' '}
          {norm(w) === norm(ref[i]) ? w : <mark className="word-diff">{w}</mark>}
        </span>
      ))}
    </>
  );
}

function Verdict({ r }: { r: Row }) {
  if (r.verdict === 'correct') return <Tag kind="confirmed">Correct</Tag>;
  if (r.verdict === 'close') return <Tag kind="flag">Close: {r.word_errors} of {r.reference_words} words wrong</Tag>;
  return <Tag kind="outline">{r.verdict === 'invented words from silence' ? 'Invented words from silence' : 'Wrong'}</Tag>;
}

function Safety({ r }: { r: Row }) {
  return r.tuwulira_safety.startsWith('ask_person') ? (
    <Tag kind="flag">Not sure. Please ask a person.</Tag>
  ) : (
    <Tag kind="card">Passed as usable speech</Tag>
  );
}

function ClipCard({ r, title }: { r: Row; title: string }) {
  return (
    <article className="clip">
      <header className="clip-head">
        <p className="clip-title">{title}</p>
        <code className="t-body-sm t-muted">{r.clip}</code>
      </header>
      {AUDIO[r.clip] ? (
        <audio controls preload="none" src={AUDIO[r.clip]} aria-label={`Play ${r.clip}`} />
      ) : (
        <p className="t-body-sm t-muted">Audio used locally for evaluation; raw contributor recordings are not included in this public build.</p>
      )}
      <dl className="ans">
        {r.official_transcript && (
          <div className="ans-row">
            <dt>Official transcript</dt>
            <dd lang="lg">{r.official_transcript}</dd>
          </div>
        )}
        <div className="ans-row">
          <dt>Model heard</dt>
          <dd lang="lg">
            <b>
              <Heard text={r.transcript} reference={r.kind === 'common_voice_test' ? r.official_transcript : null} />
            </b>
          </dd>
        </div>
        <div className="ans-row">
          <dt>Result</dt>
          <dd>
            <Verdict r={r} />
          </dd>
        </div>
        <div className="ans-row">
          <dt>Model confidence</dt>
          <dd>{r.confidence.toFixed(2)}</dd>
        </div>
        <div className="ans-row">
          <dt>TuWulira safety layer</dt>
          <dd>
            <Safety r={r} />
          </dd>
        </div>
        <div className="ans-row">
          <dt>Time</dt>
          <dd>
            {r.processing_seconds.toFixed(1)} s for {r.audio_seconds.toFixed(1)} s of audio
          </dd>
        </div>
      </dl>
    </article>
  );
}

export function AudioEvidence() {
  const s = result.summary;
  const m = result.model;
  const rt = result.runtime;
  return (
    <div className="page">
      <AppBar eyebrow="Evidence · not part of the patient flow" title="Luganda speech test" onBack={() => navigate('/')} />
      <main className="page-body evidence">
        <Banner kind="info" title="Small hackathon evaluation, not clinical validation">
          Three real Luganda clips from Mozilla Common Voice, plus silence and noise, run through a small Luganda speech model on a laptop, then
          through TuWulira’s own safety rule. Results are saved in the repo; nothing runs here.
        </Banner>

        <section className="stack">
          <SectionLabel n={1}>Summary</SectionLabel>
          <dl className="ans">
            <div className="ans-row">
              <dt>Model</dt>
              <dd>
                {m.name} ({(m.parameters / 1e6).toFixed(1)} M parameters, {m.weights_mb_on_disk} MB, {m.licence})
              </dd>
            </div>
            <div className="ans-row">
              <dt>Real Luganda speech</dt>
              <dd>
                {s.real_clips_word_errors} wrong · {s.exact_matches} of 3 clips exactly right
              </dd>
            </div>
            <div className="ans-row">
              <dt>Silence and noise</dt>
              <dd>
                Model invented words in {s.model_invented_words_on_failure_clips} · safety layer caught {s.failure_clips_caught_by_safety}
              </dd>
            </div>
            <div className="ans-row">
              <dt>Speed</dt>
              <dd>{secs(rows)} per clip of about 5 s, on a laptop CPU (not a phone)</dd>
            </div>
            <div className="ans-row">
              <dt>Without internet</dt>
              <dd>{s.offline_run_identical ? 'Yes: same transcripts with network access switched off, after a one-time download' : 'Not confirmed'}</dd>
            </div>
            <div className="ans-row">
              <dt>Memory</dt>
              <dd>{rt.memory_note}</dd>
            </div>
          </dl>
        </section>

        <section className="stack">
          <SectionLabel n={2}>Real Luganda speech</SectionLabel>
          <dl className="ans">
            <div className="ans-row">
              <dt>Source</dt>
              <dd>{result.dataset.name}</dd>
            </div>
            <div className="ans-row">
              <dt>Licence</dt>
              <dd>{result.dataset.licence}</dd>
            </div>
            <div className="ans-row">
              <dt>Audio</dt>
              <dd>Used locally for evaluation. Raw contributor recordings are not included in this public build or in the repo; clip IDs and checksums let anyone fetch the same clips.</dd>
            </div>
          </dl>
          <p className="t-body-sm t-muted">Official transcripts are copied exactly. The team did not write or translate any Luganda. Highlighted words differ from the official transcript.</p>
          {real.map((r, i) => (
            <ClipCard key={r.clip} r={r} title={`Clip ${i + 1}`} />
          ))}
        </section>

        <section className="stack">
          <SectionLabel n={3}>Silence and noise: the fail-safe</SectionLabel>
          <p className="t-body-sm t-muted">
            The model invents words from audio with no usable speech. Its low confidence sends both to “Not sure. Please ask a person.”, so nothing
            would be saved to the card. This is why the safety rule stays separate from the model.
          </p>
          {failure.map((r) => (
            <ClipCard key={r.clip} r={r} title={FAILURE_LABEL[r.kind] ?? r.clip} />
          ))}
        </section>

        <section className="stack">
          <SectionLabel n={4}>Limitations</SectionLabel>
          <ul className="evidence-list">
            <li>Three read-aloud sentences: too few for an accuracy figure, and not patients, children, older voices or a noisy clinic.</li>
            <li>One clip with a wrong word scored 0.80, just above the 0.8 threshold, so it would have passed. The threshold still needs calibrating.</li>
            <li>Measured on a laptop in float32. A quantized model on the target phone is still to test.</li>
            <li>The model card does not say which Common Voice splits it trained on, so overlap cannot be ruled out.</li>
          </ul>
          <p className="t-body-sm t-muted">
            Full write-up: evaluation/results/2026-10-04-luganda-asr-smoke.md · Scripts: evaluation/luganda-asr/ · Run on {result.date}
          </p>
        </section>
      </main>
    </div>
  );
}
