# TuWulira

**Offline, Luganda-first patient intake for busy rural health centres.**
Hack-Nation × World Bank Youth Summit — Global AI Hackathon 2026, Challenge 04: *Small AI for Development* (Health track).

> 🎬 **Video:** TODO — add link
> 🎨 **Design hub (Figma):** [TuWulira — Project hub](https://www.figma.com/design/46MiynCpDjTcAiYoqmiaEr/TuWulira---Project-hub?node-id=0-1). Start with **System Diagram → Data architecture — two-device (v2)**.

*TuWulira* is Luganda for "we hear you".

---

## The problem

> **Because of TuWulira, health workers at rural Ugandan health centres will capture each patient's danger signs, main complaint in Luganda, and register details once, at registration, before the consultation, which would otherwise be gathered late in a rushed verbal history and re-written by hand into the OPD register and tally sheets; we know because more than half (52%) of public health providers were absent from their facility on an unannounced visit (World Bank Service Delivery Indicators, Uganda, 2013), and Uganda's outpatient process requires each visit to be written in the OPD register, then tallied by hand into monthly reports (MoH Uganda, HMIS Health Unit Procedure Manual, 2010).**

Full evidence and what we don't claim: [`docs/PROBLEM_STATEMENT.md`](docs/PROBLEM_STATEMENT.md).

## How it works

A clerk or nurse holds the **intake phone** at registration. The patient answers a short, fixed question set with buttons and recorded Luganda prompts, and says their main problem aloud. Danger signs raise an alert immediately. The phone turns the spoken answer into a one-screen **patient-reported card**, then hands it to the **clinic device** by QR code. Staff verify the card, add their own findings, and the OPD register row and tallies fill in automatically.

| Path | Where | Status this weekend |
|---|---|---|
| **B. In clinic, staff-assisted (main flow)** | Intake phone at registration | **Prototype** |
| B2. In clinic, self-intake | Patient uses the intake phone with earphones | Optional; needs validation |
| A. Remote | Patient's own basic phone (voice callback / SMS); needs signal + server | Design only |
| C. Paper form | Printed Luganda or English form, photographed | Design only |

Architecture, databases and privacy: [`docs/DATA_ARCHITECTURE.md`](docs/DATA_ARCHITECTURE.md).

## Where AI is used, and where it deliberately isn't

| Uses AI (intake phone only) | Deliberately rule-based |
|---|---|
| **Ears:** Luganda speech-to-text, offline | Danger signs (buttons; the transcript can only *add* a flag) |
| **Labeler:** transcript → fixed list of symptom labels, never a diagnosis | Question routing, register pre-fill, tallies |
| | Everything on the clinic device |

A keypad survey could run on SMS. TuWulira's AI job is **hearing the patient in her own words, in Luganda, offline**, and turning that into something a busy clinician can read in seconds.

## Guardrails

- **Human in the loop:** no diagnosis, no treatment advice. Every card item is labelled "PATIENT REPORTED — verify", and the card ends with "Now ask your own questions".
- **"Not sure — ask a person":** low confidence → ask once more → keypad → "unclear — clinician to ask". Never guessed.
- **Fixed answer lists:** the labeler can only output labels from an allowed list.
- **Danger signs from guidelines:** every rule cites WHO IMCI, WHO PCPNC or Uganda Clinical Guidelines 2023. See [`docs/DANGER_SIGNS.md`](docs/DANGER_SIGNS.md).
- **Privacy:** consent first; sensitive questions on keypad + earphones; read-back never played aloud; voice clips never leave the intake phone; encrypted storage, staff PIN, audit log; only aggregate totals go to DHIS2.

## Devices

| Role | Floor | Typical |
|---|---|---|
| Intake phone (AI) | itel A50, 2 GB, Android 14 Go | Samsung Galaxy A06, 4 GB |
| Clinic device (no AI) | Any Android 8+ already at the facility | Samsung Galaxy Tab A9 8.7" |
| One-device mode | Intake phone holds both roles behind a PIN | — |

Assumption: no source confirms a shared device pool inside HC II/III facilities. eCHIS Android phones exist at VHT level; we target the same entry-level, offline-first profile.

## Language

- **Local language:** Luganda (voice and text), with English. Code-switching between the two is expected and tested.
- **Less-supported language:** Lusoga. Speech accuracy would drop; buttons and danger signs still work; adding it is a new question file. See [`docs/LESS_SUPPORTED_LANGUAGE.md`](docs/LESS_SUPPORTED_LANGUAGE.md).

## Data

Full catalogue with licences, sizes and gaps: [`resources/datasets/README.md`](resources/datasets/README.md).

**What our data does not cover:** code-switched clinical speech (only our role-play clips), natural rather than read speech, older and rural voices, accents, noisy rooms, clinical vocabulary beyond maternal health, and languages other than Luganda and English. We use no real patient data.

## Evaluation

| Measure | Result |
|---|---|
| WER, pure Luganda (FLEURS + own clips) | TODO |
| WER, Luganda–English mixed (own clips) | TODO |
| Labeler: correct / wrong / "not sure" (synthetic set) | TODO |
| Bundle size on device | TODO |
| Peak RAM and seconds per transcription (device: TODO) | TODO |

Scripts and clips: `/evaluation`.

## Tech stack

TODO — screens, speech runtime, storage, QR library.

## Run it

TODO — numbered steps once the build is fixed. Include the device used for testing and how to side-load.

## Repository structure

```
/app                Patient + staff screens
/config             Question sets, danger_rules.json
/models             Quantised speech + labeler models (not committed if large; see download script)
/evaluation         Clips, synthetic set, scripts, results
/docs               Problem, architecture, danger signs, language, citations, video notes
/resources/datasets Data catalogue and dataset cards
```

## Research and citation notes

Research findings and the corrections applied before citing: [`docs/CITATION_FIXES.md`](docs/CITATION_FIXES.md).

## Team

| Name | Role |
|---|---|
| Milady (Asia) Apostol | Product design; users and workflow research |
| Beth TODO-surname | Problem and context research |
| TODO | TODO |

## Licence

Code: MIT (see [`LICENSE`](LICENSE)). Datasets keep their own licences (see the data catalogue); SALT is CC BY-SA 4.0 and the Makerere Radio Corpus is not used for training.
