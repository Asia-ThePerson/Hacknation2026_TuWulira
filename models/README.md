# Models

Which models ship on the intake phone (the clinic device runs no AI, D33), why, and how big they are. Size targets: [data-architecture.md](../docs/product/data-architecture.md) (Ears under ~120 MB int8, labeler under 5 MB, bundle under ~160 MB, peak RAM under ~300 MB). The brief requires model files small enough to side-load or send over a weak connection (rule 06), so **size, RAM and latency are measured, never estimated** (RQ6.1).

## Current choice

| Role | Model | Size on disk | RAM | Latency | Card | Status |
|---|---|---|---|---|---|---|
| Speech recognition (Luganda) | TODO: pick from MMS / Sunbird AI candidates in [resources/libraries/README.md](../resources/libraries/README.md). Tested so far: whisper-tiny-luganda-v2 | 151 MB float32 (tested candidate) | Phone: TODO | Laptop CPU: 2.6 to 4.9 s per 5 s clip ([smoke test](../evaluation/results/2026-10-04-luganda-asr-smoke.md)) | TODO | evaluating |
| Extractor | Rule-based, no model weights (decision D2 in [docs/product/prd.md](../docs/product/prd.md)) | under 1 MB of code | n/a | TODO | n/a | adopted |
| Danger-sign matcher | Rule-based list in [app/safety/danger-signs.ts](../app/safety/danger-signs.ts) | under 1 MB | n/a | TODO | n/a | adopted |

Rejected: Gemma 4 E2B (needs about 2.4 GB RAM and a 4 GB phone; see the libraries registry).

## Quantization notes

TODO: record the quantization method, the size before and after, and the WER before and after on the same clips. Compare with the CottonAce precedent (268 MB to 5 MB, finding R4).

## Getting the weights

Weights are not committed. Run `scripts/fetch-models` to download them into `models/weights/` (gitignored).

## Model cards

One file per model in [cards/](cards/): source, license, size on disk, RAM, latency on the cheapest available Android, languages covered, and known failure modes (silence, noise, code-switching, children's and older voices).
