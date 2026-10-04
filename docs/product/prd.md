# Product requirements: TuWulira

Status: draft for the Hack-Nation weekend, 3 to 4 October 2026. Last updated 4 October 2026. Team: Hotline Bling. Every requirement (PR#) cites the finding (R#) or research question (RQ#) it rests on. When an RQ is answered, update the requirement and its CHECKLIST.md item.

Source of truth for flows: [Figma, TuWulira Project hub, System Diagram page](https://www.figma.com/design/46MiynCpDjTcAiYoqmiaEr/TuWulira---Project-hub?node-id=0-1).

## 1. Summary

TuWulira is an offline, Luganda-first intake and record-keeping tool for rural primary care clinics in Uganda. Before the visit, it asks a fixed question set, captures one spoken answer, flags danger signs, and produces a patient-reported card for the clinician. During the visit, the clinician can dictate the encounter (scribe) and confirm drafted register fields. The same answers pre-fill the OPD register (HMIS 031) and tally sheet.

## 2. Problem statement

Draft, to finish once RQ1.1 is answered:

> Because of TuWulira, patients at rural Ugandan health centres will have their symptoms, danger signs and register details captured in Luganda before they see the clinician, which would otherwise happen late, in a rushed verbal history, or not at all; we know because [TODO: cite a Service Delivery Indicators, DHS or WHO GHO figure with year and country].

What we know so far: the brief names "burdensome record-keeping" as a reason clinicians cannot give each patient enough attention (Annex A.1). Penda Health's largest gain was a 32% drop in history-taking errors (R2). Documentation time at Ugandan health centres is not yet measured in our evidence (RQ1.1 open).

## 3. Goals and non-goals

**Goals**

1. Patients with danger signs are seen first.
2. The clinician starts the consultation already knowing the main problem, duration, symptoms, medicines taken and allergies.
3. Register and tally fields the patient can answer are captured once, not re-written by hand (measure in evaluation; RQ1.1, RQ1.3).
4. The core works offline, in Luganda, on a device the clinic already has.
5. Nothing appears in a record that nobody said.

**Non-goals**

- Diagnosis, triage scoring, prescription or treatment advice by AI.
- Interpreting images.
- Measuring vitals (the nurse measures weight and temperature).
- Replacing the clinician's own questions or examination.
- Replacing DHIS2 or the paper register where it is still required.
- Sending health details by SMS.
- Running the model on the patient's own basic phone (the patient reaches the clinic by voice callback, SMS or in person).
- Paths A (remote phone) and C (paper form) as working builds this weekend; they are design only.

## 4. Users

| User | Context | Needs from TuWulira |
|---|---|---|
| Patient or caregiver (Noor) | Speaks Luganda; owns a basic phone shared with the household; low digital literacy | Answer in Luganda, by voice or buttons, without reading; privacy in a crowded room; know answers stay with clinic staff; no health details on a shared phone |
| Clerk | Front desk | Start a session, confirm name spelling, pull up cards, check the register row |
| Triage nurse | Sees patients before the clinician | Urgent patients first; add weight and temperature |
| Clinician (clinical officer or nurse) | Overcrowded rural clinic, many patients, paper or DHIS2 registers (RQ1.2 open) | Readable card in seconds; record diagnosis, treatment and referral out; never lose control of the record |
| Records assistant | Compiles registers and reports | Accurate tallies; monthly HMIS 105 totals |
| Clinic staff who look after the shared device | Charge, unlock and hand over the device | Simple, robust, works with no signal |

## 5. Constraints (from the challenge brief)

- Runs on a device the user already has (clinic Android).
- Core feature works offline.
- Model files small enough to side-load or send over a weak connection.
- At least one interaction in a local language: **Luganda**.
- A person makes the final call; the tool flags what it is unsure of.

## 6. Three paths, one card

| Path | Where | Needs | Status this weekend |
|---|---|---|---|
| A. Remote | Patient's own basic phone (callback voice line or SMS) | Signal, plus an online IVR or SMS gateway | Design only |
| B. In clinic: kiosk or shared clinic phone | Clinic Android, runs fully offline | A charged device | **Prototype** |
| C. In clinic: paper form | Printed form (Luganda or English), photographed | Paper; phone optional | Design only |

## 7. User journey (Path B, prototype)

1. Patient arrives. The clerk checks for a visit code (Path A) or starts TuWulira on the clinic device.
2. Patient answers the question set with buttons and Luganda audio prompts. The main problem is one spoken answer.
3. Any danger-sign YES sends an urgent flag to triage immediately.
4. Card saved. Patient waits to be called.
5. Nurse sees urgent patients first and adds weight and temperature.
6. Clinician reads the card, takes their own history, and records diagnosis, treatment and referral.
7. Register row and tally update. Totals are exported for DHIS2.

## 8. Requirements

| ID | Requirement | Based on | Checklist |
|---|---|---|---|
| PR1 | The core flow (intake, card, save) works with airplane mode on. | Brief 06; R3, R4 | C.2, F.5 |
| PR2 | All models together are small enough to side-load; size, RAM and latency are measured on the cheapest Android we have. | Brief 06; RQ6.1; R3 | C.3, F.8 |
| PR3 | Intake runs in Luganda with a recorded prompt for every question, English text available, and one spoken answer for the main problem. | Brief 06; RQ3.1, RQ3.2 | C.4, F.1 |
| PR4 | The intake output is a card labelled "patient reported", never "findings", and appears beside, not instead of, the clinician's own questions. | RQ2.4; R2 | F.3, F.18 |
| PR5 | The understanding step and register pre-fill fill only fields defined in [register-field-map.md](register-field-map.md), using only values from fixed lists or validated ranges. | Brief glossary "fixed list of answers"; RQ4.3 | D.5 |
| PR6 | Any AI output below the confidence threshold is marked "not sure" or "unclear, clinician to ask" and is never guessed. | Brief 06 guardrail; RQ4.2 | F.4 |
| PR7 | Patient intake never asks for weight, temperature, diagnosis, treatment or referral out. These are filled during the in-clinic consultation: the nurse enters weight and temperature (typed, or dictated and confirmed); the clinician enters diagnosis, treatment and referral out. The AI never suggests a diagnosis or treatment. | RQ4.3; team rule | D.6 |
| PR8 | When the tool understands nothing (silence, crying child, unintelligible audio) or confidence is too low, it says "Not sure. Please ask a person." and hands over. | Brief 09 fail-safe; RQ4.4 | D.2 |
| PR9 | Danger signs are checked by rules, not AI. Any YES sets an urgent flag immediately and tells the patient "Tell the nurse now". Danger signs come only from WHO IMCI, Uganda Clinical Guidelines and WHO maternal danger signs. | RQ4.1, RQ4.2 | D.3, D.4 |
| PR10 | No question is asked and nothing is recorded before a recorded spoken yes. | RQ5.1 | D.8 |
| PR11 | Records queue on the device and sync when a signal appears, with no duplicates and no lost records. | Brief glossary "store-and-forward"; RQ6.2; R5 | F.6, F.7 |
| PR12 | Any SMS to a patient contains only a date and the clinic's name. (See open question 6 on the Path A danger-sign SMS.) | RQ5.2 | D.9 |
| PR13 | Only aggregate totals leave the clinic, mapped to DHIS2 data elements. No names or patient-level data. | R5; RQ1.2; RQ5.1 | F |
| PR14 | Every screen meets the inclusivity rules in [design-system.md](../design/design-system.md) (older users, low literacy, privacy in a crowded room). | RQ2.1, RQ2.3 | F.15, F.17 |
| PR15 | Private questions are button-only, never spoken. | RQ2.1 | F.16 |
| PR16 | The question list is one JSON file per language or country. Changing questions or adding a language needs no code change. | RQ7.3 | F |
| PR17 | Data is stored encrypted on the device, behind a staff PIN. Voice clips are deleted when the visit closes. | RQ5.1 | D.7 |
| PR18 | Patient answers pre-fill the OPD register row (HMIS 031) and tally, with CSV export. | RQ1.2; R5 | F |
| PR19 | The clinician can dictate the encounter. The scribe drafts only register fields from fixed lists or validated ranges; every drafted field is confirmed before save, and diagnosis and treatment are typed or confirmed word for word. | RQ4.3; R2 | F.2, F.4 |

## 9. Components (Path B prototype)

Numbers match the component table in the [README](../../README.md).

### Component 1: Patient screen (PR3, PR10, PR14, PR15)

- Plays a recorded Luganda prompt for every question; English available.
- Answer buttons: Yes / No / Not sure / Ask clinician, plus numeric entry for age and phone.
- Records one spoken answer for the main problem.
- Ends with a read-back: correct or change.
- Private questions (section 6 of the question set) are button-only, never spoken.

### Component 2: Question list (PR16)

- Single JSON file per language or country.
- Each question has: id, section, Luganda text, English text, audio file, answer type, next-question rule, and target field (HMIS 031 column or "consultation").
- Changing questions or adding a language requires no code change.

### Component 3: Danger-sign checker (PR9)

- Rule-based only.
- Asks the set that matches the patient: newborn under 2 months, child 2 months to 5 years, pregnancy, adult.
- Any YES (or "not sure" in pregnancy) sets an urgent flag immediately and tells the patient to go to the nurse now.

### Component 4: Speech-to-text (AI) (PR2, PR3, PR6, PR8)

- Runs on the device, offline, in Luganda.
- Returns a transcript and a confidence score.
- Below the threshold: asks once more. Still below: "unclear, clinician to ask". Never guesses.

### Component 5: Understanding (AI) (PR5, PR6)

- Input: Luganda transcript. Output: English items from a fixed symptom list, plus duration if mentioned.
- The original Luganda transcript is always shown under the English.
- Cannot output a diagnosis or any label outside the allowed list.
- Low confidence: "not sure".

### Component 6: Patient card (PR4)

- Order: urgent flags, main problem (English and Luganda), follow-ups, medicines and allergies, registration details.
- Header label: **PATIENT REPORTED**.
- "Not sure" and "unclear" items visibly marked.

### Component 7: Staff screen (PR7, PR17)

- Behind a staff PIN.
- Queue sorted urgent first, then by arrival time.
- Nurse: enters weight (kg) and temperature.
- Clinician: picks a diagnosis from the HMIS 105 section 1.3 list ([config/hmis105-diagnoses.json](../../config/hmis105-diagnoses.json), print version September 2019), enters treatment as units x doses per day x days, and the referral-out number. The form marks no condition as notifiable, so the pick-list does not either.

### Component 8: Register and tally (PR18)

- Pre-fills the OPD register row: serial number (automatic, restarts monthly); columns 2 to 5, 7, 8 and 11 from the card; columns 6, 9, 10 and 12 from staff.
- Tally, using the HMIS 105 codes and bands: new attendance (OA01) vs re-attendance (OA02), referrals to unit (OR01) and from unit (OR02), and diagnoses by the form's five age bands (0 to 28 days, 29 days to 4 years, 5 to 9, 10 to 19, 20 and above), each split by male and female.
- CSV export.

### Component 9: Safe storage (PR17)

- Encrypted local storage; staff PIN.
- Voice clips deleted when the visit is closed.

### Component 10: DHIS2 export (PR11, PR13)

- Aggregate totals only; no names or patient-level data.
- "Export totals" produces a DHIS2-style file; optional push to the public DHIS2 demo instance.

### Component 11: Scribe, clinician dictation (AI) (PR5, PR6, PR19)

- Opened from the staff screen during the consultation, beside the patient card and the clinician's own questions.
- The same on-device speech model as component 4 transcribes the clinician's words.
- A constrained extractor drafts register fields (for example weight, temperature, new or repeat visit, referral yes or no) only from fixed lists or validated ranges in [register-field-map.md](register-field-map.md).
- Low-confidence fields are flagged and block save until the clinician confirms or edits them.
- Diagnosis and treatment are never drafted by the AI: the clinician picks or types them, or dictates and confirms the exact words.

## 10. Question set (summary)

| Section | Content | Feeds |
|---|---|---|
| 0 | Language and consent | Consent flag |
| 1 | Who the visit is for; child age band; pregnancy | Danger-sign set; tally age group |
| 2 | Danger signs (4 sets) | Urgent flag |
| 3 | Name, village and parish, age, sex, next of kin and phone, repeat visit, referral note | HMIS 031 columns 2 to 5, 7, 8, 11 |
| 4 | Main problem: one spoken answer | Consultation |
| 5 | Duration, trend, common symptoms | Consultation |
| 6 | Medicines taken, daily medicines, allergies, private matter | Consultation; safer prescribing |
| 7 | Read-back and close | n/a |

**Never asked by TuWulira:** weight and temperature (column 6), diagnosis (column 9), treatment (column 10), referral out (column 12).

Full field-by-field mapping: Figma, *Reference: Data requirements*, and [register-field-map.md](register-field-map.md).

## 11. Guardrails and responsible AI

- No diagnosis, no treatment advice; the clinician decides.
- "Not sure" and "Ask clinician" are always available; low-confidence AI output is marked, not guessed.
- Danger signs are rules, not AI.
- Fixed output lists for the understanding model.
- Consent before any question.
- Bias: models are tested on Luganda speech; known gaps (older voices, accents, code-switching, noise) are documented and reported with results.
- Privacy: on-device encryption, staff PIN, voice clips deleted at visit close, aggregate-only export. If the phone is lost: PIN protection now; remote wipe in the full design.

Full account: [responsible-ai.md](responsible-ai.md).

## 12. Evaluation plan (proof it works)

| Measure | How | Target |
|---|---|---|
| Speech-to-text accuracy | Word error rate on a held-out Luganda set (Common Voice or FLEURS) | Report honestly; no fixed target |
| Symptom-label accuracy | 20 to 30 labelled synthetic complaints | Report correct, wrong and "not sure" |
| Safe-failure rate | Share of wrong outputs caught as "not sure" | Higher is better |
| Model size | File size on device | Small enough to side-load |
| End-to-end demo | Full Path B journey on a phone, offline | Works in airplane mode |

Definitions and safety metrics (danger-sign sensitivity, ask-a-person coverage): [evaluation/metrics.md](../../evaluation/metrics.md).

## 13. Features

| ID | Feature | Requirements | Components | Code |
|---|---|---|---|---|
| F1 | Patient voice intake and patient-reported card | PR3, PR4, PR10, PR15, PR16 | 1, 2, 4, 5, 6 | [app/intake/](../../app/intake/), [config/](../../config/) |
| F2 | Clinician dictation (scribe) | PR5, PR6, PR7, PR19 | 11 | [app/scribe/](../../app/scribe/) |
| F3 | Safety layer: danger signs, thresholds, "ask a person" | PR8, PR9 | 3 | [app/safety/](../../app/safety/), [rules/](../../rules/) |
| F4 | Store-and-forward and DHIS2 export | PR1, PR11, PR13 | 10 | [app/sync/](../../app/sync/) |
| F5 | Follow-up SMS (date and clinic name only) | PR12 | Path A | [app/sync/](../../app/sync/) |
| F6 | Staff screen, register and tally | PR7, PR18 | 7, 8 | TODO |
| F7 | Safe storage | PR17 | 9 | TODO |

## 14. Design decisions

Record decisions as D# here, one line each, with the PR# they serve. Use the documentation-and-adrs skill for anything bigger.

| ID | Decision | Serves | Date |
|---|---|---|---|
| D1 | Hub and spokes: the model runs on one shared clinic device; patients reach it in person or by voice or SMS on their own phone. | PR1, PR2 | 2026-10-03 |
| D2 | Rule-based constrained extractor instead of a generative model, so outputs can only come from fixed lists. Narrowed by D10. | PR5 | 2026-10-03 |
| D3 | Danger-sign matching runs before, and independently of, the confidence threshold. | PR9 | 2026-10-03 |
| D4 | Remote danger-sign response (Path A): SMS "[Clinic name]: please come in today.", which keeps to PR12 (only a date and the clinic's name, no address, no symptoms, no word like "urgent"), then ask permission to notify the clinic and share answers. Yes: alert and card shared. No: nothing shared. The strict rule wins because household phones are shared, and any hint of illness or urgency on a shared phone can disclose a condition (RQ5.2). | PR9, PR12 | 2026-10-04 |
| D5 | Danger alerts go to the clinic: the clinic Android at the triage desk, then the nurse or in-charge. | PR9 | 2026-10-04 |
| D6 | Pre-filling the OPD register is acceptable because the data is patient-provided; clinician-only columns are still entered by staff. | PR7, PR18 | 2026-10-04 |
| D7 | SMS privacy wording: "Please delete these messages from your phone if you are worried about privacy." | PR12 | 2026-10-04 |
| D8 | Paper form (Path C) comes in two printed versions: Luganda and English. | PR3 | 2026-10-04 |
| D9 | Assisted mode is run by a clinic volunteer or staff member, not VHTs, because VHTs are village-based. | PR14 | 2026-10-04 |
| D10 | Speech-to-text and the understanding step (components 4 and 5) use small AI models; the understanding output is limited to the fixed symptom list. Danger signs, routing and register pre-fill stay rule-based. Confirmed by the team. | PR5, PR9 | 2026-10-04 |
| D11 | Clinician dictation (scribe) stays core scope, alongside the staff screen pick-lists. | PR19 | 2026-10-04 |
| D12 | Repo layout follows the team README: question list in `config/`, danger-sign rules in `rules/`, tests and results in `evaluation/`. | PR9, PR16 | 2026-10-04 |
| D13 | Model choices stay as candidates for now: Meta MMS or a Sunbird AI model for speech-to-text, Meta NLLB-200 or an alternative for understanding. | PR2 | 2026-10-04 |
| D14 | No native Luganda speaker is available, so the demo uses real Luganda speech from Mozilla Common Voice test clips as the spoken input, and says so openly in the video and README. Luganda prompt text and audio stay empty (no machine translation) and the app falls back to English prompts. | PR3 | 2026-10-04 |
| D15 | The diagnosis pick-list and tally follow the official HMIS 105 form (print version September 2019): section 1.3 codes and labels as printed, the form's five age bands by sex, and the OA and OR codes for attendance and referrals. | PR7, PR18 | 2026-10-04 |

## 15. Open questions

1. Which device will the demo run on (model and RAM), and how is it charged at the clinic? (RQ2.2, RQ6.3)
2. Final model choices and licenses (D13). (RQ3.1, RQ6.1)
3. Native Luganda prompts: still needed for a real clinic, even though the demo uses Common Voice clips (D14). Do not machine-translate.
