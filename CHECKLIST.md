# Checklist

The one place we track everything needed to submit and to trust the product. **Tick an item only when its evidence link exists.** `scripts/check` reports on some items but never ticks boxes; a person does.

Each item: **ID**, the item, then *owner*, *evidence* (file, result or URL), *source* (brief section, RQ#, or "team check"). IDs use a dot (A.1, D.3) so they never clash with design decisions (D#) or features (F#).

## Status

| | |
|---|---|
| Deadline | **4 October 2026, 9:00 AM ET** (confirm on Hack-Nation's site; the brief says "end of the weekend") |
| Overall | **5 of 71 done (7%)** |
| Responsible AI gate | **At risk.** 0 of 10 done. Design is written in [docs/product/responsible-ai.md](docs/product/responsible-ai.md); nothing is verified yet. |
| Next three open items | 1. A.4 make the repo public. 2. B.1 problem statement (needs RQ1.1). 3. D.3 verify the danger-sign list against its sources (RQ4.1). |

Last updated: 2026-10-04.

## A. Required deliverables (brief 08)

- [ ] **A.1** Application form submitted on Hack-Nation's site before the weekend. *Owner:* TBD. *Evidence:* TODO confirmation email or screenshot. *Source:* brief 08.
- [ ] **A.2** Working prototype submitted, with code or a link to it. *Owner:* TBD. *Evidence:* TODO link in [docs/links.md](docs/links.md). *Source:* brief 08.
- [ ] **A.3** Video, 2 to 5 minutes, uploaded (no video means no shortlist). *Owner:* TBD. *Evidence:* TODO link in [docs/links.md](docs/links.md). *Source:* brief 08.
- [ ] **A.4** Repo set to public and linked from the submission. *Owner:* Asia. *Evidence:* TODO. *Source:* team check (brief asks for "the code, or a link to it").
- [ ] **A.5** Submission form completed before the deadline. *Owner:* TBD. *Evidence:* TODO screenshot in [docs/links.md](docs/links.md). *Source:* brief 08.
- [ ] **A.6** Every team member is aged 18 to 35. *Owner:* Beth, Asia. *Evidence:* TODO confirm. *Source:* brief 04. **(Added from the brief.)**
- [ ] **A.7** Proof it works: at least one measured example (for example a Luganda conversation transcribed and filled into the form). *Owner:* TBD. *Evidence:* TODO file in [evaluation/results/](evaluation/results/). *Source:* brief 05. **(Added from the brief.)**

## B. Video contents (brief 08)

Plan: [docs/hackathon/video-plan.md](docs/hackathon/video-plan.md).

- [ ] **B.1** Problem statement in the exact template: "Because of this tool, [user] will [action] by [when] that they would otherwise [not do / do late / do worse]; we know because [evidence]". *Owner:* Beth. *Evidence:* TODO. *Source:* brief 08; RQ1.1.
- [ ] **B.2** AI capabilities, and why SMS, a spreadsheet or a search would not do the same job. *Owner:* TBD. *Evidence:* TODO. *Source:* brief 08.
- [ ] **B.3** Guardrails named on screen. *Owner:* TBD. *Evidence:* TODO. *Source:* brief 08.
- [ ] **B.4** Tool demo showing the end-to-end user journey. *Owner:* TBD. *Evidence:* TODO; script in [docs/demo/demo-script.md](docs/demo/demo-script.md). *Source:* brief 08.
- [ ] **B.5** Where the tool sits in the user's day, plus tech stack. *Owner:* TBD. *Evidence:* TODO. *Source:* brief 08.
- [ ] **B.6** Our take on what localizing AI development means. *Owner:* TBD. *Evidence:* TODO. *Source:* brief 08.
- [ ] **B.7** "Not sure, ask a person" path shown in the demo itself. *Owner:* TBD. *Evidence:* TODO. *Source:* landscape review section 8 (the brief requires the fail-safe, section 09).
- [ ] **B.8** Runtime checked: between 2 and 5 minutes. *Owner:* TBD. *Evidence:* TODO. *Source:* brief 08.

## C. Brief rules (brief 06)

- [ ] **C.1** Runs on a device the user already has (assumption stated). *Owner:* Asia. *Evidence:* TODO answer in [research/questions.md](research/questions.md). *Source:* brief 06; RQ2.2.
- [ ] **C.2** Core feature works with airplane mode on. *Owner:* TBD. *Evidence:* TODO recording or results file. *Source:* brief 06.
- [ ] **C.3** Model file sizes measured and listed. *Owner:* TBD. *Evidence:* TODO [models/README.md](models/README.md). *Source:* brief 06; RQ6.1.
- [ ] **C.4** At least one interaction in Luganda. *Owner:* TBD. *Evidence:* TODO. Plan (D14): transcribe real Luganda speech from Common Voice test clips in the demo, and say so on screen. *Source:* brief 06.
- [ ] **C.5** Lusoga answer prepared: measured result or a reasoned estimate. *Owner:* TBD. *Evidence:* TODO. *Source:* brief 06; RQ3.3.

## D. Responsible AI gate (pass/fail, brief 09)

Failing any one of these fails the entry. Details: [docs/product/responsible-ai.md](docs/product/responsible-ai.md).

- [ ] **D.1** Human makes every final call; no action taken on the user's behalf. *Owner:* TBD. *Evidence:* TODO. *Source:* brief 06, 09.
- [ ] **D.2** "Ask a person" path covers low confidence and total failure. *Owner:* TBD. *Evidence:* logic in [app/safety/index.ts](app/safety/index.ts); TODO edge-case clip results. *Source:* brief 09; RQ4.4.
- [ ] **D.3** Danger-sign list sourced from WHO / Uganda guidelines, with citation. *Owner:* TBD. *Evidence:* draft in [app/safety/danger-signs.ts](app/safety/danger-signs.ts); TODO verify each entry. *Source:* RQ4.1.
- [ ] **D.4** Danger-sign sensitivity reported separately from overall accuracy. *Owner:* TBD. *Evidence:* TODO [evaluation/results/](evaluation/results/). *Source:* RQ4.2.
- [ ] **D.5** Register field map done: AI fill, AI draft plus confirm, clinician only. *Owner:* Beth. *Evidence:* draft in [docs/product/register-field-map.md](docs/product/register-field-map.md); TODO check against HMIS. *Source:* RQ4.3.
- [ ] **D.6** No diagnosis or prescription in any output. *Owner:* TBD. *Evidence:* TODO results file; logic check in [app/check.test.ts](app/check.test.ts). *Source:* team rule.
- [ ] **D.7** Data location, access, and lost or shared phone answered in responsible-ai.md. *Owner:* TBD. *Evidence:* draft in [docs/product/responsible-ai.md](docs/product/responsible-ai.md); TODO items still open. *Source:* brief Annex A.1.
- [ ] **D.8** Consent flow: recorded spoken yes. *Owner:* TBD. *Evidence:* TODO. *Source:* RQ5.1.
- [ ] **D.9** SMS content limited to date and clinic name. *Owner:* TBD. *Evidence:* TODO; logic check in [app/check.test.ts](app/check.test.ts). *Source:* RQ5.2.
- [ ] **D.10** Bias and language limits stated. *Owner:* TBD. *Evidence:* TODO complete the bias section of [docs/product/responsible-ai.md](docs/product/responsible-ai.md). *Source:* brief 09.

## E. Data grounding (scored, brief 07)

- [ ] **E.1** Every dataset has a card with source, license, size and "What this does not cover". *Owner:* TBD. *Evidence:* [resources/datasets/cards/](resources/datasets/cards/) (6 of the datasets we use so far). *Source:* brief 7.2.
- [ ] **E.2** Every license verified; none left as "to verify". *Owner:* TBD. *Evidence:* TODO `scripts/check` pass. *Source:* brief 07.
- [x] **E.3** All synthetic data labelled. *Owner:* Asia. *Evidence:* `scripts/check` "synthetic labels" passed on 2026-10-03; see [evaluation/test-sets/README.md](evaluation/test-sets/README.md). *Source:* brief 7.2; RQ5.3.
- [ ] **E.4** Problem evidence cited with source, year and country. *Owner:* Beth. *Evidence:* TODO [research/findings.md](research/findings.md). *Source:* brief 7.2; RQ1.1, RQ1.2.
- [ ] **E.5** Problem evidence notes when the closest figures come from modelled or synthetic data. *Owner:* Beth. *Evidence:* TODO. *Source:* brief 7.2. **(Added from the brief.)**

## F. Product checks (team checks)

Function
- [ ] **F.1** Intake works end to end in Luganda. *Owner:* TBD. *Evidence:* TODO. *Source:* team check.
- [ ] **F.2** Scribe (clinician dictation, component 11, core scope per D11) works end to end: dictation drafts register fields, flagged fields block save, diagnosis and treatment stay clinician-entered. *Owner:* TBD. *Evidence:* TODO. *Source:* team check.
- [ ] **F.3** Intake card says "patient reported". *Owner:* TBD. *Evidence:* TODO screenshot; logic in [app/intake/intake-card.ts](app/intake/intake-card.ts). *Source:* RQ2.4.
- [ ] **F.4** Flagged fields require confirmation before saving. *Owner:* TBD. *Evidence:* TODO screen recording; logic check in [app/check.test.ts](app/check.test.ts). *Source:* team check.

- [ ] **F.21** Question list is one JSON file per language and country, and changing a question needs no code change. *Owner:* TBD. *Evidence:* draft in [config/questions.lg-UG.json](config/questions.lg-UG.json); TODO app reads it. *Source:* PR16; RQ7.3.
- [ ] **F.22** Staff screen behind a staff PIN; storage encrypted; voice clips deleted when the visit closes. *Owner:* TBD. *Evidence:* TODO. *Source:* PR17; RQ5.1.
- [ ] **F.23** OPD register row (HMIS 031) and tally pre-filled from intake, with CSV export. Tally uses HMIS 105 codes and age bands ([config/hmis105-diagnoses.json](config/hmis105-diagnoses.json)). *Owner:* TBD. *Evidence:* TODO. *Source:* PR18; RQ1.2.
- [ ] **F.24** "Export totals" produces a DHIS2-style file with aggregate totals only, no names. *Owner:* TBD. *Evidence:* TODO. *Source:* PR13; R5.

Offline and sync
- [ ] **F.5** Full flow works in airplane mode. *Owner:* TBD. *Evidence:* TODO. *Source:* team check.
- [ ] **F.6** Records queue offline, then sync when online. *Owner:* TBD. *Evidence:* TODO. *Source:* team check.
- [ ] **F.7** No duplicates or lost records after sync. *Owner:* TBD. *Evidence:* TODO results file. *Source:* RQ6.2.

Device
- [ ] **F.8** Size, RAM, latency and battery measured on the cheapest available Android. *Owner:* TBD. *Evidence:* TODO. *Source:* RQ6.1, RQ6.3.

Safety edge cases (each tested with a clip in [evaluation/test-sets/](evaluation/test-sets/))
- [ ] **F.9** Silence. *Owner:* TBD. *Evidence:* TODO. *Source:* RQ4.4.
- [ ] **F.10** Crying child. *Owner:* TBD. *Evidence:* TODO. *Source:* RQ4.4.
- [ ] **F.11** Code-switching between Luganda and English. *Owner:* TBD. *Evidence:* TODO. *Source:* RQ3.2.
- [ ] **F.12** Danger word said indirectly. *Owner:* TBD. *Evidence:* TODO. *Source:* RQ4.2.
- [ ] **F.13** Unknown local illness term. *Owner:* TBD. *Evidence:* TODO. *Source:* RQ3.4.

Speech quality
- [ ] **F.14** Luganda WER measured on 20 to 30 clips and compared with a published benchmark. *Owner:* TBD. *Evidence:* TODO. *Source:* RQ3.1.

Inclusivity
- [ ] **F.15** Usable by older and low-literacy users. *Owner:* Asia. *Evidence:* TODO. *Source:* RQ2.3.
- [ ] **F.16** Private or quiet-mode option for sensitive symptoms. *Owner:* Asia. *Evidence:* TODO. *Source:* RQ2.1.
- [ ] **F.17** Text readable and touch targets usable. *Owner:* TBD. *Evidence:* TODO. *Source:* team check.

Automation bias
- [ ] **F.18** Clinician view keeps their own questions visible; the intake card never reads as findings. *Owner:* Asia. *Evidence:* TODO. *Source:* RQ2.4.

Design
- [ ] **F.19** Screens match [docs/design/design-system.md](docs/design/design-system.md) tokens. *Owner:* TBD. *Evidence:* TODO. *Source:* team check.
- [ ] **F.20** Design skills review run and findings logged. *Owner:* TBD. *Evidence:* TODO. *Source:* team check.

## G. Repo checks

- [ ] **G.1** `scripts/check` passes. *Owner:* TBD. *Evidence:* TODO (fails today on "to verify" licenses, see E.2). *Source:* team check.
- [x] **G.2** Quick start runs on a clean clone. *Owner:* Asia. *Evidence:* README quick start run from a fresh clone of `setup/repo-structure` on 2026-10-03 (`npm ci`, `npm test`: 8 passed, `npm run typecheck`: clean). *Source:* team check.
- [x] **G.3** No secrets, real API keys or real patient data in the repo or its git history. *Owner:* Asia. *Evidence:* `scripts/check` "secrets" (working tree and history) passed on 2026-10-03. Real patient data: none added; all data files are labelled synthetic. *Source:* team check.
- [ ] **G.4** No dead links in README or [docs/links.md](docs/links.md). *Owner:* TBD. *Evidence:* relative links pass `scripts/check`; TODO external links still placeholders. *Source:* team check.
- [x] **G.5** Every skill in `.claude/skills` has a valid SKILL.md. *Owner:* Asia. *Evidence:* `scripts/check` "skills" passed on 2026-10-03 (69 skills); [.claude/skills/SKILLS.md](.claude/skills/SKILLS.md). *Source:* team check.
- [x] **G.6** Disclaimer in README: "Prototype for a hackathon. Not a medical device. Uses synthetic data only." *Owner:* Asia. *Evidence:* [README.md](README.md). *Source:* team check.
- [ ] **G.7** `setup/repo-structure` merged into main through a PR. *Owner:* Asia. *Evidence:* TODO PR link. *Source:* team check.

## H. Final hour

- [ ] **H.1** Every Tier 1 research question answered or marked as a stated assumption. *Owner:* Beth, Asia. *Evidence:* [research/questions.md](research/questions.md). *Source:* team check.
- [ ] **H.2** Every measured number in the README matches evaluation/results. *Owner:* TBD. *Evidence:* TODO. *Source:* team check.
- [ ] **H.3** Video, demo and repo links tested from a logged-out browser. *Owner:* TBD. *Evidence:* TODO. *Source:* team check.
- [ ] **H.4** Submission text copied from [docs/hackathon/submission.md](docs/hackathon/submission.md). *Owner:* TBD. *Evidence:* TODO. *Source:* team check.
- [ ] **H.5** Submitted, with a screenshot of the confirmation added to [docs/links.md](docs/links.md). *Owner:* TBD. *Evidence:* TODO. *Source:* team check.
