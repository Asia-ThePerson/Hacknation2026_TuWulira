# Model cards

One card per model that ships or is seriously evaluated. Copy this outline:

```markdown
# <Model name>
- Source and link:
- License:
- Version / checkpoint:
- Size on disk (quantized):
- RAM at runtime:
- Latency per 10 s of audio, on <device name>:
- Battery use per morning of sessions:
- Languages covered (Luganda? Lusoga?):
- Luganda WER: ours on N clips / published benchmark:
- Known failure modes:
- What it was not trained on:
```

Every number must match a file in [evaluation/results/](../../evaluation/results/).
