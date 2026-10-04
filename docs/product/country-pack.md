# Country pack

What changes when TuWulira moves to a new country or language. Answers RQ7.3. The landscape review notes DHIS2 is used in more than 70 countries, so a new country is mostly a file swap, not new code (R5, PR16).

## The five parts that change

| Part | Uganda (current) | What to swap | Where in the repo |
|---|---|---|---|
| Question file | Luganda and English question list (draft) | One JSON file per language and country: every question, both texts, audio file, answer type, branching and target register column | [config/questions.lg-UG.json](../../config/questions.lg-UG.json) |
| Prompts and strings | Luganda and English (Luganda not yet written or recorded) | Recorded audio prompts and on-screen strings, written and recorded by native speakers | `config/audio/`, `app/shared/i18n/` |
| Speech model | Luganda (candidates: Meta MMS or a Sunbird AI model; see [models/README.md](../../models/README.md)) | A small speech model for the new language, with a measured WER on a public benchmark (for example FLEURS) and on 20 to 30 local clips | `models/`, `models/cards/` |
| Register map | Uganda HMIS 031 OPD register and HMIS 105 (to verify, RQ1.2) | The country's register columns, diagnosis list and DHIS2 data elements | `app/shared/field-schemas.ts`, [register-field-map.md](register-field-map.md) |
| Danger-sign list | WHO IMCI, Uganda Clinical Guidelines, WHO maternal danger signs | The country's own clinical guidelines, plus WHO lists. Never invented. | [rules/danger-signs.json](../../rules/danger-signs.json) |

## What stays the same

The safety layer logic, the "ask a person" path, store-and-forward, the hub-and-spokes device model, and the privacy rules (SMS minimum, consent as a recorded spoken yes).

## Checklist for a new country

- [ ] Question file written, with every question mapped to a register column or "consultation"
- [ ] Speech model chosen, size and WER measured
- [ ] Prompts recorded and checked by native speakers
- [ ] Register fields mapped and each field given a fill level
- [ ] Danger-sign list sourced and cited
- [ ] Data protection law read for consent and storage
- [ ] Synthetic test set built, including silence, crying and code-switching clips

## Regulator path (what happens next)

Penda Health's approvals in Kenya (ministry, Digital Health Agency, ethics board) are our precedent (RQ7.1, R2). TODO: name the equivalent Ugandan bodies before the video.
