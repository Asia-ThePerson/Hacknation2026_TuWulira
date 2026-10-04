# TuWulira

**Offline, Luganda-first patient intake for busy rural health centres in Uganda. It gives clinicians back time lost to history-taking and paperwork, and it never diagnoses.**

> **Prototype for a hackathon. Not a medical device. Uses synthetic data only.**

Hack-Nation x World Bank Youth Summit, Global AI Hackathon 2026, Challenge 04: Small AI for Development, Health track (Annex A).

*TuWulira* is Luganda for "we hear you". At registration, a clerk or nurse holds the intake phone while the patient answers a short, fixed set of questions in Luganda. It listens to one spoken answer about their main problem, flags danger signs immediately, and hands the clinician a one-screen card labelled **"Patient reported"**. The same answers pre-fill the clinic's OPD register (HMIS 031) and tally sheet, so staff write less and see patients sooner.

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

Team name: **Hotline Bling**.

| Name | Role | Research owner for |
|---|---|---|
| Beth A | Designer and developer | Problem and context (RQ1) |
| Asia A | Designer and developer | Users and workflow (RQ2) |

## The problem

Noor's local health centre is overcrowded. Clinicians have only a few minutes per patient and spend much of it on history-taking and paper record keeping (OPD register, tally sheets, monthly HMIS 105 report). The brief names "significant patient load, coupled with burdensome record-keeping requirements" as the reason clinicians cannot give each patient the attention needed (brief, Annex A.1). Danger signs can sit unnoticed in the waiting queue, and patient-level detail is lost before data reaches DHIS2.

