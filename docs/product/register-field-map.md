# Register field map

Every field the tool can touch, and who is allowed to fill it. This is the "fixed list of answers" from the brief's glossary: if the tool can say anything, it cannot be checked for safety. Answers RQ4.3. Mirrors [app/shared/field-schemas.ts](../../app/shared/field-schemas.ts); change both together.

**TODO (RQ1.2, owner Beth):** check the field list and names against the actual Uganda HMIS outpatient register and its DHIS2 data elements. The field names below are working names, not official HMIS codes.

## Who may fill a field

| Level | Meaning |
|---|---|
| **AI may fill** | The tool fills it with no confirmation, because the value comes from the device, not from speech. |
| **AI drafts, clinician confirms** | The tool proposes a value from a fixed list or a checked range. The clinician must confirm or edit it before save. Low-confidence values are flagged. |
| **Clinician only** | The AI never proposes a value. The clinician types it, or dictates it and confirms the exact words. |

## Fields

| Field | Level | Allowed values | Source of value | Notes |
|---|---|---|---|---|
| `visit_date` | AI may fill | Date | Device clock | |
| `record_id` | AI may fill | Device-generated ID | Device | Used to stop duplicates on sync (RQ6.2) |
| `consent_recorded` | AI may fill | `yes` only | Recorded spoken yes | No yes, no record (RQ5.1) |
| `age_years` | AI drafts, clinician confirms | 0 to 120 | Intake or dictation | Under 5 changes which danger signs apply |
| `sex` | AI drafts, clinician confirms | `female`, `male` | Intake or dictation | |
| `attendance` | AI drafts, clinician confirms | `new`, `re_attendance` | Dictation | |
| `village` | AI drafts, clinician confirms | Free text, copied word for word from what was said | Intake | Never inferred |
| `weight_kg` | AI drafts, clinician confirms | 0.5 to 250 | Dictation | |
| `temperature_c` | AI drafts, clinician confirms | 30.0 to 45.0 | Dictation | |
| `patient_reported_symptoms` | AI drafts, clinician confirms | Fixed symptom list in field-schemas.ts | Intake | Shown under the heading "Patient reported". Never "findings". |
| `danger_sign_flag` | AI drafts, clinician confirms | Sourced danger-sign IDs | Intake or dictation | Triggers "Tell the nurse now". Only a person can clear it. |
| `referral` | AI drafts, clinician confirms | `none`, `referred` | Dictation | Where to refer is clinician only |
| `next_visit_date` | AI drafts, clinician confirms | Date | Dictation | The only clinical detail that may reach an SMS, as a bare date |
| `diagnosis` | Clinician only | Clinician's own words | Clinician | Implies a diagnosis |
| `tests_and_results` | Clinician only | Clinician's own words | Clinician | |
| `treatment` | Clinician only | Clinician's own words | Clinician | Implies a prescription |
| `referral_destination` | Clinician only | Clinician's own words | Clinician | |
| `clinician_name` | Clinician only | Clinician's own words | Clinician | |
