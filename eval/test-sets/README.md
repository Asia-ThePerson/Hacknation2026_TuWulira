# Test sets

**SYNTHETIC ONLY.** Every clip and transcript here was written or recorded by the team for testing. None comes from a real patient or clinic.

Labelling rule (checked by `scripts/check`): every file name starts with `synthetic_`, or, for text files, the word `SYNTHETIC` appears in the first lines.

Planned files:

| File | What it is | Checklist |
|---|---|---|
| `synthetic_intake_lg_01.wav` ... | Luganda intake answers read from a script | F, C4 |
| `synthetic_dictation_01.wav` ... | Clinician dictation from a script | F |
| `synthetic_silence_01.wav` | Silence | F, D2 |
| `synthetic_crying_01.wav` | Crying child (sound effect with a license we can use) | F, D2 |
| `synthetic_codeswitch_01.wav` | Luganda and English mixed | F (RQ3.2) |
| `synthetic_danger_indirect_01.wav` | Danger sign said indirectly | F, D4 |
| `synthetic_unknown_term_01.wav` | A local illness term with no clean clinical match | F (RQ3.4) |
| `synthetic_transcripts.csv` | Reference transcripts and expected field values | F |
