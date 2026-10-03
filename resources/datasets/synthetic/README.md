# Synthetic data

**Every file in this folder is synthetic.** No real patient, clinician or recording is ever stored here.

Rules:
- File names start with `synthetic_`, or the file contains the word `SYNTHETIC` in its first lines (a header row, comment or `"synthetic": true` field). `scripts/check` enforces this.
- Each file says how it was made (written by the team, generated, recorded by a team member reading a script).
- Never copy real records here, even with names removed.
