"""Speech recognition only: run a small Luganda model on the test clips and save what it heard.

This script knows nothing about TuWulira's safety rules. It writes the raw model output (transcript,
a confidence score, timing, memory) to asr-output.json. apply_safety.ts then passes that output through
the app's real safety layer (app/safety/index.ts). Keeping the two apart mirrors the app design.

Also creates the two failure clips if they do not exist yet:
  evaluation/test-sets/synthetic_silence_01.wav   5 s of near-silence (quiet-room noise at -60 dBFS), purely generated, committed
  resources/datasets/raw/common-voice-lg/common_voice_lg_23704551.noisy.real.wav
      a real Common Voice clip with loud white noise added (SNR -5 dB). It still holds a real voice, so it is
      local only (gitignored), like the clips themselves. Get the clips first with fetch_clips.py.

Run from the repo root (see README.md in this folder for setup):
  python evaluation/luganda-asr/run_asr.py              first run downloads the model (151 MB) once
  python evaluation/luganda-asr/run_asr.py --offline    same run with all network access switched off
"""
import json
import os
import platform
import sys
import threading
import time
from pathlib import Path

OFFLINE = "--offline" in sys.argv
if OFFLINE:  # must be set before transformers is imported
    os.environ["HF_HUB_OFFLINE"] = "1"
    os.environ["TRANSFORMERS_OFFLINE"] = "1"

import numpy as np
import psutil
import soundfile as sf
import torch
import torchaudio.functional as AF
import transformers
from transformers import WhisperForConditionalGeneration, WhisperProcessor

MODEL = "allandclive/whisper-tiny-luganda-v2"
REVISION = "7c130c391d20243f879596898a2b52b308ab87e2"  # pinned so the result can be reproduced
SR = 16000
ROOT = Path(__file__).resolve().parents[2]
LIST = Path(__file__).resolve().parent / "common-voice-clips.tsv"  # committed: clip IDs and transcripts
CLIPS = ROOT / "resources/datasets/raw/common-voice-lg"  # gitignored: real voices, local only
TESTS = ROOT / "evaluation/test-sets"
OUT = Path(__file__).resolve().parent / ("asr-output-offline.json" if OFFLINE else "asr-output.json")


def load(path):
    audio, sr = sf.read(str(path), dtype="float32")
    if audio.ndim > 1:
        audio = audio.mean(axis=1)
    if sr != SR:
        audio = AF.resample(torch.from_numpy(audio), sr, SR).numpy()
    return audio


def make_failure_clips():
    silence = TESTS / "synthetic_silence_01.wav"
    noisy = CLIPS / "common_voice_lg_23704551.noisy.real.wav"
    rng = np.random.default_rng(0)  # fixed seed: same files every time
    if not silence.exists():
        sf.write(str(silence), (rng.standard_normal(SR * 5) * 10 ** (-60 / 20)).astype("float32"), SR, subtype="PCM_16")
    if not noisy.exists():
        speech = load(CLIPS / "common_voice_lg_23704551.mp3")
        noise = rng.standard_normal(len(speech)).astype("float32")
        snr_db = -5.0
        noise *= np.sqrt(np.mean(speech**2) / (np.mean(noise**2) * 10 ** (snr_db / 10)))
        mix = speech + noise
        sf.write(str(noisy), (mix / max(1.0, np.abs(mix).max())).astype("float32"), SR, subtype="PCM_16")
    return silence, noisy


class PeakRSS:
    """Samples this process's memory every 5 ms while a block runs."""

    def __enter__(self):
        self.proc, self.peak, self.run = psutil.Process(), 0, True
        self.t = threading.Thread(target=self._poll, daemon=True)
        self.t.start()
        return self

    def _poll(self):
        while self.run:
            self.peak = max(self.peak, self.proc.memory_info().rss)
            time.sleep(0.005)

    def __exit__(self, *a):
        self.run = False
        self.t.join()


def main():
    torch.manual_seed(0)
    torch.set_num_threads(4)
    silence, noisy = make_failure_clips()
    names = [line.split("	")[0] for line in LIST.read_text(encoding="utf-8").splitlines()[1:]]
    missing = [n for n in names if not (CLIPS / n).exists()]
    if missing:
        raise SystemExit(f"Missing local clips {missing}. Run: python evaluation/luganda-asr/fetch_clips.py")
    items = [(n, "common_voice_test", CLIPS / n) for n in names]
    items += [(silence.name, "synthetic_silence", silence), (noisy.name, "real_clip_plus_noise", noisy)]

    rss_before = psutil.Process().memory_info().rss
    t0 = time.perf_counter()
    with PeakRSS() as load_mem:
        processor = WhisperProcessor.from_pretrained(MODEL, revision=REVISION)
        model = WhisperForConditionalGeneration.from_pretrained(MODEL, revision=REVISION).eval()
    load_s = time.perf_counter() - t0

    from huggingface_hub import snapshot_download

    snap = Path(snapshot_download(MODEL, revision=REVISION, local_files_only=True))
    weights_bytes = sum(f.stat().st_size for f in snap.glob("*.safetensors"))
    params = sum(p.numel() for p in model.parameters())

    results = []
    for name, kind, path in items:
        audio = load(path)
        feats = processor(audio, sampling_rate=SR, return_tensors="pt").input_features
        t = time.perf_counter()
        with PeakRSS() as mem, torch.inference_mode():
            gen = model.generate(feats, max_new_tokens=96, num_beams=1, do_sample=False, output_scores=True, return_dict_in_generate=True)
        secs = time.perf_counter() - t
        scores = model.compute_transition_scores(gen.sequences, gen.scores, normalize_logits=True)[0]
        tokens = gen.sequences[0, -len(scores):]
        keep = [i for i, tok in enumerate(tokens.tolist()) if tok not in processor.tokenizer.all_special_ids]
        # Confidence: geometric mean of the model's own probability for each word-piece it produced.
        conf = float(torch.exp(scores[keep].mean())) if keep else 0.0
        text = processor.batch_decode(gen.sequences, skip_special_tokens=True)[0].strip()
        results.append(
            {
                "clip": name,
                "kind": kind,
                "audio_seconds": round(len(audio) / SR, 2),
                "transcript": text,
                "confidence": round(conf, 3),
                "processing_seconds": round(secs, 3),
                "peak_rss_mb": round(mem.peak / 1e6, 1),
            }
        )
        print(f"{name:40s} {secs:5.2f}s  conf {conf:.2f}  {text!r}")

    out = {
        "what": "Raw speech-recognition output only. No TuWulira safety logic applied here.",
        "model": MODEL,
        "revision": REVISION,
        "parameters": params,
        "weights_mb_on_disk": round(weights_bytes / 1e6, 1),
        "precision": "float32 (not quantized)",
        "offline_mode": OFFLINE,
        "model_load_seconds": round(load_s, 2),
        "rss_before_load_mb": round(rss_before / 1e6, 1),
        "peak_rss_during_load_mb": round(load_mem.peak / 1e6, 1),
        "decoding": "greedy, max 96 new tokens, no language model",
        "machine": {
            "os": platform.platform(),
            "cpu": platform.processor(),
            "logical_cpus": psutil.cpu_count(),
            "ram_gb": round(psutil.virtual_memory().total / 1e9, 1),
            "torch_threads": torch.get_num_threads(),
        },
        "software": {"python": platform.python_version(), "torch": torch.__version__, "transformers": transformers.__version__},
        "results": results,
    }
    OUT.write_text(json.dumps(out, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"wrote {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
