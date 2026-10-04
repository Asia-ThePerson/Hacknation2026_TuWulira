# CLAUDE.md

Guidance for Claude Code (and humans) working in this repo.

## Product

TuWulira. Offline, Luganda-first patient intake and record keeping for rural primary care clinics in Uganda. It gives clinicians back time lost to history-taking and paperwork, without ever diagnosing. Hack-Nation x World Bank Youth Summit, Small AI for Development, Challenge 04, Health track. **Deadline: 4 October 2026, 9:00 AM ET.**

Design hub (source of truth for flows): [Figma, TuWulira Project hub](https://www.figma.com/design/46MiynCpDjTcAiYoqmiaEr/TuWulira---Project-hub?node-id=0-1).

1. **Intake (before the visit):** a fixed question set in Luganda, with recorded prompts and Yes / No / Not sure / Ask clinician buttons, plus one spoken answer for the main problem. Rule-based danger-sign questions raise an urgent flag at once. Output: a one-screen card labelled "patient reported", never "findings". One question set, several ways in: B in clinic, staff-assisted on the intake phone (the main flow and the prototype, fully offline), B2 self-intake with earphones (optional, needs validation), A remote (basic phone, callback or SMS; design only), C paper form (design only).
2. **Consultation (during the visit):** the staff screen (behind a staff PIN) shows the queue, urgent first. The nurse adds weight and temperature; the clinician records diagnosis (HMIS 105 list), treatment and referral out. The clinician can also speak the encounter (scribe): a small on-device speech model transcribes it and a constrained extractor drafts register fields. Low-confidence fields are flagged for confirmation.
3. **Records and sync (after the visit):** answers pre-fill the OPD register (HMIS 031) and tally. Store-and-forward; only aggregate totals leave the clinic, as a DHIS2-style export. SMS to the patient says only a date and the clinic's name.

Where AI is used: Luganda speech-to-text, and turning the transcript into items from a fixed symptom list (decision D10). Deliberately rule-based: danger signs, question routing, register pre-fill and tallies.

Device model: two devices (decision D33). All AI runs on the **intake phone** (floor itel A50 2 GB, typical Galaxy A06). The **clinic device** (any Android 8+, typical Galaxy Tab A9) runs no AI and holds the queue, staff entries, register and tally. The card moves by encrypted on-screen QR code, offline; the clinic device assigns register serial numbers. One-device mode puts both roles on the intake phone behind a staff PIN. Data model: [docs/product/data-architecture.md](docs/product/data-architecture.md).

Team: Hotline Bling. Beth A and Asia A, both designer and developer. Research owners: Beth (problem and context), Asia (users and workflow).

## Non-negotiables

The brief ([docs/hackathon/requirements.md](docs/hackathon/requirements.md)) is the law. If anything disagrees with the brief, the brief wins. Never weaken these:

- Runs on a device the user already has. Core feature works offline. Model files are small enough to side-load or send over a weak connection.
- At least one interaction is in Luganda. Be ready to say how it fares in Lusoga.
- Human in the loop: a person makes the final call. The tool informs and flags uncertainty. It never acts on the user's behalf.
- Fail-safe: when unsure, say "Not sure. Please ask a person." instead of guessing. This covers total failure too: silence, crying child, unintelligible audio.
- Danger signs trigger "Tell the nurse now". The list comes only from WHO IMCI general danger signs, Uganda Clinical Guidelines and WHO maternal danger signs. **Never invent danger signs.**
- No diagnosis, no prescription, no image interpretation. Fields that imply either stay clinician-entered or are dictated and confirmed.
- Fixed list of answers: the extractor and the understanding step output only values from the field schemas in `app/shared/field-schemas.ts`.
- No hallucinations: nothing in an output that the patient or clinician did not say.
- State where data sits, who can read it, and what happens when the phone is lost or shared ([docs/product/responsible-ai.md](docs/product/responsible-ai.md)). Consent is a recorded spoken yes.
- Cite every data source with source, license and size, and state what it does not cover. Label all synthetic data.
- **Never commit secrets, real API keys or any real patient data.** Demo data is synthetic only.
- **Never invent metrics, benchmarks, quotes or results.** Leave numbers as TODO until a file in `evaluation/results/` has them. Do not machine-translate Luganda; leave it empty for a native speaker.

## Writing rules

Plain language in all docs. No em dashes. Use "patient reported" on anything patient-facing that reaches a clinician.

## Structure

| Path | What |
|---|---|
| `app/` | Expo (React Native, TypeScript) app: `intake/`, `scribe/`, `safety/`, `sync/`, `shared/` |
| `config/` | Question list JSON per language and country, and audio prompts (component 2) |
| `rules/` | Danger-sign rules (component 3), read by `app/safety/` |
| `models/` | Model choice, cards, weights (gitignored, via `scripts/fetch-models`) |
| `evaluation/` | Metrics, synthetic test sets, dated results |
| `resources/` | Dataset catalogue and cards; library registry |
| `research/` | Questions (RQ#), findings (R#), landscape review, sources |
| `docs/` | Hackathon requirements, video plan, submission text, PRD, field map, responsible AI, flows, country pack, design system, demo script, links |
| `scripts/` | `check` (repo checks), `fetch-data`, `fetch-models` |
| `archive/pre-pivot/` | Old material, kept for history |

## ID system

```
RQ# (research question) -> R# (finding) -> PR# (product requirement) -> D# (design decision) / F# (feature)
```

- RQ#: [research/questions.md](research/questions.md). R#: [research/findings.md](research/findings.md). PR#, D#, F#: [docs/product/prd.md](docs/product/prd.md).
- CHECKLIST items use a dot: A.1, D.3, F.12. They never clash with D# or F#.
- The PRD cites an R# or RQ# for every requirement. Issues, PRs, commit messages and CHECKLIST items reference IDs.

## Checklist

[CHECKLIST.md](CHECKLIST.md) is the single source of truth for deliverables and product checks. Tick an item only when its evidence link exists. Run `scripts/check` before every PR.

## Commands

```bash
scripts/check                 # repo checks
cd app && npm ci && npm test  # logic checks
npm run typecheck
npm run android               # needs a device or emulator
```

App imports use explicit `.ts` extensions so `npm test` runs with Node's type stripping. The app reads `rules/` and `config/` from the repo root; `app/metro.config.js` watches them.

## Skills

See [.claude/skills/SKILLS.md](.claude/skills/SKILLS.md) for every skill and plugin and when to use it here. In short: impeccable, emil-design-eng and design-taste-frontend (Taste) for app UI and the design system; the frontend-slides plugin for the pitch deck; agent-skills (spec, planning, test-driven development, security) for the build; ponytail to keep it small.

## graphify

- **graphify** (`.claude/skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.
