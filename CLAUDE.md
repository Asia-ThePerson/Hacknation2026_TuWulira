# CLAUDE.md

Guidance for Claude Code (and humans) working in this repo.

## Product

[PRODUCT NAME] (placeholder; use it everywhere until the team renames it). A Small AI tool for a rural primary care clinic in Uganda that gives clinicians back time lost to record keeping, without ever diagnosing. Hack-Nation x World Bank Youth Summit, Small AI for Development, Challenge 04, Health track. **Deadline: 4 October 2026, 9:00 AM ET.**

1. **Intake (before the visit):** spoken Luganda intake on the clinic's shared Android device, or by voice callback to a basic phone. Output: a card labelled "patient reported", never "findings".
2. **Scribe (during the visit):** clinician speaks the encounter; a small on-device speech model transcribes it; a constrained extractor fills a fixed register form mapped to Uganda HMIS / DHIS2. Low-confidence fields are flagged for confirmation.
3. **Sync (after the visit):** store-and-forward. SMS to the patient says only a date and the clinic's name.

Device model: hub and spokes. The model runs on one shared clinic device; patients reach it in person or by voice/SMS on the phone they already have.

Team: Beth A, Asia A. Research owners: Beth (problem and context), Asia (users and workflow).

## Non-negotiables

The brief ([docs/hackathon/requirements.md](docs/hackathon/requirements.md)) is the law. If anything disagrees with the brief, the brief wins. Never weaken these:

- Runs on a device the user already has. Core feature works offline. Model files are small enough to side-load or send over a weak connection.
- At least one interaction is in Luganda. Be ready to say how it fares in Lusoga.
- Human in the loop: a person makes the final call. The tool informs and flags uncertainty. It never acts on the user's behalf.
- Fail-safe: when unsure, say "Not sure. Please ask a person." instead of guessing. This covers total failure too: silence, crying child, unintelligible audio.
- Danger signs trigger "Tell the nurse now". The list comes only from WHO IMCI general danger signs, Uganda Clinical Guidelines and WHO maternal danger signs. **Never invent danger signs.**
- No diagnosis, no prescription, no image interpretation. Fields that imply either stay clinician-entered or are dictated and confirmed.
- Fixed list of answers: the extractor outputs only values from the field schemas in `app/shared/field-schemas.ts`.
- No hallucinations: nothing in an output that the patient or clinician did not say.
- State where data sits, who can read it, and what happens when the phone is lost or shared ([docs/product/responsible-ai.md](docs/product/responsible-ai.md)). Consent is a recorded spoken yes.
- Cite every data source with source, license and size, and state what it does not cover. Label all synthetic data.
- **Never commit secrets, real API keys or any real patient data.** Demo data is synthetic only.
- **Never invent metrics, benchmarks, quotes or results.** Leave numbers as TODO until a file in `eval/results/` has them. Do not machine-translate Luganda; leave it empty for a native speaker.

## Writing rules

Plain language in all docs. No em dashes. Use "patient reported" on anything patient-facing that reaches a clinician.

## Structure

| Path | What |
|---|---|
| `app/` | Expo (React Native, TypeScript) app: `intake/`, `scribe/`, `safety/`, `sync/`, `shared/` |
| `models/` | Model choice, cards, weights (gitignored, via `scripts/fetch-models`) |
| `eval/` | Metrics, synthetic test sets, dated results |
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

App imports use explicit `.ts` extensions so `npm test` runs with Node's type stripping.

## Skills

See [.claude/skills/SKILLS.md](.claude/skills/SKILLS.md) for every skill and plugin and when to use it here. In short: impeccable, emil-design-eng and design-taste-frontend (Taste) for app UI and the design system; the frontend-slides plugin for the pitch deck; agent-skills (spec, planning, test-driven development, security) for the build; ponytail to keep it small.

## graphify

- **graphify** (`.claude/skills/graphify/SKILL.md`) - any input to knowledge graph. Trigger: `/graphify`
When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.
