# [PRODUCT NAME]

**Offline voice intake and record keeping for rural primary care clinics in Uganda. It gives clinicians back time lost to paperwork, and it never diagnoses.**

> Because of this tool, [TODO: user] will [TODO: action] by [TODO: when] that they would otherwise [TODO: not do / do late / do worse]; we know because [TODO: evidence].

> **Prototype for a hackathon. Not a medical device. Uses synthetic data only.**

Hack-Nation x World Bank Youth Summit, Small AI for Development Hackathon, Challenge 04, Health track (Annex A).

## Demo and video

| | |
|---|---|
| Video (2 to 5 min) | TODO |
| Demo | TODO |
| All links | [docs/links.md](docs/links.md) |

## Screenshot

TODO: add a screenshot or GIF of the intake card and the scribe form.

## Team

Team name: TODO.

| Name | Role | Research owner for |
|---|---|---|
| Beth A | TODO | Problem and context (RQ1) |
| Asia A | TODO | Users and workflow (RQ2) |

## The problem

Noor's local clinic is overcrowded. The brief names "significant patient load, coupled with burdensome record-keeping requirements" as the reason clinicians cannot give each patient the attention needed (brief, Annex A.1). Plain SMS tools have already delivered big wins in the region (Project Mwana, Uganda's mTrac; [finding R1](research/findings.md)), so our AI must do what SMS cannot: turn spoken Luganda into a structured record.

TODO (RQ1.1, RQ1.2): add documentation-burden evidence with source, year and country. See [research/questions.md](research/questions.md).

## How it works

One shared Android device at the clinic runs a small model (hub). Patients reach it in person, or by voice callback on the phone they already have (spokes).

1. **Before the visit: intake** ([app/intake/](app/intake/)). After a recorded spoken yes, the patient answers a short spoken intake in Luganda. The clinician gets a card labelled **"Patient reported"**, never "findings".
2. **During the visit: scribe** ([app/scribe/](app/scribe/)). The clinician speaks the encounter. A small on-device speech model transcribes it, and a constrained extractor fills a fixed register form ([field map](docs/product/register-field-map.md)). Low-confidence fields are flagged and must be confirmed.
3. **Safety on every turn** ([app/safety/](app/safety/)). Danger signs trigger **"Tell the nurse now."** Silence, noise or low confidence trigger **"Not sure. Please ask a person."**
4. **After the visit: sync** ([app/sync/](app/sync/)). Records wait on the device and are sent when a signal appears (store-and-forward), then mapped to DHIS2. Any SMS to the patient says only a date and the clinic's name.

Flows: [docs/product/user-flows.md](docs/product/user-flows.md). Requirements: [docs/product/prd.md](docs/product/prd.md).

## Small AI fit

| Measure | Value | Source |
|---|---|---|
| Model size on disk | TODO | [models/README.md](models/README.md) |
| RAM on the cheapest available Android | TODO | [eval/results/](eval/results/) |
| Latency per 10 s of audio | TODO | [eval/results/](eval/results/) |
| Works in airplane mode | TODO: verify | [eval/results/](eval/results/) |

The extractor and danger-sign check are rule-based, so they add no model weights. We rejected Gemma 4 E2B because it needs about 2.4 GB RAM and a 4 GB phone ([libraries registry](resources/libraries/README.md)).

## Language

- **Luganda:** patient intake and clinician dictation. WER: TODO on 20 to 30 synthetic clips, compared with a published benchmark (RQ3.1).
- **Lusoga (less-supported):** TODO: measured result or reasoned estimate (RQ3.3).
- Code-switching between Luganda and English is tested separately (RQ3.2).

## Responsible AI

- A person makes every final call. The tool informs and flags uncertainty; it never acts on anyone's behalf.
- "Not sure. Please ask a person." on low confidence and on total failure (silence, crying child, unintelligible audio).
- Danger signs come only from WHO IMCI general danger signs, Uganda Clinical Guidelines and WHO maternal danger signs. We never invent them.
- No diagnosis, no prescription, no image interpretation. Those fields are clinician only.
- Fixed list of answers: the extractor can only output values from defined field schemas. Nothing appears that nobody said.
- Data stays on the clinic device until it syncs to the clinic's DHIS2. Audio is deleted after confirmation. Consent is a recorded spoken yes. SMS says only a date and the clinic's name, because household phones are shared.

Full account, including lost or shared phones and bias: [docs/product/responsible-ai.md](docs/product/responsible-ai.md).

## Data used, and what it does not cover

Catalogue of every dataset the brief names for this track, with source, license, size and use: [resources/datasets/README.md](resources/datasets/README.md). One card per dataset in [resources/datasets/cards/](resources/datasets/cards/).

What our data does not cover:
- No open local-language clinical conversation corpus, so our test encounters are synthetic.
- No real clinic recordings: results show behaviour on scripted clips, not in a real clinic.
- Lusoga coverage: TODO.

All synthetic data is labelled as synthetic.

## Tech stack

- **App:** Expo (React Native, TypeScript) for Android.
- **Speech:** small on-device speech model, being evaluated: MMS or Sunbird AI models, run with sherpa-onnx or whisper.rn ([registry](resources/libraries/README.md)).
- **Extraction and safety:** rule-based, limited to fixed field schemas.
- **Storage and sync:** on-device queue (expo-sqlite planned), DHIS2 export.

## Quick start

These commands were run from a clean clone on 2026-10-03 with Node 24 and npm 11.

```bash
git clone https://github.com/Asia-ThePerson/Hacknation2026_WBC4Health.git
cd Hacknation2026_WBC4Health
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
| Clarity, design and inclusivity; value proposition for AI | 15% | [docs/design/design-system.md](docs/design/design-system.md), [docs/product/user-flows.md](docs/product/user-flows.md) |
| Scalability, replicability and what happens next | 10% | [docs/product/country-pack.md](docs/product/country-pack.md) |
| **Responsible AI, data and safety (pass/fail)** | gate | [docs/product/responsible-ai.md](docs/product/responsible-ai.md), [CHECKLIST.md](CHECKLIST.md) section D |

Progress against every deliverable: [CHECKLIST.md](CHECKLIST.md).

## What happens next

- **Country pack:** a new country swaps four parts: speech model, prompts, register mapping, and guideline-sourced danger-sign list ([docs/product/country-pack.md](docs/product/country-pack.md)). DHIS2 runs in more than 70 countries.
- **Regulator path:** Penda Health's approvals in Kenya are our precedent. TODO: name the equivalent Ugandan bodies (RQ7.1).

## Repo map

| Folder | What it holds |
|---|---|
| [app/](app/) | The Expo app |
| [models/](models/) | Model choice, cards, weights (gitignored) |
| [eval/](eval/) | Metrics, synthetic test sets, dated results |
| [resources/](resources/) | Dataset catalogue and cards, library registry |
| [research/](research/) | Research questions, findings, landscape review, sources |
| [docs/](docs/) | Hackathon requirements, product, design, demo, links |
| [scripts/](scripts/) | `check`, `fetch-data`, `fetch-models` |
| [.claude/skills/](.claude/skills/) | Claude Code skills, see [SKILLS.md](.claude/skills/SKILLS.md) |

## License

Code: [MIT](LICENSE). Docs: license not yet chosen.
