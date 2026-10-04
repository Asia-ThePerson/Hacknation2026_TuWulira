# TuWulira

**Offline, Luganda-first patient intake for busy rural health centres in Uganda. It gives clinicians back time lost to history-taking and paperwork, and it never diagnoses.**

> **Prototype for a hackathon. Not a medical device. Uses synthetic data only.**

Hack-Nation x World Bank Youth Summit, Global AI Hackathon 2026, Challenge 04: Small AI for Development, Health track (Annex A).

TuWulira asks a patient a short, fixed set of questions in Luganda while they wait. It listens to one spoken answer about their main problem, flags danger signs immediately, and hands the clinician a one-screen card labelled **"Patient reported"**. The same answers pre-fill the clinic's OPD register (HMIS 031) and tally sheet, so staff write less and see patients sooner.

> **Design hub (Figma):** [TuWulira Project hub](https://www.figma.com/design/46MiynCpDjTcAiYoqmiaEr/TuWulira---Project-hub?node-id=0-1).
> All design assets, system diagrams and presentations live here. Start with the **System Diagram** page, then *Final system diagram*.

## Demo and video

| | |
|---|---|
| Video (2 to 5 min) | TODO |
| Demo | TODO |
| Figma design hub | [TuWulira Project hub](https://www.figma.com/design/46MiynCpDjTcAiYoqmiaEr/TuWulira---Project-hub?node-id=0-1) |
| All links | [docs/links.md](docs/links.md) |

## Screenshot

TODO: add a screenshot or GIF of the patient screen and the patient-reported card.

## Team

Team name: TODO.

| Name | Role | Research owner for |
|---|---|---|
| Beth A | TODO | Problem and context (RQ1) |
| Asia A | TODO | Users and workflow (RQ2) |

## The problem

Noor's local health centre is overcrowded. Clinicians have only a few minutes per patient and spend much of it on history-taking and paper record keeping (OPD register, tally sheets, monthly HMIS 105 report). The brief names "significant patient load, coupled with burdensome record-keeping requirements" as the reason clinicians cannot give each patient the attention needed (brief, Annex A.1). Danger signs can sit unnoticed in the waiting queue, and patient-level detail is lost before data reaches DHIS2.

Plain SMS tools have already delivered big wins in the region (Project Mwana, Uganda's mTrac; [finding R1](research/findings.md)), so our AI must do what SMS cannot: listen to the patient in their own words, in Luganda, offline.

**Problem statement (draft):**

> Because of TuWulira, patients at rural Ugandan health centres will have their symptoms, danger signs and register details captured in Luganda before they see the clinician, which would otherwise happen late, in a rushed verbal history, or not at all; we know because [TODO: cite a Service Delivery Indicators, DHS or WHO GHO figure with year and country].

TODO (RQ1.1, RQ1.2): add documentation-burden evidence with source, year and country. See [research/questions.md](research/questions.md).

## How it works

One question set, three ways in. All three paths produce the same patient-reported card.

| Path | Where | Needs | Status this weekend |
|---|---|---|---|
| **A. Remote** | Patient's own basic phone (callback voice line or SMS) | Signal, plus an online IVR or SMS gateway | Design only |
| **B. In clinic: kiosk or shared clinic phone** | Clinic Android, runs fully offline | A charged device | **Prototype** |
| **C. In clinic: paper form** | Printed form (Luganda or English), photographed | Paper; phone optional | Design only |

Full flow, device requirements and decisions: the Figma *Final system diagram*, and [docs/product/user-flows.md](docs/product/user-flows.md). Requirements: [docs/product/prd.md](docs/product/prd.md).

## Prototype components (Path B)

| # | Component | What it does | Weekend scope |
|---|---|---|---|
| 1 | **Patient screen** | Walks the patient through the question set: language and consent, who the visit is for, danger signs, registration, one spoken answer, follow-ups, medicines, read-back. Big Yes / No / Not sure / Ask clinician buttons with recorded Luganda prompts. | Build |
| 2 | **Question list** | One JSON file: every question, Luganda and English text, audio file, branching, and which register column it fills. A new country is a new file, not new code. | Build |
| 3 | **Danger-sign checker** | Rule-based (no AI, on purpose). Any YES raises an urgent flag immediately: "Tell the nurse now." | Build |
| 4 | **Ears: Luganda speech-to-text (AI)** | Transcribes the spoken main problem offline. Low confidence: asks once more, then marks "unclear, clinician to ask". | Build |
| 5 | **Understanding: words to card (AI)** | Turns the transcript into structured items in English (for example *headache, 3 days*), keeping the original Luganda underneath. Picks only from a fixed symptom list; never a diagnosis; writes "not sure" when unsure. | Build |
| 6 | **Patient card** | One screen: urgent flags on top, "not sure" items marked, labelled PATIENT REPORTED. | Build |
| 7 | **Staff screen** | Queue (urgent first) and card. Nurse adds weight and temperature; clinician picks diagnosis (HMIS 105 list), treatment and referral out. Behind a staff PIN. | Simple or mock |
| 8 | **Register and tally** | Pre-fills the OPD register row; counts new vs repeat visits, age 0 to 4 and 5+, diagnoses. Table and CSV export. | Mock |
| 9 | **Safe storage** | Encrypted on-device storage, staff PIN, voice clips deleted when the visit closes. | Build (simple) |
| 10 | **Sync to DHIS2** | Sends totals only (no names) when there is signal. "Export totals" button producing a DHIS2-style file. | Mock |

## Where AI is used, and where it deliberately is not

| Uses AI | Deliberately rule-based |
|---|---|
| Luganda speech-to-text (component 4) | Danger-sign detection (component 3) |
| Transcript to structured English symptom items (component 5) | Question routing and keypad answers |
| | Register pre-fill and tally counts |

A keypad survey alone could run on SMS. TuWulira's AI value is **listening to the patient in their own words, in Luganda, offline**, and turning that into something a busy clinician can read in seconds. Danger signs stay rule-based because a confident wrong answer there is unsafe.

## Small AI fit

| Measure | Value | Source |
|---|---|---|
| Model size on disk | TODO | [models/README.md](models/README.md) |
| RAM on the cheapest available Android | TODO | [eval/results/](eval/results/) |
| Latency per 10 s of audio | TODO | [eval/results/](eval/results/) |
| Works in airplane mode | TODO: verify | [eval/results/](eval/results/) |

The danger-sign checker, question routing and register pre-fill are rule-based, so they add no model weights. We rejected Gemma 4 E2B because it needs about 2.4 GB RAM and a 4 GB phone ([libraries registry](resources/libraries/README.md)).

## Language

- **Luganda:** recorded prompts for every question, and the spoken main-problem answer. WER: TODO on a held-out Luganda set (Common Voice or FLEURS), compared with a published benchmark (RQ3.1).
- **English:** every question has English text; the card shows English items with the original Luganda underneath.
- **Lusoga (less-supported):** TODO: measured result or reasoned estimate (RQ3.3).
- Code-switching between Luganda and English is tested separately (RQ3.2).

## Guardrails and responsible AI

- **Human in the loop:** TuWulira never diagnoses or prescribes. The clinician reviews the card and makes every clinical decision.
- **"Not sure. Please ask a person.":** every question accepts *Not sure* or *Ask clinician*; low-confidence AI output is marked, never guessed. This covers total failure too (silence, crying child, unintelligible audio).
- **Danger signs are rules, not AI:** they come only from WHO IMCI general danger signs, Uganda Clinical Guidelines and WHO maternal danger signs. We never invent them.
- **Fixed answer lists:** the understanding model can only output labels from an allowed list. Nothing appears that nobody said.
- **PATIENT REPORTED label:** reduces clinician over-reliance on the card.
- **Consent first:** a recorded spoken yes before any question. Remote danger alerts are shared with the clinic only if the patient says yes.
- **Privacy:** data stays on the clinic device, encrypted, behind a staff PIN. Voice clips are deleted at visit close. Only aggregate counts leave the clinic.

Full account, including lost or shared phones and bias: [docs/product/responsible-ai.md](docs/product/responsible-ai.md).

## Data used, and what it does not cover

**Evidence the problem is real** (TODO: add source, year and country for each)

- Health-worker availability and time per patient: World Bank Service Delivery Indicators.
- Workforce density and service coverage: WHO Global Health Observatory.
- Phone ownership in Uganda: GSMA Mobile Gender Gap Report. TODO: confirm the team research note (about 79% of adults own a mobile phone, mostly basic feature phones) against the source before quoting it.

**Data we build with** (TODO: confirm license and size for each)

| Dataset or model | Use | License | Size |
|---|---|---|---|
| Mozilla Common Voice, Luganda | Test or fine-tune speech-to-text | CC0 | TODO |
| Google FLEURS, Luganda | Benchmark speech-to-text | TODO | TODO |
| Meta MMS (candidate) | On-device Luganda speech recognition | TODO | TODO |
| Meta NLLB-200 (candidate) | Luganda to English for the card | TODO | TODO |
| Synthetic patient complaints (team-written, labelled synthetic) | Test component 5 | n/a | TODO |

Full catalogue with source, license, size and use: [resources/datasets/README.md](resources/datasets/README.md), with one card per dataset in [resources/datasets/cards/](resources/datasets/cards/).

**What our data does not cover:** older and rural voices, regional accents, Luganda and English code-switching, medical vocabulary, noisy waiting rooms, real clinic recordings, and languages other than Luganda and English. There is no open local-language clinical conversation corpus, so our test complaints are synthetic. All synthetic data is labelled as synthetic.

## Evaluation

| Measure | How | Target |
|---|---|---|
| Speech-to-text accuracy | Word error rate on a held-out Luganda set (Common Voice or FLEURS) | Report honestly; no fixed target |
| Symptom-label accuracy | 20 to 30 labelled synthetic complaints | Report correct, wrong and "not sure" |
| Safe-failure rate | Share of wrong outputs caught as "not sure" | Higher is better |
| Model size | File size on device | Small enough to side-load |
| End-to-end demo | Full Path B journey on a phone, offline | Works in airplane mode |

Definitions: [eval/metrics.md](eval/metrics.md). Results, once measured: [eval/results/](eval/results/).

## Tech stack

- **App:** Expo (React Native, TypeScript) for Android.
- **Speech-to-text:** small on-device Luganda model, being evaluated: Meta MMS or Sunbird AI models, run with sherpa-onnx or whisper.rn ([registry](resources/libraries/README.md)).
- **Understanding:** constrained to a fixed symptom list. Meta NLLB-200 is a candidate for Luganda to English.
- **Danger signs, routing, register pre-fill:** rule-based.
- **Storage and sync:** encrypted on-device storage and queue (expo-sqlite planned), DHIS2-style aggregate export.

## Quick start

These commands were run from a clean clone on 2026-10-03 with Node 24 and npm 11.

```bash
git clone https://github.com/Asia-ThePerson/Hacknation2026_TuWulira.git
cd Hacknation2026_TuWulira
scripts/check            # repo checks (Python 3); fails until dataset licenses are verified
cd app
npm ci
npm test                 # logic checks for the safety-critical paths
npm run typecheck
```

To open the app on an Android phone with Expo Go, or an emulator: `npm run android` from `app/` (not verified in the clean-clone run because it needs a device).

## Judging criteria

| Criterion | Weight | Evidence in this repo |
|---|---|---|
| The built solution (Small AI fidelity) | 25% | [app/](app/), [models/](models/), [eval/results/](eval/results/) |
| Development relevance and impact | 20% | [research/findings.md](research/findings.md), [docs/product/prd.md](docs/product/prd.md) |
| Data grounding | 15% | [resources/datasets/](resources/datasets/) |
| Evidence it works | 15% | [eval/metrics.md](eval/metrics.md), [eval/results/](eval/results/) |
| Clarity, design and inclusivity; value proposition for AI | 15% | [docs/design/design-system.md](docs/design/design-system.md), [docs/product/user-flows.md](docs/product/user-flows.md), [Figma hub](https://www.figma.com/design/46MiynCpDjTcAiYoqmiaEr/TuWulira---Project-hub?node-id=0-1) |
| Scalability, replicability and what happens next | 10% | [docs/product/country-pack.md](docs/product/country-pack.md) |
| **Responsible AI, data and safety (pass/fail)** | gate | [docs/product/responsible-ai.md](docs/product/responsible-ai.md), [CHECKLIST.md](CHECKLIST.md) section D |

Progress against every deliverable: [CHECKLIST.md](CHECKLIST.md).

## Submission checklist

- [ ] Working prototype (Path B, end to end) and link
- [ ] Video, 2 to 5 min: problem statement, AI capabilities and guardrails, demo, where it sits in the user's day and tech stack, our take on localizing AI
- [ ] Evaluation results in [eval/results/](eval/results/)
- [ ] Data sources, licenses, sizes and gaps documented

Full list: [CHECKLIST.md](CHECKLIST.md).

## What happens next

- **Country pack:** the question list is one JSON file, so a new country swaps the question file and prompts, the speech model, the register mapping and the guideline-sourced danger-sign list, with no new code ([docs/product/country-pack.md](docs/product/country-pack.md)). DHIS2 runs in more than 70 countries.
- **Paths A and C:** remote callback or SMS, and the photographed paper form, are designed but not built this weekend.
- **Regulator path:** Penda Health's approvals in Kenya are our precedent. TODO: name the equivalent Ugandan bodies (RQ7.1).

## Repo map

| Folder | What it holds | Components |
|---|---|---|
| [app/](app/) | The Expo app: patient screen, card, staff screen, storage, sync | 1, 6, 7, 8, 9, 10 |
| [app/safety/](app/safety/) | Danger-sign rules and "ask a person" | 3 |
| [models/](models/) | Model choice, cards, weights (gitignored) | 4, 5 |
| [eval/](eval/) | Metrics, synthetic test sets, dated results | |
| [resources/](resources/) | Dataset catalogue and cards, library registry | |
| [research/](research/) | Research questions, findings, landscape review, sources | |
| [docs/](docs/) | Hackathon requirements, product, design, demo, links | |
| [scripts/](scripts/) | `check`, `fetch-data`, `fetch-models` | |
| [.claude/skills/](.claude/skills/) | Claude Code skills, see [SKILLS.md](.claude/skills/SKILLS.md) | |

## License

Code: [MIT](LICENSE). Docs: license not yet chosen.
