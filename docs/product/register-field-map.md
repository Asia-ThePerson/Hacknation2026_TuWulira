# Register field map

Every field the tool can touch, and who is allowed to fill it. This is the "fixed list of answers" from the brief's glossary: if the tool can say anything, it cannot be checked for safety. Answers RQ4.3. Mirrors [app/shared/field-schemas.ts](../../app/shared/field-schemas.ts); change both together.

**TODO (RQ1.2, owner Beth):** check the field list, names and column numbers against the actual Uganda HMIS 031 outpatient register and its DHIS2 data elements. Column numbers come from the team's design (Figma, *Reference: Data requirements*); field names are working names, not official HMIS codes.

## Who may fill a field

| Level | Meaning |
|---|---|
| **AI may fill** | The tool fills it with no confirmation, because the value comes from the device, not from speech. |
| **AI drafts, clinician confirms** | The tool proposes a value from a fixed list or a checked range. The clinician must confirm or edit it before save. Low-confidence values are flagged. |
| **Clinician only** | The AI never proposes a value. The clinician types it, or dictates it and confirms the exact words. |

## Fields

"Filled when": *Intake* is the patient question set before the visit (no clinician present). *Consultation* is the in-clinic visit, where the nurse and clinician ask and enter these themselves. TuWulira's intake never asks for weight, temperature, diagnosis, treatment or referral out (PR7).

| Field | Filled when | HMIS 031 column | Level | Allowed values | Source of value | Notes |
|---|---|---|---|---|---|---|
| `visit_date` | Device | TODO | AI may fill | Date | Device clock |  |
| `record_id` | Device | n/a | AI may fill | Device-generated ID | Device | Used to stop duplicates on sync (RQ6.2) |
| `consent_recorded` | Intake (section 0) | n/a | AI may fill | `yes` only | Recorded spoken yes | No yes, no record (RQ5.1) |
| `age_years` | Intake (section 3) | 3 to 5 (exact column to check) | AI drafts, clinician confirms | 0 to 120 | Intake keypad or dictation | Under 5 changes which danger signs apply |
| `sex` | Intake (section 3) | 3 to 5 (exact column to check) | AI drafts, clinician confirms | `female`, `male` | Intake buttons or dictation |  |
| `village` | Intake (section 3) | 3 to 5 (exact column to check) | AI drafts, clinician confirms | Free text, copied word for word from what was said | Intake | Never inferred. Includes parish. |
| `attendance` | Intake (section 3) | 8 | AI drafts, clinician confirms | `new`, `re_attendance` | Intake buttons or dictation |  |
| `weight_kg` | Consultation | 6 | AI drafts, clinician confirms | 0.5 to 250 | Nurse types it, or dictates and confirms | Never asked at intake |
| `temperature_c` | Consultation | 6 | AI drafts, clinician confirms | 30.0 to 45.0 | Nurse types it, or dictates and confirms | Never asked at intake |
| `patient_reported_symptoms` | Intake (sections 4 and 5) | Consultation notes, not a column | AI drafts, clinician confirms | Fixed symptom list in field-schemas.ts | Intake | Shown under the heading "Patient reported". Never "findings". |
| `danger_sign_flag` | Intake (section 2) or consultation | n/a (urgent flag) | AI drafts, clinician confirms | Sourced danger-sign IDs in [rules/danger-signs.json](../../rules/danger-signs.json) | Intake buttons or dictation | Triggers "Tell the nurse now". Only a person can clear it. |
| `referral` | Consultation | 12 | AI drafts, clinician confirms | `none`, `referred` | Clinician dictation or pick | Never asked at intake. Where to refer is clinician only |
| `next_visit_date` | Consultation | TODO | AI drafts, clinician confirms | Date | Dictation | The only clinical detail that may reach an SMS, as a bare date |
| `diagnosis` | Consultation | 9 | Clinician only | HMIS 105 list (exact list still open), or clinician's own words | Clinician | Never asked at intake. Implies a diagnosis |
| `tests_and_results` | Consultation | TODO | Clinician only | Clinician's own words | Clinician |  |
| `treatment` | Consultation | 10 | Clinician only | Units x doses per day x days, or clinician's own words | Clinician | Never asked at intake. Implies a prescription |
| `referral_destination` | Consultation | 12 | Clinician only | Clinician's own words | Clinician |  |
| `clinician_name` | Consultation | TODO | Clinician only | Clinician's own words | Clinician |  |

## Intake fields not yet in field-schemas.ts

The question list ([config/questions.lg-UG.json](../../config/questions.lg-UG.json)) also collects these. Add them to [app/shared/field-schemas.ts](../../app/shared/field-schemas.ts) and the table above together.

| Field | Filled when | HMIS 031 column | Level | Notes |
|---|---|---|---|---|
| Patient name | Intake (section 3) | 2 | AI drafts, clerk confirms spelling | Copied word for word |
| Next of kin and phone | Intake (section 3) | 7 | AI drafts, clerk confirms | Phone is typed on the keypad |
| Referral in (referral note) | Intake (section 3) | 11 | AI drafts, clinician confirms | `yes`, `no` |
| Serial number | Device | 1 (to check) | AI may fill | Automatic; restarts monthly |
