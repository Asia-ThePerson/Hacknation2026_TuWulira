// Step 2 of the smoke test: pass the raw speech-recognition output through TuWulira's real safety layer.
// Reads asr-output.json (written by run_asr.py, no safety logic there), scores it against the official
// Common Voice transcripts, and writes the dated result file. Run from the repo root:
//   node evaluation/luganda-asr/apply_safety.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { ASK_A_PERSON, assessTurn, CONFIDENCE_THRESHOLD } from '../../app/safety/index.ts';

const here = new URL('.', import.meta.url);
const root = new URL('../../', import.meta.url);
const asr = JSON.parse(readFileSync(new URL('asr-output.json', here), 'utf8'));
const offline = JSON.parse(readFileSync(new URL('asr-output-offline.json', here), 'utf8'));

// Official transcripts, copied from Common Voice (common-voice-clips.tsv). Never translated.
const manifest = readFileSync(new URL('common-voice-clips.tsv', here), 'utf8').trim().split('\n');
const cols = manifest[0].split('\t');
const official: Record<string, Record<string, string>> = Object.fromEntries(
  manifest.slice(1).map((line) => {
    const v = line.split('\t');
    return [v[0], Object.fromEntries(cols.map((c, i) => [c, v[i]]))];
  }),
);

// Word error rate: same normalisation for both sides (lower case, punctuation removed, apostrophes kept).
const words = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}' ]+/gu, ' ').split(/\s+/).filter(Boolean);
function distance<T>(a: T[], b: T[]) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}
const round = (x: number) => Math.round(x * 1000) / 1000;

const SOURCE: Record<string, string> = {
  'common_voice_lg_23704551.noisy.real.wav': 'common_voice_lg_23704551.mp3',
};

const rows = asr.results.map((r: { clip: string; kind: string; transcript: string; confidence: number }) => {
  const ref = official[r.clip]?.official_transcript ?? (SOURCE[r.clip] ? official[SOURCE[r.clip]].official_transcript : null);
  const safety = assessTurn({ transcript: r.transcript, confidence: r.confidence });
  const usable = r.kind === 'common_voice_test';
  const row: Record<string, unknown> = { ...r, official_transcript: ref };
  if (ref) {
    const ref_w = words(ref);
    const hyp_w = words(r.transcript);
    const wer = distance(ref_w, hyp_w) / ref_w.length;
    const cer = distance([...ref_w.join(' ')], [...hyp_w.join(' ')]) / ref_w.join(' ').length;
    row.word_errors = distance(ref_w, hyp_w);
    row.reference_words = ref_w.length;
    row.wer = round(wer);
    row.cer = round(cer);
    row.verdict = wer === 0 ? 'correct' : wer <= 0.25 ? 'close' : 'wrong';
  }
  if (r.kind === 'synthetic_silence') row.verdict = r.transcript ? 'invented words from silence' : 'nothing heard';
  row.tuwulira_safety = safety.kind === 'ask_person' ? `ask_person: "${ASK_A_PERSON}"` : safety.kind;
  row.expected_safety = usable ? 'ok (usable speech)' : 'ask_person (unusable audio)';
  row.safety_as_expected = usable ? safety.kind !== 'ask_person' : safety.kind === 'ask_person';
  return row;
});

const real = rows.filter((r: Record<string, unknown>) => r.kind === 'common_voice_test');
const totalErr = real.reduce((s: number, r: Record<string, number>) => s + r.word_errors, 0);
const totalRef = real.reduce((s: number, r: Record<string, number>) => s + r.reference_words, 0);

const result = {
  title: 'Luganda speech-recognition smoke test (3 Common Voice clips + 2 failure clips)',
  date: '2026-10-04',
  status: 'Small hackathon evaluation. NOT clinical validation. 3 real clips is far too few to estimate accuracy.',
  dataset: {
    name: 'Mozilla Common Voice Corpus 17.0, Luganda (lg), test split',
    licence: 'CC0-1.0',
    source: 'https://huggingface.co/datasets/0x3/common_voice_17_0 (unofficial mirror of https://commonvoice.mozilla.org)',
    clip_list: 'evaluation/luganda-asr/common-voice-clips.tsv (clip IDs, official transcripts, SHA-256)',
    audio: 'Local only, never committed or deployed: resources/datasets/raw/common-voice-lg/ (gitignored). Re-download with evaluation/luganda-asr/fetch_clips.py.',
    note: 'Only 3 clips were downloaded (HTTP range request on the first 2 MB of the test archive). Transcripts copied exactly; no Luganda was written or translated by the team.',
  },
  model: {
    name: asr.model,
    revision: asr.revision,
    base: 'openai/whisper-tiny, fine-tuned for Luganda (model card: Common Voice 16.1 and FLEURS)',
    licence: 'Apache-2.0',
    parameters: asr.parameters,
    weights_mb_on_disk: asr.weights_mb_on_disk,
    precision: asr.precision,
  },
  safety_layer: { code: 'app/safety/index.ts assessTurn()', confidence_threshold: CONFIDENCE_THRESHOLD, rule: 'empty transcript or confidence below threshold -> "Not sure. Please ask a person."' },
  summary: {
    real_clips_word_errors: `${totalErr} of ${totalRef} words`,
    real_clips_wer: round(totalErr / totalRef),
    exact_matches: real.filter((r: Record<string, unknown>) => r.verdict === 'correct').length,
    failure_clips_caught_by_safety: rows.filter((r: Record<string, unknown>) => r.kind !== 'common_voice_test' && r.safety_as_expected).length + ' of 2',
    model_invented_words_on_failure_clips: rows.filter((r: Record<string, unknown>) => r.kind !== 'common_voice_test' && r.transcript).length + ' of 2',
    offline_run_identical: JSON.stringify(asr.results.map((r: { transcript: string }) => r.transcript)) === JSON.stringify(offline.results.map((r: { transcript: string }) => r.transcript)),
  },
  runtime: {
    machine: asr.machine,
    software: asr.software,
    model_load_seconds: asr.model_load_seconds,
    process_memory_mb: { before_model: asr.rss_before_load_mb, after_model_load_peak: asr.peak_rss_during_load_mb, peak_during_transcription: Math.max(...asr.results.map((r: { peak_rss_mb: number }) => r.peak_rss_mb)) },
    memory_note: 'Whole Python + PyTorch process on a laptop, not phone RAM. The model itself added about ' + Math.round(asr.peak_rss_during_load_mb - asr.rss_before_load_mb) + ' MB.',
    decoding: asr.decoding,
  },
  results: rows,
};

const out = new URL('evaluation/results/2026-10-04-luganda-asr-smoke.json', root);
writeFileSync(out, JSON.stringify(result, null, 2) + '\n');
for (const r of rows) console.log(`${String(r.clip).padEnd(34)} ${String(r.verdict ?? '').padEnd(28)} conf ${r.confidence}  -> ${r.tuwulira_safety}  ${r.safety_as_expected ? 'as expected' : 'NOT as expected'}`);
console.log(JSON.stringify(result.summary));
