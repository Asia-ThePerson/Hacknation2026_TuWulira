# Metrics

| Metric | Definition | Target | Source of truth | RQ |
|---|---|---|---|---|
| Luganda WER | Word error rate on 20 to 30 synthetic clips, compared with a published benchmark (FLEURS or SALT) | TODO: set once a baseline is measured | eval/results | RQ3.1 |
| Lusoga WER | Same clips read in Lusoga, or a reasoned estimate if no speakers | Report, no target | eval/results | RQ3.3 |
| Field accuracy | Share of register fields filled with the correct value, after excluding flagged fields | TODO | eval/results | RQ4.3 |
| Flag rate | Share of fields flagged for confirmation | TODO: too high wastes time, too low hides errors | eval/results | RQ4.2 |
| **Danger-sign sensitivity** | Share of danger-sign clips that trigger "Tell the nurse now". **Reported separately from overall accuracy.** | Aim for no misses on the test set | eval/results | RQ4.2 |
| Danger-sign false alarms | Share of clips with no danger sign that trigger it | Report | eval/results | RQ4.2 |
| Ask-a-person coverage | Share of failure clips (silence, crying, noise) that produce "Not sure. Please ask a person." and save nothing | All of them | eval/results | RQ4.4 |
| Hallucination check | Fields filled with a value nobody said | Zero | eval/results | Brief 06 |
| Model size | Total size on disk of all model files | Small enough to side-load (state the number) | models/README.md | RQ6.1 |
| RAM | Peak RAM during transcription on the cheapest available Android | TODO | eval/results | RQ6.1 |
| Latency | Seconds to transcribe and extract 10 s of audio, same device | TODO | eval/results | RQ6.1 |
| Battery | Battery used by a morning of intake sessions | Report | eval/results | RQ6.3 |
| Sync integrity | Duplicate or lost records after N offline days | Zero | eval/results | RQ6.2 |
