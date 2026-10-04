# Luganda speech-recognition smoke test

A small, repeatable test: 3 real Luganda clips and 2 failure clips through a small Luganda speech model, then through TuWulira's own safety layer. Result: [results/2026-10-04-luganda-asr-smoke.md](../results/2026-10-04-luganda-asr-smoke.md). **Hackathon evidence, not clinical validation.**

| File | Step |
|---|---|
| [common-voice-clips.tsv](common-voice-clips.tsv) | The 3 clips: Common Voice clip ID, official transcript (copied exactly), speaker gender and age band, votes, SHA-256 |
| [fetch_clips.py](fetch_clips.py) | Re-downloads those exact clips from Common Voice 17.0 (CC0) into `resources/datasets/raw/common-voice-lg/` (gitignored), checking transcripts and checksums. About 6 MB, never the full dataset. Standard library only |
| [run_asr.py](run_asr.py) | Speech recognition only. Makes the failure clips (the silence clip in [../test-sets/](../test-sets/); the noisy clip next to the real clips, local only), runs the model, writes [asr-output.json](asr-output.json) (and [asr-output-offline.json](asr-output-offline.json) with `--offline`) |
| [apply_safety.ts](apply_safety.ts) | Passes that output through `assessTurn()` from [app/safety/index.ts](../../app/safety/index.ts), scores words against the official transcripts, writes the dated result JSON |
| [requirements.txt](requirements.txt) | Python packages for `run_asr.py` |

## Real voices stay local

The Common Voice clips are real volunteers' voices (public domain, CC0, but still people). Following the repo rule that recordings of real people never go in the repo, the audio and the noisy copy made from it live only in `resources/datasets/raw/common-voice-lg/`, which `.gitignore` excludes, and are not bundled into the web app. Clip IDs, official transcripts, checksums and all results are committed, so the test can be repeated exactly.

Source: Mozilla Common Voice Corpus 17.0, Luganda (`lg`), test split, licence CC0-1.0, fetched from https://huggingface.co/datasets/0x3/common_voice_17_0 (an unofficial mirror of https://commonvoice.mozilla.org; Mozilla's own copies need an account). What it does not cover: read-aloud sentences only, not people describing symptoms; three speakers in their twenties; quiet recordings, not a clinic waiting room.

## Re-run

From the repo root. Python 3.9 or newer, Node 22.6 or newer. The model (151 MB) downloads once into the Hugging Face cache; model weights are never committed.

```bash
python evaluation/luganda-asr/fetch_clips.py           # local copies of the 3 clips (gitignored)
python -m venv ~/tuwulira-asr                         # outside the repo, so nothing gets committed
~/tuwulira-asr/Scripts/pip install torch torchaudio --index-url https://download.pytorch.org/whl/cpu
~/tuwulira-asr/Scripts/pip install -r evaluation/luganda-asr/requirements.txt
~/tuwulira-asr/Scripts/python evaluation/luganda-asr/run_asr.py
~/tuwulira-asr/Scripts/python evaluation/luganda-asr/run_asr.py --offline   # network switched off
node evaluation/luganda-asr/apply_safety.ts
```

On macOS or Linux use `~/tuwulira-asr/bin/` instead of `~/tuwulira-asr/Scripts/`. The model goes to the Hugging Face cache in your home folder, also outside the repo. On Windows, keep the folder path short (as above) to avoid a long-path install error.

Timing and memory change from machine to machine; the result file records the machine used.
