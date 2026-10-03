# Evaluation

What we measure, on what, and where the results go. Proof it works is a brief requirement (05), and "Evidence it works" is 15% of the score.

## What we measure

See [metrics.md](metrics.md). In short: speech accuracy (WER), field accuracy, flag rate, danger-sign sensitivity (reported on its own), "ask a person" coverage on failure clips, model size, RAM, latency and battery.

## Test sets

[test-sets/](test-sets/) holds **synthetic** clips and transcripts only. Every file is labelled synthetic (see that folder's README). Required edge-case clips (CHECKLIST F, Safety edge cases): silence, crying child, Luganda-English code-switching, a danger word said indirectly, and an unknown local illness term.

## Results

[results/](results/) holds one dated file per run: `YYYY-MM-DD-<what>.md`. Each records the model and version, the device, the test set, the numbers, and anything that went wrong. **The README and video quote only numbers that appear in a results file.**
