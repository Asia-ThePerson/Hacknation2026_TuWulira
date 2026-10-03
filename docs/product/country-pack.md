# Country pack

What changes when [PRODUCT NAME] moves to a new country or language. Answers RQ7.3. The landscape review notes DHIS2 is used in more than 70 countries, so a new country is mostly a schema swap (R5).

## The four parts that change

| Part | Uganda (current) | What to swap | Where in the repo |
|---|---|---|---|
| Speech model | Luganda (model TBD, see [models/README.md](../../models/README.md)) | A small speech model for the new language, with a measured WER on a public benchmark (for example FLEURS) and on 20 to 30 local clips | `models/`, `models/cards/` |
| Prompts and strings | Luganda + English | Recorded intake prompts and on-screen strings, written with native speakers | `app/shared/i18n/` |
| Form mapping | Uganda HMIS outpatient register (to verify, RQ1.2) | The country's register fields and DHIS2 data elements | `app/shared/field-schemas.ts`, [register-field-map.md](register-field-map.md) |
| Guideline source and danger-sign list | WHO IMCI, Uganda Clinical Guidelines, WHO maternal danger signs | The country's own clinical guidelines, plus WHO lists. Never invented. | `app/safety/danger-signs.ts` |

## What stays the same

The safety layer logic, the "ask a person" path, store-and-forward, the hub-and-spokes device model, and the privacy rules (SMS minimum, consent as a recorded spoken yes).

## Checklist for a new country

- [ ] Speech model chosen, size and WER measured
- [ ] Prompts recorded and checked by native speakers
- [ ] Register fields mapped and each field given a fill level
- [ ] Danger-sign list sourced and cited
- [ ] Data protection law read for consent and storage
- [ ] Synthetic test set built, including silence, crying and code-switching clips

## Regulator path (what happens next)

Penda Health's approvals in Kenya (ministry, Digital Health Agency, ethics board) are our precedent (RQ7.1, R2). TODO: name the equivalent Ugandan bodies before the video.
