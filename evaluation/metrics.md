# Metrics

| Metric | Definition | Target | Source of truth | RQ |
|---|---|---|---|---|
| Luganda WER | Word error rate on 20 to 30 synthetic clips, compared with a published benchmark (FLEURS or SALT) | TODO: set once a baseline is measured | evaluation/results | RQ3.1 |
| Lusoga WER | Same clips read in Lusoga, or a reasoned estimate if no speakers | Report, no target | evaluation/results | RQ3.3 |
| Field accuracy | Share of register fields filled with the correct value, after excluding flagged fields | TODO | evaluation/results | RQ4.3 |
| Symptom-label accuracy | On 20 to 30 labelled **synthetic** complaints, each output item from the understanding step (component 5) is scored correct, wrong, or "not sure" against the label a person wrote. Report all three counts, not one percentage | Report correct, wrong and "not sure" | evaluation/results | RQ3.2, RQ4.3 |
| Safe-failure rate | Of the outputs that would have been wrong, the share caught as "not sure" instead: not sure / (not sure + wrong). Shows whether the tool fails safely rather than guessing | Higher is better; no fixed target | evaluation/results | RQ4.2, RQ4.4 |
| Flag rate | Share of fields flagged for confirmation | TODO: too high wastes time, too low hides errors | evaluation/results | RQ4.2 |
| **Danger-sign sensitivity** | Share of danger-sign clips that trigger "Tell the nurse now". **Reported separately from overall accuracy.** | Aim for no misses on the test set | evaluation/results | RQ4.2 |
| Danger-sign false alarms | Share of clips with no danger sign that trigger it | Report | evaluation/results | RQ4.2 |
| Ask-a-person coverage | Share of failure clips (silence, crying, noise) that produce "Not sure. Please ask a person." and save nothing | All of them | evaluation/results | RQ4.4 |
| Hallucination check | Fields filled with a value nobody said | Zero | evaluation/results | Brief 06 |
| Model size | Total size on disk of all model files | Small enough to side-load (state the number) | models/README.md | RQ6.1 |
| RAM | Peak RAM during transcription on the cheapest available Android | TODO | evaluation/results | RQ6.1 |
| Latency | Seconds to transcribe and extract 10 s of audio, same device | TODO | evaluation/results | RQ6.1 |
| Battery | Battery used by a morning of intake sessions | Report | evaluation/results | RQ6.3 |
| Sync integrity | Duplicate or lost records after N offline days | Zero | evaluation/results | RQ6.2 |
