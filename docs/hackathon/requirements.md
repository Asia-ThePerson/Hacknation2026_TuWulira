# Hackathon requirements

Small AI for Development Hackathon, Challenge 04, Health track (Annex A). Hack-Nation x World Bank Youth Summit. Source: the Challenge 04 brief (see [research/sources/brief/README.md](../../research/sources/brief/README.md)). Section numbers below are the brief's. **If anything in this repo disagrees with the brief, the brief wins.**

Every requirement here has a matching item in [CHECKLIST.md](../../CHECKLIST.md).

## Key dates (brief 04)

| What | When |
|---|---|
| Application form (Hack-Nation's Global AI Hackathon site) | Before the weekend |
| Competition weekend | 3 to 4 October 2026 |
| Submission | By the end of the weekend. Team deadline: **4 October 2026, 9:00 AM ET** (TODO: confirm the exact time on Hack-Nation's site; the brief does not give one) |
| Shortlist by expert evaluators | 5 to 6 October |
| Ignite Talk by winners, Seoul | 21 October 2026 |

Eligibility: every entrant is aged 18 to 35 (brief 04).

## The challenge (brief 05, Annex A)

Design and demonstrate a Small AI solution that improves one meaningful part of Noor's access to primary care, or a frontline worker's ability to serve her. The brief's examples: screening support, documentation, referral, follow-up or continuity of care. Our choice: **documentation** (scribe) plus **intake** before the visit.

By the end of the weekend we need:
- **A working prototype** (phone app, chatbot, SMS service, voice line, and so on).
- **A clear answer to what the AI is and why it beats other digital tools.** If SMS, a spreadsheet or a Google search could do the same job, AI may not be the right tool.
- **Proof it works**, for example a conversation it helps transcribe or translate.

## The rules (brief 06)

| Rule | How we meet it | Checklist |
|---|---|---|
| Runs on a device the user already has | One shared Android device at the clinic (hub); patients reach it in person or by voice/SMS on the phone they already have (spokes). Assumption to verify: RQ2.2. | C |
| Core feature works offline | Speech model and extractor run on the device. Records queue until a signal appears. | C, F |
| Model files are small enough to side-load or send over a weak connection | Measured sizes go in [models/README.md](../../models/README.md) and [evaluation/results/](../../evaluation/results/). RQ6.1. | C |
| At least one interaction is in a named local language | **Luganda** (intake and dictation). Expect to be asked about a less-supported one: **Lusoga** (RQ3.3). | C |

## AI guardrails (brief 06)

- **Human in the loop.** A person makes the final call. The tool informs a decision and flags what it is unsure of. It does not act on the user's behalf. Any agentic step must check in with the user. (We have no agentic steps.)
- **Avoid hallucinations.** Nothing appears in an output that the patient or clinician did not say.

## Data (brief 07)

- Cite every data source. The listed datasets are suggestions; check the terms yourself, because access conditions change.
- A strong entry uses both layers: **common** datasets (section 7.3) and **sector** datasets (Annex A.2).
- **Data that shows the problem:** cite source, year and country. Note if the closest figures come from modelled or synthetic data.
- **Data you build with:** name every dataset, its source, its license and its size. **State what your data does not cover. This is scored.**
- Synthetic data is allowed if it is labelled.
- Annex A lists no imaging or diagnosis datasets because interpreting them is out of bounds.
- Health entries must state **where the data sits, who can read it, and what happens when the phone is lost or shared** (Annex A.1).

Catalogue: [resources/datasets/README.md](../../resources/datasets/README.md).

## Deliverables (brief 08)

1. **Before the weekend:** application form on Hack-Nation's Global AI Hackathon site.
2. **Prototype:** the working tool, with the code or a link to it.
3. **Video, 2 to 5 minutes.** Entries without a video do not make the shortlist. It must cover:
   - **Problem statement**, one sentence, in this exact template:
     > Because of this tool, [user] will [action] by [when] that they would otherwise [not do / do late / do worse]; we know because [evidence].
   - **AI capabilities:** what the tool does with AI, why SMS, a spreadsheet or a search would not do the same job, and the guardrails in place.
   - **Tool demo:** the end-to-end user journey (slide deck or screen recording).
   - **The challenge or gap:** where the tool sits in the user's day (when they open it, what they do, what happens next), plus tech stack details.
   - **Your take:** what localizing AI development means to you.

Plan: [video-plan.md](video-plan.md). Submission text: [submission.md](submission.md).

## Judging criteria (brief 09)

| Criterion | Weight | The question judges ask | Our evidence |
|---|---|---|---|
| The built solution (Small AI fidelity) | 25% | Does the tool work end to end within the constraints of the sector? | [app/](../../app/), [evaluation/results/](../../evaluation/results/), [models/cards/](../../models/cards/) |
| Development relevance and impact | 20% | Is this a real problem from the sector brief, and does the outcome matter to the person it is built for? | [research/findings.md](../../research/findings.md), [docs/product/prd.md](../product/prd.md) |
| Data grounding | 15% | Does the tool help address an identified gap in the data, and is the data modelling sound? | [resources/datasets/](../../resources/datasets/) |
| Evidence it works | 15% | Does the solution fit the challenges identified in the sector, and does it add other constraints? | [evaluation/metrics.md](../../evaluation/metrics.md), [evaluation/results/](../../evaluation/results/) |
| Clarity, design and inclusivity; value proposition for AI | 15% | What does the tool do with AI, and would a simpler tool (SMS, a spreadsheet, a search) do the same job? | [docs/design/design-system.md](../design/design-system.md), [docs/product/user-flows.md](../product/user-flows.md) |
| Scalability, replicability and what happens next | 10% | Could another setting reuse this? | [docs/product/country-pack.md](../product/country-pack.md) |
| **Responsible AI, data and safety** | **Pass/fail** | Are the limits respected, and is the account of privacy, consent, bias and human oversight credible? | [docs/product/responsible-ai.md](../product/responsible-ai.md) |

## The Responsible AI gate (brief 09, pass/fail)

A confident wrong answer is costly when it touches someone's access to essential services. Each entry must include a **fail-safe**: the AI signposts to a decision-maker when the data it is acting on is not enough for a definitive answer ("not sure, ask a person") instead of guessing, and a human stays in the loop.

Our gate items are CHECKLIST section D. Failing any one of them fails the entry, whatever the score.

## Team rules that go beyond the brief

These are our own choices, stricter than the brief. They are listed separately so nobody mistakes them for brief text.

| Team rule | Why |
|---|---|
| No diagnosis, no prescription, no image interpretation in any output | The brief rules imaging and diagnosis datasets out of bounds. We go further to keep the pass/fail risk low (landscape review: H1 + H2 carry the highest gate risk). |
| Danger signs come only from WHO IMCI general danger signs, Uganda Clinical Guidelines and WHO maternal danger signs | Inventing a list fails the gate (RQ4.1). |
| The extractor can only output values from defined field schemas | The brief's "fixed list of answers" glossary entry: if it can say anything, it cannot be checked for safety. |
| SMS to a patient says only a date and the clinic's name | Household phones are shared (RQ5.2). |
| Consent is a recorded spoken yes | RQ5.1. |
| Repo is public at submission | Lets judges read the code. The brief only asks for "the code, or a link to it". |
| Show "not sure, ask a person" in the video itself | Landscape review section 8. |
