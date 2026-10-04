# Responsible AI, data and safety

This is our answer to the brief's pass/fail gate (section 09) and to Annex A's question: where the data sits, who can read it, and what happens when the phone is lost or shared. Gate items are tracked in [CHECKLIST.md](../../CHECKLIST.md) section D.

Status: design stated; items marked TODO are not yet built or verified.

## Non-negotiables

1. **Runs on a device the user already has.** Two entry-level Androids (D33): an intake phone that runs all the AI, and a clinic device that runs none; one-device mode puts both roles on the intake phone. Assumption to state: no source confirms a shared device pool inside HC II/III facilities; eCHIS Android phones exist at VHT level (RQ2.2). Details: [data-architecture.md](data-architecture.md).
2. **Core feature works offline.** Intake, speech recognition and the labeler run on the intake phone; the queue, register and tally run on the clinic device; the card moves by QR code (Path B). Path A (remote phone) needs signal and is design only.
3. **Model files are small enough to side-load** or send over a weak connection. Measured in [models/README.md](../../models/README.md) (RQ6.1).
4. **Local language:** Luganda. Less-supported language to report on: Lusoga (RQ3.3).
5. **Human in the loop.** A person makes the final call. The tool informs and flags uncertainty. It never acts on anyone's behalf.
6. **Fail-safe.** When unsure, the tool says "Not sure. Please ask a person." instead of guessing. This also covers total failure: silence, a crying child, unintelligible audio (RQ4.4).
7. **Danger signs trigger "Tell the nurse now".** The list comes only from WHO IMCI general danger signs, Uganda Clinical Guidelines and WHO maternal danger signs. We never invent danger signs (RQ4.1).
8. **No diagnosis, no prescription, no image interpretation.** Fields that imply either stay clinician-entered, or are dictated and confirmed (RQ4.3).
9. **Fixed list of answers.** The understanding step and the scribe's extractor can only output values from defined field schemas ([register-field-map.md](register-field-map.md)). Danger signs, question routing and register pre-fill are rules, not AI.
10. **No hallucinations.** Nothing appears in an output that the patient or clinician did not say.
11. **Cite every data source**, with source, license, size and what it does not cover. Label all synthetic data.
12. **No secrets, real API keys or real patient data** in the repo. Demo data is synthetic only.

## Where the data sits

| Data | Where | How long |
|---|---|---|
| Audio recordings (voice clips) | Intake phone only, encrypted | Deleted at visit close. Never in the QR, never synced. TODO: build and test. |
| Answers, danger flags, card items, patient draft (cols 2 to 5, 7) | Intake phone, encrypted and temporary; then the clinic device after the QR scan | Intake copy wiped after an intact receipt; unscanned sessions wiped at the end of the clinic day. |
| Staff entries, register rows, tallies, export log, audit log | Clinic device only, encrypted SQLite (SQLCipher) behind the staff PIN. CSV export for the clinic's own register. | Patient-level records never leave the clinic device. Patient-level records stay on the clinic device only until they are entered into the facility's official record (HMIS 031 register, outpatient card or EMR), and are then automatically deleted or de-identified within 7 days at most, because Uganda's [Data Protection and Privacy Act 2019, s.18](https://ulii.org/en/akn/ug/act/2019/9/eng@2023-12-31) forbids keeping personal data longer than its purpose requires. |
| Aggregate totals | Device, then the clinic's DHIS2 ("Export totals") | Totals only: no names or patient-level data. |
| Consent | | Consent | Before any intake, the patient (or parent/guardian for a child) hears a consent script in their language explaining that health information is collected, why, who can see it, how long it is kept, and that they can say no or withdraw at any time. The spoken yes is stored as `consent_recorded: yes` with a timestamp, the script version, the language, and who consented (patient or guardian). If consent is refused or withdrawn, no intake data is collected, or existing data is deleted. The consent audio itself follows the audio rule above. Aligns with Uganda's [Data Protection and Privacy Act 2019](https://ulii.org/en/akn/ug/act/2019/9/eng@2023-12-31), ss.7–9 and 13.|
| Model files | Device | Not personal data |

