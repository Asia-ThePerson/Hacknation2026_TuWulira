# config

The question list and its audio prompts (component 2 in the [README](../README.md), PR16 in the [PRD](../docs/product/prd.md)). One JSON file per language and country. Changing a question, or adding a language, means editing or adding a file here, not changing code.

| Path | What |
|---|---|
| [questions.lg-UG.json](questions.lg-UG.json) | Luganda, Uganda. Every question: id, section, Luganda text, English text, audio file, answer type, next-question rule, target field |
| [hmis105-diagnoses.json](hmis105-diagnoses.json) | Official HMIS 105 (print version September 2019) section 1.3 diagnosis list with codes, plus age bands and attendance and referral codes. Used for the clinician's pick-list and the tally |
| `audio/lg-UG/` | Recorded Luganda prompts, one file per question, named by question id. Not yet recorded. |

## Rules for editing

- `textLg` stays empty until a native Luganda speaker writes it. Do not machine-translate. The app falls back to English text when a Luganda string is empty.
- `audio` names the prompt file. The file is added only once a native speaker has recorded it.
- `target` is an HMIS 031 column, `consultation`, or a flag the app uses (`consent`, `dangerSet`, `urgent`). Column numbers must match [register-field-map.md](../docs/product/register-field-map.md); change both together.
- Questions in section 6 are `private: true` and are button-only, never spoken (PR15).
- A new country is a new file, plus its own [rules](../rules/) and register map ([country pack](../docs/product/country-pack.md)).