Plain SMS tools have already delivered big wins in the region (Project Mwana, Uganda's mTrac; [finding R1](research/findings.md)), so our AI must do what SMS cannot: listen to the patient in their own words, in Luganda, offline.

**Problem statement:**

> Because of TuWulira, health workers at rural Ugandan health centres will capture each patient's danger signs, main complaint in Luganda, and register details once, at registration, before the consultation, which would otherwise be gathered late in a rushed verbal history and re-written by hand into the OPD register and tally sheets; we know because more than half (52%) of public health providers were absent from their facility on an unannounced visit (World Bank Service Delivery Indicators, Uganda, 2013), and Uganda's outpatient process requires each visit to be written in the OPD register, then tallied by hand into monthly reports (Ministry of Health Uganda, HMIS Health Unit Procedure Manual, 2010).

Full evidence table, and what we do not claim (no rural minutes-per-patient figure; SDI data is from 2013): [docs/product/problem-statement.md](docs/product/problem-statement.md).

## How it works

One question set, several ways in. Every path produces the same patient-reported card.

| Path | Where | Needs | Status this weekend |
|---|---|---|---|
| **B. In clinic, staff-assisted (main flow)** | Clerk or nurse holds the intake phone at registration; patient speaks the main problem in Luganda | Intake phone + clinic device (or one phone in one-device mode) | **Prototype** |
| B2. In clinic, self-intake | Patient uses the intake phone alone, with earphones | Same | Optional; needs validation in a real clinic |
| A. Remote | Patient's own basic phone (voice callback / SMS) | Signal + server | Design only |
| C. Paper form | Printed form (Luganda or English), photographed | Paper; phone optional | Design only |

All AI runs on the intake phone. The clinic device runs no AI. The card moves by QR code, offline. See [docs/product/data-architecture.md](docs/product/data-architecture.md).

## Devices

| Role | Floor | Typical |
|---|---|---|
| Intake phone (AI) | itel A50, 2 GB, Android 14 Go | Samsung Galaxy A06, 4 GB |
| Clinic device (no AI) | Any Android 8+ already at the facility | Samsung Galaxy Tab A9 8.7" |

Assumption: no source confirms a shared device pool inside HC II/III facilities; eCHIS Android phones exist at VHT level. We target the same entry-level, offline-first profile. In one-device mode the intake phone holds both roles, with staff screens behind a PIN.

Full flow, device requirements and decisions: the Figma *Final system diagram*, and [docs/product/user-flows.md](docs/product/user-flows.md). Requirements: [docs/product/prd.md](docs/product/prd.md).

## Prototype components (Path B)

| # | Component | What it does | Weekend scope |
|---|---|---|---|
| 1 | **Patient screen** | Walks the patient through the question set: language and consent, who the visit is for, danger signs, registration, one spoken answer, follow-ups, medicines, read-back. Big Yes / No / Not sure / Ask clinician buttons with recorded Luganda prompts. | Build |
| 2 | **Question list** | One JSON file: every question, Luganda and English text, audio file, branching, and which register column it fills. A new country is a new file, not new code. | Build |
| 3 | **Danger-sign checker** | Rule-based (no AI, on purpose). Any YES raises an urgent flag immediately: "Tell the nurse now." | Build |
| 4 | **Ears: Luganda speech-to-text (AI)** | Transcribes the spoken main problem offline. Low confidence: asks once more, then marks "unclear, clinician to ask". | Build |
| 5 | **Labeler: words to card (AI)** | Maps the Luganda transcript directly to items from a fixed symptom list (for example *headache, 3 days*), using a glossary that includes English loanwords, and keeps the original Luganda underneath. No translation model on the device. Never a diagnosis; writes "not sure" when unsure. | Build |
| 6 | **Patient card** | One screen: urgent flags on top, "not sure" items marked, labelled PATIENT REPORTED. | Build |
| 7 | **Staff screen** | Queue (urgent first) and card. Nurse adds weight and temperature; clinician picks diagnosis from the official HMIS 105 list ([config/hmis105-diagnoses.json](config/hmis105-diagnoses.json)), treatment and referral out. Behind a staff PIN. | Simple or mock |
| 8 | **Register and tally** | Pre-fills the OPD register row; counts new vs repeat visits, referrals, and diagnoses by the HMIS 105 age bands (0 to 28 days, 29 days to 4 years, 5 to 9, 10 to 19, 20+) and sex. Table and CSV export. | Mock |
| 9 | **Safe storage** | Encrypted on-device storage, staff PIN, voice clips deleted when the visit closes. | Build (simple) |
| 10 | **Sync to DHIS2** | Sends totals only (no names) when there is signal. "Export totals" button producing a DHIS2-style file. | Mock |
| 11 | **Scribe: clinician dictation (AI)** | During the consultation the clinician can speak the encounter. The on-device speech model transcribes it and a constrained extractor drafts register fields (for example weight, temperature, new or repeat visit) from fixed lists. Low-confidence fields are flagged and must be confirmed. Diagnosis and treatment stay clinician-entered. | Build (core) |

## Where AI is used, and where it deliberately is not

| Uses AI (intake phone only) | Deliberately rule-based |
|---|---|
| Luganda speech-to-text (Ears) | Danger-sign detection (buttons; transcript can only *add* a flag) |
| Transcript → fixed symptom labels (Labeler) | Question routing, register pre-fill, tallies |
| | Everything on the clinic device |

A keypad survey alone could run on SMS. TuWulira's AI value is **listening to the patient in their own words, in Luganda, offline**, and turning that into something a busy clinician can read in seconds. Danger signs stay rule-based because a confident wrong answer there is unsafe.

## Small AI fit

| Measure | Value | Source |
|---|---|---|
| Model size on disk | TODO | [models/README.md](models/README.md) |
| RAM on the cheapest available Android | TODO | [evaluation/results/](evaluation/results/) |
| Latency per 10 s of audio | TODO | [evaluation/results/](evaluation/results/) |
| Works in airplane mode | TODO: verify | [evaluation/results/](evaluation/results/) |

The danger-sign checker, question routing and register pre-fill are rule-based, so they add no model weights. We rejected Gemma 4 E2B because it needs about 2.4 GB RAM and a 4 GB phone ([libraries registry](resources/libraries/README.md)).

## Language

- **Luganda:** the spoken main-problem answer is transcribed from Luganda. WER: TODO on a held-out Luganda set (Common Voice or FLEURS), compared with a published benchmark (RQ3.1).
- **Demo, stated openly:** we have no native Luganda speaker on the team, so the demo uses real Luganda speech from Mozilla Common Voice test clips as the spoken input (decision D14). Luganda prompt text and audio are left empty for a native speaker; we did not machine-translate them, and the demo plays English prompts.
- **English:** every question has English text; the card shows English items with the original Luganda underneath.
- **Lusoga (less-supported):** reasoned estimate, not measured. Speech accuracy would drop because there is much less Lusoga data and no small on-device Lusoga model. Danger signs and most questions are buttons, so the safety parts still work, and unclear speech always goes to a person. Adding Lusoga is a new question file and recordings, not new code; until a small Lusoga model exists the tool runs buttons-only. Details: [docs/product/less-supported-language.md](docs/product/less-supported-language.md).
- Code-switching between Luganda and English is tested separately (RQ3.2).

## Guardrails and responsible AI

- **Human in the loop:** TuWulira never diagnoses or prescribes. The clinician reviews the card and makes every clinical decision.
- **"Not sure. Please ask a person.":** every question accepts *Not sure* or *Ask clinician*; low-confidence AI output is marked, never guessed. This covers total failure too (silence, crying child, unintelligible audio).
- **Danger signs are rules, not AI:** they come only from WHO IMCI (2014), WHO PCPNC maternal danger signs and Uganda Clinical Guidelines 2023, and every rule cites its source. The transcript can only add a flag, never remove one. Sources and status per sign: [docs/product/danger-signs.md](docs/product/danger-signs.md). We never invent them.
- **Fixed answer lists:** the understanding model can only output labels from an allowed list. Nothing appears that nobody said.
- **PATIENT REPORTED label:** reduces clinician over-reliance on the card.
- **Consent first:** a recorded spoken yes before any question. Remote danger alerts are shared with the clinic only if the patient says yes.
- **Privacy:** the intake phone keeps an encrypted, temporary session that is wiped after an intact QR handoff or at the end of the clinic day; voice clips never leave it. The clinic device keeps records encrypted behind a staff PIN, with every view, edit and export logged. Only aggregate counts leave the clinic.

Full account, including lost or shared phones and bias: [docs/product/responsible-ai.md](docs/product/responsible-ai.md).

## Data used, and what it does not cover

**Evidence the problem is real** (TODO: add source, year and country for each)

- Health-worker availability and time per patient: World Bank Service Delivery Indicators.
- Workforce density and service coverage: WHO Global Health Observatory.
- Phone ownership in Uganda: about 79% of adults own a mobile phone, mostly basic feature phones (team research note; source: FSD Uganda, [Connected but not included](https://fsduganda.or.ug/connected-but-not-included/)).
- Phone vs smartphone ownership by gender: GSMA Mobile Gender Gap Report.

**Data we build with** (TODO: confirm license and size for each)

| Dataset / model | Use | Licence | Size |
|---|---|---|---|
| Mozilla Common Voice, Luganda | Fine-tune / test ASR | CC0 | ~560 h recorded, ~437 h validated (read speech) |
| Google FLEURS, Luganda | Held-out WER benchmark only | CC BY 4.0 | TODO |
| Sunbird SALT | Luganda speech + Luganda–English text | TODO (check card) | 25,000+ sentences, 6 languages |
| Luganda radio corpus (Mukiibi et al., 2022) | Natural speech, some code-switching | TODO | 155 h |
| Dialogs of Delivery (Kimera et al., 2026) | Glossary + labeler test (text, maternal health) | TODO | 3,640 Q/A pairs |
| Small Luganda CTC ASR (candidate) | On-device Ears model | TODO | Target under ~120 MB int8 |
| Sunflower ASR (Sunbird) | Benchmark only (~3.8 GB, too large for device) | TODO | n/a |
| Team role-play recordings | Code-switched clinical test clips | Ours | TODO |
| Synthetic patient complaints (labelled synthetic) | Labeler test set | Ours | TODO |

Full catalogue with source, license, size and use: [resources/datasets/README.md](resources/datasets/README.md), with one card per dataset in [resources/datasets/cards/](resources/datasets/cards/).

**What our data does not cover:** no public code-switched *clinical* Luganda–English speech exists; Common Voice is read speech, not people describing symptoms; few older and rural voices; regional accents; noisy waiting rooms; clinical vocabulary; languages other than Luganda and English. Our own role-play recordings are the only code-switched clinical speech we have, and we report WER separately for pure-Luganda and mixed clips. All synthetic data is labelled as synthetic.

## Evaluation

| Measure | How | Target |
|---|---|---|
| Speech-to-text accuracy | Word error rate on a held-out Luganda set (Common Voice or FLEURS) | Report honestly; no fixed target |
| Symptom-label accuracy | 20 to 30 labelled synthetic complaints | Report correct, wrong and "not sure" |
| Safe-failure rate | Share of wrong outputs caught as "not sure" | Higher is better |
| Model size | File size on device | Small enough to side-load |
| End-to-end demo | Full Path B journey on a phone, offline | Works in airplane mode |

Definitions: [evaluation/metrics.md](evaluation/metrics.md). Results, once measured: [evaluation/results/](evaluation/results/).

## Tech stack

- **App:** Expo (React Native, TypeScript) for Android.
- **Speech-to-text:** small on-device Luganda model, being evaluated: Meta MMS or Sunbird AI models, run with sherpa-onnx or whisper.rn ([registry](resources/libraries/README.md)).
- **Labeler:** maps the Luganda transcript straight to a fixed symptom list with a glossary (English loanwords included). No translation model on the device (size); Sunflower (Sunbird) is used as a benchmark only.
- **Danger signs, routing, register pre-fill:** rule-based. Danger signs in [rules/](rules/), questions in [config/](config/).
- **Storage, handoff and sync:** temporary encrypted intake store on the intake phone; encrypted SQLite (SQLCipher) behind a staff PIN on the clinic device, with an audit log; card handoff by encrypted on-screen QR code, offline; DHIS2-style aggregate export. Data model: [docs/product/data-architecture.md](docs/product/data-architecture.md).

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
| The built solution (Small AI fidelity) | 25% | [app/](app/), [models/](models/), [evaluation/results/](evaluation/results/) |
| Development relevance and impact | 20% | [research/findings.md](research/findings.md), [docs/product/prd.md](docs/product/prd.md) |
| Data grounding | 15% | [resources/datasets/](resources/datasets/) |
| Evidence it works | 15% | [evaluation/metrics.md](evaluation/metrics.md), [evaluation/results/](evaluation/results/) |
| Clarity, design and inclusivity; value proposition for AI | 15% | [docs/design/design-system.md](docs/design/design-system.md), [docs/product/user-flows.md](docs/product/user-flows.md), [Figma hub](https://www.figma.com/design/46MiynCpDjTcAiYoqmiaEr/TuWulira---Project-hub?node-id=0-1) |
| Scalability, replicability and what happens next | 10% | [docs/product/country-pack.md](docs/product/country-pack.md) |
| **Responsible AI, data and safety (pass/fail)** | gate | [docs/product/responsible-ai.md](docs/product/responsible-ai.md), [CHECKLIST.md](CHECKLIST.md) section D |

Progress against every deliverable: [CHECKLIST.md](CHECKLIST.md).

## Submission checklist

- [ ] Working prototype (Path B, end to end) and link
- [ ] Video, 2 to 5 min: problem statement, AI capabilities and guardrails, demo, where it sits in the user's day and tech stack, our take on localizing AI
- [ ] Evaluation results in [evaluation/results/](evaluation/results/)
- [ ] Data sources, licenses, sizes and gaps documented

Full list: [CHECKLIST.md](CHECKLIST.md).

## What happens next

- **Country pack:** the question list is one JSON file, so a new country swaps the question file and prompts, the speech model, the register mapping and the guideline-sourced danger-sign list, with no new code ([docs/product/country-pack.md](docs/product/country-pack.md)). DHIS2 runs in more than 70 countries.
- **Paths A and C:** remote callback or SMS, and the photographed paper form, are designed but not built this weekend.
- **Regulator path:** Penda Health's approvals in Kenya are our precedent. TODO: name the equivalent Ugandan bodies (RQ7.1).

## Repo map

| Folder | What it holds | Components |
|---|---|---|
| [app/](app/) | The Expo app: patient screen, card, staff screen, scribe, storage, sync | 1, 6, 7, 8, 9, 10, 11 |
| [config/](config/) | Question list JSON (one file per language and country) and audio prompts | 2 |
| [rules/](rules/) | Danger-sign rules, read by [app/safety/](app/safety/) | 3 |
| [models/](models/) | Model choice, cards, weights (gitignored) | 4, 5, 11 |
| [evaluation/](evaluation/) | Test scripts, metrics, synthetic test sets, dated results (WER, symptom-label accuracy, "not sure" rate) | |
| [resources/](resources/) | Dataset catalogue and cards, library registry | |
| [research/](research/) | Research questions, findings, landscape review, sources | |
| [docs/](docs/) | Hackathon requirements, product, design, demo, links | |
| [scripts/](scripts/) | `check`, `fetch-data`, `fetch-models` | |
| [.claude/skills/](.claude/skills/) | Claude Code skills, see [SKILLS.md](.claude/skills/SKILLS.md) | |

## License

Code: [MIT](LICENSE). Docs: license not yet chosen.