Nothing goes to a cloud AI service. Storage is encrypted on the device and opened with a staff PIN (PR17). TODO: pick and build the encryption method (see [resources/libraries/README.md](../../resources/libraries/README.md)).

## Who can read it

- **Clinic staff** who unlock the staff screen with the staff PIN, by role (clerk, triage nurse, clinician, records assistant). Every view, edit and export is written to the audit log with the staff ID (PR24).
- **The patient** sees only their own intake while doing it. Intake mode cannot open other records. TODO: build.
- **DHIS2 users** with the clinic's normal permissions see aggregate totals only, never names.
- **Nobody else.** No analytics, no third-party SDKs that send data.

## When the phone is lost or shared

- **Lost intake phone:** exposes at most the current day's waiting patients, encrypted. **Lost clinic device:** records are encrypted and the staff screen is behind a staff PIN, on top of the Android screen lock. Voice clips are already deleted at visit close. Remote wipe is in the full design, not the prototype. TODO: state the maximum backlog of records kept on the device.
- **Shared with patients:** intake mode is locked to a single patient session and shows nothing from earlier patients.
- **Patient's own household phone:** it never receives health details. SMS says only a date and the clinic's name, for example "[Clinic name]: your next visit is 12 Oct." (RQ5.2).

## Consent

A recorded spoken yes (or a consent button in staff-assisted mode), in Luganda, before any question is asked or anything is recorded. Stored as `consent_at` and `consent_method` on the intake session. If the patient says no or says nothing, the tool asks nothing more and the visit goes on as normal on paper. TODO: write the consent prompt with a native speaker (RQ5.1); none is lined up yet.

**Remote danger alerts (Path A, design only, decision D4):** if a patient answering on their own phone reports a danger sign, they get the SMS "[Clinic name]: please come in today." (only a date and the clinic's name, per PR12), then are asked whether the clinic may be notified and see their answers. Yes: the clinic gets the alert and the card. No: nothing is shared with the clinic.

## The "ask a person" path

| Trigger | What the tool does |
|---|---|
| Silence, crying, unintelligible audio, no speech detected | Says "Not sure. Please ask a person." Saves nothing from that turn. |
| Any field below the confidence threshold | Flags the field. It cannot be saved until a person confirms it. |
| A danger-sign phrase is detected, at any confidence | Says "Tell the nurse now." Flags the record. Only a person can clear it. Transcript scanning can only add a danger flag, never remove one. |
| The patient talks about something outside the intake questions | Records nothing new; shows "Patient wants to discuss something else. Please ask them." |

Code: [app/safety/](../../app/safety/).

## Danger signs

The working list lives in [app/safety/danger-signs.ts](../../app/safety/danger-signs.ts), with the source of each entry. RQ4.1 stays open until each entry has been checked against the source document and the Luganda phrases have been written with native speakers. Danger-sign sensitivity is reported separately from overall accuracy (RQ4.2, [evaluation/metrics.md](../../evaluation/metrics.md)).

Error trade-off: a missed danger sign is the worst failure, so the danger-sign check runs before, and independently of, the confidence threshold. We accept more false alarms to miss fewer real ones.

## Bias and language limits

- **Language:** Luganda is better supported by public speech data than Lusoga. Expect worse accuracy in Lusoga (RQ3.3) and for code-switching between Luganda and English (RQ3.2).
- **Voices:** public speech datasets may under-represent older speakers, children and some regional accents. TODO: state what the datasets we use cover, on each dataset card.
- **Clinical words:** local illness terms may not map onto clinical categories (RQ3.4). The tool records them word for word instead of translating them into a clinical term.
- **Test data is synthetic.** Our results show how the tool behaves on scripted clips, not in a real clinic.
- **Automation bias:** the intake card says "patient reported" and sits beside the clinician's own questions, not above them (RQ2.4).

## Human oversight

The clinician confirms every drafted field before save, owns every diagnosis and treatment entry, and can edit or delete anything. The tool never sends, refers, prescribes or books on anyone's behalf. The only outbound actions are aggregate totals to the clinic's own DHIS2 when staff press "Export totals", and an SMS with a date the clinician confirmed.

## Accountability (Tier 3, RQ7.1)

The clinician who confirms a record is accountable for it, as with a paper register. Regulator path: see [country-pack.md](country-pack.md).
