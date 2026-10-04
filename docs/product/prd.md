# Product requirements: TuWulira

Status: draft for the Hack-Nation weekend, 3 to 4 October 2026. Last updated 4 October 2026. Team: Hotline Bling. Every requirement (PR#) cites the finding (R#) or research question (RQ#) it rests on. When an RQ is answered, update the requirement and its CHECKLIST.md item.

Source of truth for flows: [Figma, TuWulira Project hub, System Diagram page](https://www.figma.com/design/46MiynCpDjTcAiYoqmiaEr/TuWulira---Project-hub?node-id=0-1).

## 1. Summary

TuWulira is a Luganda-first intake and record-keeping tool for rural primary care clinics in Uganda. Before the visit, the patient answers a fixed question set from the basic phone they already have, by flash call (the clinic line calls back) or by text. TuWulira captures one spoken or written answer for the main problem, flags danger signs, and produces a patient-reported card for the clinician, with a visit code the patient shows at the desk. The AI and the records run on the clinic's Android with no internet connection. During the visit, the clinician can dictate the encounter (scribe) and confirm drafted register fields. The same answers pre-fill the OPD register (HMIS 031) and tally sheet.

## 2. Problem statement

Draft, to finish once RQ1.1 is answered:

> Because of TuWulira, patients at rural Ugandan health centres will have their symptoms, danger signs and register details captured in Luganda before they see the clinician, which would otherwise happen late, in a rushed verbal history, or not at all; we know because [TODO: cite a Service Delivery Indicators, DHS or WHO GHO figure with year and country].

What we know so far: the brief names "burdensome record-keeping" as a reason clinicians cannot give each patient enough attention (Annex A.1). Penda Health's largest gain was a 32% drop in history-taking errors (R2). Documentation time at Ugandan health centres is not yet measured in our evidence (RQ1.1 open).

## 3. Goals and non-goals

**Goals**

1. Patients with danger signs are seen first.
2. The clinician starts the consultation already knowing the main problem, duration, symptoms, medicines taken and allergies.
3. Register and tally fields the patient can answer are captured once, not re-written by hand (measure in evaluation; RQ1.1, RQ1.3).
4. Patients use the phone they already have. The AI core works in Luganda on a device the clinic already has, with no internet connection.
5. Nothing appears in a record that nobody said.

**Non-goals**

- Diagnosis, triage scoring, prescription or treatment advice by AI.
- Interpreting images.
- Measuring vitals (the nurse measures weight and temperature).
- Replacing the clinician's own questions or examination.
- Replacing DHIS2 or the paper register where it is still required.
- Sending health details by SMS.
- Running the model on the patient's own basic phone. The patient's phone only makes and receives ordinary calls and texts; the models run on the clinic device.
- Asking private questions (alcohol, tobacco, medicines, private matters) by SMS (D29).
- Path C (paper form) as a working build this weekend; it is design only.
- HMIS 105 sections 2 to 11 (maternal and child health, immunization, HIV testing, circumcision, stock, lab, finance). They come from other registers. TuWulira covers section 1 only ([HMIS105_ALIGNMENT.md](../HMIS105_ALIGNMENT.md)).
- Capturing arrival by ambulance (D25).
- Asking about gender-based violence or attempted self-harm (D26).
- Assigning a malnutrition category, a TB classification or any other classification. The tool records what was said or measured; staff classify.

## 4. Users

| User | Context | Needs from TuWulira |
|---|---|---|
| Patient or caregiver (Noor) | Speaks Luganda; owns a basic phone shared with the household; low digital literacy | Answer in Luganda from their own phone, by voice or keypad, without reading; a free way to start (flash call); know answers stay with clinic staff; no health details on a shared phone |
| Clerk | Front desk | Find the card from the visit code, confirm name spelling, register walk-ins without a code, check the register row |
| Triage nurse | Sees patients before the clinician | Urgent patients first; add weight and temperature |
| Clinician (clinical officer or nurse) | Overcrowded rural clinic, many patients, paper or DHIS2 registers (RQ1.2 open) | Readable card in seconds; record diagnosis, treatment and referral out; never lose control of the record |
| Records assistant | Compiles registers and reports | Accurate tallies; monthly HMIS 105 totals |
| Clinic staff who look after the shared device | Charge, unlock and hand over the device | Simple, robust, works with no signal |

## 5. Constraints (from the challenge brief)

- Runs on a device the user already has: the patient's own basic phone, and the clinic's Android.
- Core feature works offline: speech-to-text, understanding, danger-sign rules, the card, the register and the tally all run on the clinic Android with no internet connection. The patient channel uses ordinary voice calls and SMS, which need mobile signal but no internet data. The brief names "SMS and voice" as the common interfaces Small AI should centre on (section 02).
- Model files small enough to side-load or send over a weak connection.
- At least one interaction in a local language: **Luganda**.
- A person makes the final call; the tool flags what it is unsure of.

## 6. Three paths, one card

| Path | Where | Needs | Status this weekend |
|---|---|---|---|
| A. Remote: flash call or text | Patient's own basic phone | Mobile signal at both ends; a way for the clinic line to call back and send SMS (open question 7) | **Main patient experience** (D31) |
| B. In clinic: kiosk or shared clinic phone | Clinic Android | A charged device | Fallback for walk-ins without a phone or signal |
| C. In clinic: paper form | Printed form (Luganda or English), photographed | Paper; phone optional | Design only |

## 7. User journey (Path A, main patient experience)

1. **Start.** The patient gives the clinic line a flash call (rings once and hangs up, which is free), or texts the clinic number.
2. **Questions.** By flash call: the clinic line calls back and plays a recorded Luganda prompt for each question; the patient answers on the keypad (1 Yes, 2 No, 3 Not sure, 0 Ask clinician) and speaks only where asked (consent, name, village, main problem). By text: the same questions as numbered replies, with the main problem written in their own words. Private questions are keypad-only on a call and never asked by text (D29).
3. **Danger signs.** Any danger-sign YES: the patient is told to come to the clinic today and asked whether the clinic may be told now (D4). The only SMS is "[Clinic name]: please come in today."
4. **Visit code.** The card is saved on the clinic device. The patient gets a visit code: spoken on the call, or in the closing text (D30).
5. **Arrival.** The clerk enters the visit code to find the card. A walk-in without a code uses Path B or registers on paper.
6. Nurse sees urgent patients first and adds measurements.
7. Clinician reads the card, takes their own history, and records diagnosis, treatment and referral.
8. Register row and tally update. Totals are exported for DHIS2.

Wireframes of every step: [TuWulira wireframes](https://claude.ai/artifact/ADg875g7jonBCzvqK8pPjV) (private link; ask Asia for access).

## 8. Requirements

| ID | Requirement | Based on | Checklist |
|---|---|---|---|
| PR1 | The AI core (speech-to-text, understanding, danger-sign rules, card, save) works on the clinic Android with mobile data and Wi-Fi off. The patient channel uses ordinary calls and SMS, which need signal but no internet (D31). | Brief 02, 06; R3, R4 | C.2, F.5 |
| PR2 | All models together are small enough to side-load; size, RAM and latency are measured on the cheapest Android we have. | Brief 06; RQ6.1; R3 | C.3, F.8 |
| PR3 | Intake runs in Luganda with a recorded prompt for every question, English text available, and one spoken answer for the main problem. | Brief 06; RQ3.1, RQ3.2 | C.4, F.1 |
| PR4 | The intake output is a card labelled "patient reported", never "findings", and appears beside, not instead of, the clinician's own questions. | RQ2.4; R2 | F.3, F.18 |
| PR5 | The understanding step and register pre-fill fill only fields defined in [register-field-map.md](register-field-map.md), using only values from fixed lists or validated ranges. | Brief glossary "fixed list of answers"; RQ4.3 | D.5 |
| PR6 | Any AI output below the confidence threshold is marked "not sure" or "unclear, clinician to ask" and is never guessed. | Brief 06 guardrail; RQ4.2 | F.4 |
| PR7 | Patient intake never asks for measurements, diagnosis, treatment, test results, referral out or visit outcome. These are filled during the in-clinic consultation: the nurse enters weight and temperature, plus height or length and MUAC for children under 5 (typed, or dictated and confirmed); the clinician enters diagnoses, malaria test and treatment details, the presumptive TB tick, treatment, referral out and outcome. The AI never suggests a diagnosis, treatment or classification. | RQ4.3; team rule; D19, D21, D22, D24 | D.6 |
| PR8 | When the tool understands nothing (silence, crying child, unintelligible audio) or confidence is too low, it says "Not sure. Please ask a person." and hands over. | Brief 09 fail-safe; RQ4.4 | D.2 |
| PR9 | Danger signs are checked by rules, not AI. Any YES sets an urgent flag immediately and tells the patient "Tell the nurse now". Danger signs come only from WHO IMCI, Uganda Clinical Guidelines and WHO maternal danger signs. | RQ4.1, RQ4.2 | D.3, D.4 |
| PR10 | No question is asked and nothing is recorded before a recorded spoken yes. | RQ5.1 | D.8 |
| PR11 | Records queue on the device and sync when a signal appears, with no duplicates and no lost records. | Brief glossary "store-and-forward"; RQ6.2; R5 | F.6, F.7 |
| PR12 | Any SMS to a patient contains only a date and the clinic's name. One exception: the closing message of a text intake may also hold the visit code, which carries no health information (D30). (Danger-sign SMS: see D4.) | RQ5.2 | D.9 |
| PR13 | Only aggregate totals leave the clinic, mapped to DHIS2 data elements. No names or patient-level data. Every total is labelled with its HMIS 105 code, age band and sex; totals that include estimated ages are marked "estimated". | R5; RQ1.2; RQ5.1; D27 | F |
| PR14 | Every screen meets the inclusivity rules in [design-system.md](../design/design-system.md) (older users, low literacy, privacy in a crowded room). | RQ2.1, RQ2.3 | F.15, F.17 |
| PR15 | Private questions are answered on the keypad or buttons only, never spoken, and offer "Prefer not to say". This includes alcohol, tobacco and second-hand smoke (not asked for children aged 0 to 4). They are never asked by SMS, because the thread stays on a shared phone; the clinician asks them in person. | RQ2.1; RQ5.2; D23, D29 | F.16 |
| PR16 | The question list is one JSON file per language or country. Changing questions or adding a language needs no code change. | RQ7.3 | F |
| PR17 | Data is stored encrypted on the device, behind a staff PIN. Voice clips are deleted when the visit closes. | RQ5.1 | D.7 |
| PR18 | Patient answers pre-fill the OPD register row (HMIS 031, 2010 version) and tally, with CSV export. Each diagnosis is its own register line; extra lines fill only the diagnosis columns. The tally produces the HMIS 105 (September 2019) section 1 totals. | RQ1.2; R5; D20, D28 | F |
| PR19 | The clinician can dictate the encounter. The scribe drafts only register fields from fixed lists or validated ranges; every drafted field is confirmed before save, and diagnosis and treatment are typed or confirmed word for word. | RQ4.3; R2 | F.2, F.4 |
| PR20 | Age is captured as date of birth, or as days old for babies under 2 months. If the patient does not know, an estimate (number plus days, months or years) is accepted and marked "estimated" on the card and in the export. The system calculates every HMIS 105 age band; the patient is never asked for a band. | RQ1.2; D16 | F |
| PR21 | Intake flags describe only what the patient reported: "fever reported" from the fever question, and "TB symptoms reported: clinician to assess" from any YES to the TB symptom questions. Only the clinician records a diagnosis, test result or presumptive TB. | RQ4.3; D19, D21 | D.6, F.3 |
| PR22 | The patient screen never asks about origin or status (report type is clerk-entered), gender-based violence or attempted self-harm. Those HMIS 105 rows are recorded only by the clinician. | RQ2.1; RQ5.1; D17, D26 | D.1, D.10 |

## 9. Components

Numbers match the component table in the [README](../../README.md).

### Component 1: Patient channels: flash call and text (PR3, PR10, PR12, PR14, PR15)

**Flash call (voice callback)**
- The patient rings the clinic line once and hangs up. The clinic line calls back.
- Plays a recorded Luganda prompt for every question; English available.
- Keypad answers: 1 Yes, 2 No, 3 Not sure, 0 Ask clinician. Date of birth is typed as day, month, year then #, or * for "Don't know"; an estimated age is a number then 1 days, 2 months or 3 years.
- Spoken answers after a beep, ended with #: consent, name, village and parish, next of kin, and the main problem. The recordings go to the clinic device for on-device speech-to-text.
- Private questions are heard in the patient's ear and answered on the keypad only, with "Prefer not to say".
- Ends with a read-back (1 correct, 2 change) and a spoken visit code (9 to repeat).

**Text (SMS)**
- The patient texts the clinic number. Every question is a numbered reply; the main problem is written in the patient's own words (Luganda or English) and goes straight to the understanding step (component 5).
- The consent message carries the privacy line (D7).
- Private questions are not asked; the message says the clinician will ask in person (D29).
- Ends with the visit code and the privacy line (D30).

**In clinic (Path B fallback)**
- The same question set on the clinic Android, with buttons and audio prompts, for walk-ins without a phone or signal.

### Component 2: Question list (PR16, PR20, PR21)

- Single JSON file per language or country.
- Each question has: id, section, Luganda text, English text, audio file, answer type, next-question rule, and target field (HMIS 031 column, HMIS 105 code, or "consultation").
- Changing questions or adding a language requires no code change.

New questions for HMIS 105 section 1 (full detail in [HMIS105_ALIGNMENT.md](../HMIS105_ALIGNMENT.md)). Luganda text and audio for each still need a native speaker (D14).

| id | Question (English) | Answers | Rule | Feeds |
|---|---|---|---|---|
| REG-DOB | What is the date of birth? | Date, or "Don't know" | "Don't know" goes to REG-AGE-EST | Age (HMIS 031 column 4); age bands |
| REG-AGE-EST | About how old? | Number plus days, months or years | Age marked "estimated" | Age; age bands |
| REG-NEWBORN | Is the baby under 2 months old? How many days old? | Yes / No, then days | Shown when the visit is for a baby | Neonatal 0 to 7 and 8 to 28 day split |
| REG-REFIN | Did a health worker send you here? | Yes / No / Not sure | Yes prompts the clerk for the referral note number | HMIS 031 column 11; OR01. Same question as the existing `s3_referral`. |
| SYM-FEVER | Have you had a fever or felt hot? | Yes / No / Not sure / Ask clinician | Yes puts "fever reported" on the card | Pre-flag for EP01a (clinician confirms) |
| TB-1 | Have you been coughing? | Yes / No / Not sure / Ask clinician | Any TB YES: "TB symptoms reported: clinician to assess" | TP01; TP02 candidate |
| TB-2 | Have you had a fever? | Reuses the SYM-FEVER answer, not asked twice | As above | As above |
| TB-3 | Do you sweat a lot at night? | Yes / No / Not sure / Ask clinician | As above | As above |
| TB-4 | Have you lost weight without trying? | Yes / No / Not sure / Ask clinician | As above | As above |
| PREG-BF | Are you breastfeeding? | Yes / No / Prefer not to say | Asked with the existing pregnancy question | Nutrition pregnant or lactating columns |
| RB-ALC | Do you drink alcohol? | Yes / No / Prefer not to say | Private, button-only; not asked for ages 0 to 4 | RB01 |
| RB-TOB | Do you smoke or use tobacco? | Yes / No / Prefer not to say | Private, button-only; not asked for ages 0 to 4 | RB02 |
| RB-EXP | Does anyone smoke near you at home? | Yes / No / Prefer not to say | Private, button-only | RB03 |

TB question wording and cough duration must be checked against Uganda's national TB screening guidance before they are final (open question 4).

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
- Patient-reported flags ("fever reported", "TB symptoms reported: clinician to assess") shown as reported, never as findings (PR21).
- An estimated age is marked "estimated" (PR20).

### Component 7: Staff screen (PR7, PR17, PR22)

- Behind a staff PIN.
- Queue sorted urgent first, then by arrival time.
- Clerk: enters report type (National / Refugee / Foreigner), required before the record closes, so the patient screen never asks about origin or status. Enters the referral note number when the patient said a health worker sent them.
- Nurse: enters weight (kg) and temperature. For children under 5, also height or length (cm) and MUAC (cm). The tool records the measurements; the nurse confirms any malnutrition category, and the tool never assigns one.
- Clinician:
  - Diagnoses: multi-select from the HMIS 105 section 1.3 list ([config/hmis105-diagnoses.json](../../config/hmis105-diagnoses.json), print version September 2019). The form marks no condition as notifiable, so the pick-list does not either (see open question 6).
  - Malaria, shown when fever was reported or a malaria diagnosis is picked: test done (RDT / blood slide / none), result (positive / negative), and a "treated" tick.
  - TB: a "presumptive TB" tick. This is the clinician's decision, separate from the intake flag.
  - Treatment as units x doses per day x days, and the referral-out number.
  - Outcome: went home / referred out / admitted / died.
  - Gender-based violence and attempted self-harm rows, if relevant. The tool never asks about these (PR22).

### Component 8: Register and tally (PR18, PR20)

- Pre-fills the OPD register row: serial number (automatic, restarts monthly); columns 2 to 5, 7, 8 and 11 from the card; columns 6, 9, 10 and 12 from staff.
- Each diagnosis is its own register line; extra lines fill only the diagnosis columns, per the HMIS 031 instructions (D20).
- Register version: HMIS 031 from the Ministry of Health's 2010 Health Unit Procedure Manual, used as is and mapped to the September 2019 HMIS 105. The version gap is stated in the submission (D28).
- Tally, using the HMIS 105 codes: new attendance (OA01) vs re-attendance (OA02), referrals to unit (OR01) and from unit (OR02), and diagnoses, each split by male and female.
- Age bands (PR20). Age in days = visit date minus date of birth, or from the estimate. Each HMIS 105 section uses its own bands:

| HMIS 105 section | Bands |
|---|---|
| 1.1 to 1.3 OPD attendance, referrals, diagnoses | 0 to 28 days; 29 days to 4 years; 5 to 9; 10 to 19; 20 and above |
| 1.3.3 Neonatal rows | 0 to 7 days; 8 to 28 days |
| 1.4 TB | under 5; 5 to 9; 10 to 14; 15 to 19; 20 and above |
| 1.5 Nutrition | 0 to 5 months; 6 to 23 months; 24 to 59 months; 5 to 9; 10 to 19; 20 to 24; 25 and above (women split non-pregnant and pregnant or lactating) |

- Estimated ages are counted in their band and marked "estimated".
- CSV export.

### Component 9: Safe storage (PR17)

- Encrypted local storage; staff PIN.
- Voice clips deleted when the visit is closed.

### Component 10: DHIS2 export (PR11, PR13)

- Aggregate totals only; no names or patient-level data.
- One row per HMIS 105 code x age band x sex (D27).
- "Export totals" produces a DHIS2-style file; optional push to the public DHIS2 demo instance.

| HMIS 105 code | Source in TuWulira |
|---|---|
| OA01 / OA02 | New vs re-attendance (`s3_repeat`) |
| OR01 | Referral in (`s3_referral` / REG-REFIN, plus the clerk's note number) |
| OR02 | Referral out (clinician) |
| EP01a | Fever reported and confirmed by the clinician |
| EP01b to EP01d | Malaria diagnosis, test result, treated tick (clinician) |
| All section 1.3 diagnosis codes | Clinician multi-select |
| TP01 | Patients who completed the TB symptom questions |
| TP02 | Clinician "presumptive TB" tick |
| NA01a / NA01b | MUAC / weight-for-height recorded (nurse) |
| RB01 to RB03 | Private alcohol and tobacco questions |
| DT01 | Outcome = died (clinician) |

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
| 1 | Who the visit is for; child age band; pregnancy and breastfeeding; for babies, under 2 months and days old | Danger-sign set; neonatal split; nutrition columns |
| 2 | Danger signs (4 sets) | Urgent flag |
| 3 | Name, village and parish, date of birth (or estimated age), sex, next of kin and phone, repeat visit, referral in | HMIS 031 columns 2 to 5, 7, 8, 11; HMIS 105 age bands, OA01/OA02, OR01 |
| 4 | Main problem: one spoken answer | Consultation |
| 5 | Duration, trend, common symptoms, fever, TB symptom screen | Consultation; "fever reported" and "TB symptoms reported" flags; TP01 |
| 6 | Medicines taken, daily medicines, allergies, private matter, alcohol, tobacco, second-hand smoke (button-only) | Consultation; safer prescribing; RB01 to RB03 |
| 7 | Read-back and close | n/a |

**Never asked by TuWulira:** weight and temperature (column 6), height or length and MUAC, diagnosis (column 9), treatment (column 10), referral out (column 12), malaria test and result, visit outcome, report type (National / Refugee / Foreigner, clerk-entered), gender-based violence, attempted self-harm.

**Who enters what:** P = patient question, N = nurse screen, C = clinician screen, K = clerk, S = system. See [HMIS105_ALIGNMENT.md](../HMIS105_ALIGNMENT.md).

Full field-by-field mapping: Figma, *Reference: Data requirements*, and [register-field-map.md](register-field-map.md).

## 11. Guardrails and responsible AI

- No diagnosis, no treatment advice; the clinician decides.
- "Not sure" and "Ask clinician" are always available; low-confidence AI output is marked, not guessed.
- Danger signs are rules, not AI.
- Fixed output lists for the understanding model.
- Consent before any question.
- Intake flags describe only what the patient reported ("fever reported", "TB symptoms reported: clinician to assess"). Only the clinician records a diagnosis or classification; the nurse confirms any malnutrition category.
- Gender-based violence rows (CD05, MH02, IN03, MC01) and attempted self-harm (NE21) are never asked by the tool; only the clinician records them. We say this in the video as a Responsible AI choice.
- Alcohol and tobacco questions are button-only, with "Prefer not to say".
- Report type is clerk-entered, so the patient screen never asks about origin or status.
- Estimated ages are marked, never presented as exact.
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
| End-to-end demo | Full Path A journey: flash call or text from a basic phone, card on the clinic device, visit code at the desk | Clinic device has mobile data off and Wi-Fi off; AI and records still work |

Definitions and safety metrics (danger-sign sensitivity, ask-a-person coverage): [evaluation/metrics.md](../../evaluation/metrics.md).

## 13. Features

| ID | Feature | Requirements | Components | Code |
|---|---|---|---|---|
| F1 | Patient intake by flash call or text, and patient-reported card | PR3, PR4, PR10, PR12, PR15, PR16, PR20, PR21, PR22 | 1, 2, 4, 5, 6 | [app/intake/](../../app/intake/), [config/](../../config/) |
| F2 | Clinician dictation (scribe) | PR5, PR6, PR7, PR19 | 11 | [app/scribe/](../../app/scribe/) |
| F3 | Safety layer: danger signs, thresholds, "ask a person" | PR8, PR9 | 3 | [app/safety/](../../app/safety/), [rules/](../../rules/) |
| F4 | Store-and-forward and DHIS2 export | PR1, PR11, PR13 | 10 | [app/sync/](../../app/sync/) |
| F5 | SMS: follow-up date, danger-sign "come in today", visit code (clinic name always; no health details) | PR12 | Path A | [app/sync/](../../app/sync/) |
| F6 | Staff screen, register and tally | PR7, PR18, PR20, PR22 | 7, 8 | TODO |
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

Decisions D16 to D28 come from the HMIS 105 alignment update ([HMIS105_ALIGNMENT.md](../HMIS105_ALIGNMENT.md), decisions 1 to 13 in that order).

| ID | Decision | Serves | Date |
|---|---|---|---|
| D16 | Age capture: ask date of birth; for babies under 2 months, ask days old. The system calculates every reporting band. | PR20 | 2026-10-04 |
| D17 | Report type (National / Refugee / Foreigner) is entered by the clerk per patient on the staff screen, never asked by the patient screen. | PR22 | 2026-10-04 |
| D18 | Referrals to the unit: the patient is asked "Did a health worker send you here?"; the clerk records the referral note number. | PR18 | 2026-10-04 |
| D19 | Malaria detail: a fever answer pre-flags "fever reported"; the clinician records test type, result and a "treated" tick. | PR7, PR21 | 2026-10-04 |
| D20 | Multiple diagnoses: multi-select from the HMIS 105 list; each diagnosis becomes its own register line. | PR7, PR18 | 2026-10-04 |
| D21 | TB symptom screen: four button questions; any YES flags "TB symptoms reported: clinician to assess". | PR21 | 2026-10-04 |
| D22 | Nutrition: the nurse adds height or length and MUAC for children under 5; the patient screen asks "breastfeeding?" alongside pregnancy. | PR7 | 2026-10-04 |
| D23 | Alcohol and tobacco: private, button-only questions with "Prefer not to say". | PR15 | 2026-10-04 |
| D24 | Visit outcome: the clinician picks went home / referred out / admitted / died. | PR7 | 2026-10-04 |
| D25 | Arrival by ambulance is not captured in this build. | n/a | 2026-10-04 |
| D26 | Gender-based violence and attempted self-harm rows are never asked by the tool; only the clinician records them. Stated in the video as a Responsible AI choice. | PR22 | 2026-10-04 |
| D27 | DHIS2 export: every total labelled with its HMIS 105 code, by age band and sex. | PR13 | 2026-10-04 |
| D28 | Form versions: use the 2010 HMIS 031 register as is, map it to the 2019 HMIS 105, and state the version gap in the submission (text in [HMIS105_ALIGNMENT.md](../HMIS105_ALIGNMENT.md) section 7). | PR18 | 2026-10-04 |
| D29 | Private questions (alcohol, tobacco, medicines, private matters) are never asked by SMS, because the thread stays on a shared phone. The clinician asks them in person. On a call they are keypad-only. | PR15 | 2026-10-04 |
| D30 | The closing SMS of a text intake may include the visit code alongside the clinic's name: a code carries no health information. On a call the code is spoken, not texted. | PR12 | 2026-10-04 |
| D31 | Path A (the patient's own basic phone, by flash call or text) is the main patient experience. Path B (in-clinic kiosk) becomes the fallback for walk-ins; Path C stays design only. | PR1, PR3 | 2026-10-04 |

## 15. Open questions

1. Which device will the demo run on (model and RAM), and how is it charged at the clinic? (RQ2.2, RQ6.3)
2. Final model choices and licenses (D13). (RQ3.1, RQ6.1)
3. Native Luganda prompts: still needed for a real clinic, even though the demo uses Common Voice clips (D14). Do not machine-translate. This now includes text and audio for every new HMIS 105 question.
4. TB question wording and cough duration: check against Uganda's national TB screening guidance. Do not settle it from memory. (D21)
5. Are each clinic's devices shared by MUAC-trained staff? (D22)
6. Notifiable diagnoses: the alignment update says to mark notifiable diagnoses with ★, but the official HMIS 105 form, as transcribed in [config/hmis105-diagnoses.json](../../config/hmis105-diagnoses.json), marks none. Until the team checks the form again, the pick-list marks none.
7. How does the clinic line call back and send texts (D31)? SMS can probably be sent and received through the clinic Android's own SIM with no internet. The voice callback is harder: Android generally stops ordinary apps from playing audio into a phone call or recording one (to verify), so the call may need an online voice-line (IVR) service that passes recordings to the clinic device. That would add a data connection for the voice path only. Decide before the demo, and say which in the video.
8. Mobile signal: Path A needs signal at the patient's end. Patients with no signal use Path B on arrival. (RQ2.2)
