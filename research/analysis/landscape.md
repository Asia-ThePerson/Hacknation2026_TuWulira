# Landscape review and idea scoring

Converted from [../sources/brief/HackNation_Ch04_Landscape_and_Ideas.docx](../sources/brief/HackNation_Ch04_Landscape_and_Ideas.docx) (prepared 3 October 2026). Nothing has been added that is not in that document. Notes marked **[Repo note]** are ours and point to where a later decision changed something.

**Decision:** we are building **H1 (offline voice-to-register scribe) + H2 (Dari, localized)** as one clinic flow: intake before the visit, then the scribe during it.

## 1. The constraint the brief buries

Noor's own phone is a basic phone she uses for calls, SMS and mobile money. She only uses the smartphone on weekends, when her daughter is home. The rules require the tool to run on a device the user already has, with model files small enough to side-load. That combination rules out most of today's on-device AI.

Google's newest edge model, Gemma 4 E2B, runs offline on Android, but it loads into about 2.4 GB of RAM and needs a phone with at least 4 GB RAM and 3 GB free storage. A Ugandan-language fine-tune of it (Sunbird's Sunflower app) requires a flagship Android such as a Pixel 7 or Galaxy S22. Noor does not have that phone.

The model to copy is Wadhwani AI's CottonAce, which the brief cites. To run on low-end phones, the team compressed its model from 268 MB to 5 MB and deployed it offline with PyTorch Mobile. Its distribution model matters too: each village has a lead farmer who relays the app's alerts to other farmers.

**Recommended architecture: hub and spokes.** A tiny task-specific model runs on one shared intermediary device: the cooperative's lead farmer, the clinic nurse, or the tour guide. Noor reaches it through SMS, a voice call, or a weekend smartphone session. This answers the "device she already has" rule honestly instead of assuming she owns a smartphone.

## 2. The second trap: could SMS do this?

Every precedent in the brief shows plain SMS delivering big wins with no AI. Project Mwana cut the time to deliver infant HIV results from 66 days to 33 on average. With Uganda's mTrac, stock-outs of malaria drugs (ACTs) fell from 25.2% to 13.8%. Coffee price broadcasting by SMS has existed since at least 2008, when a UN pilot sent prices from five buyers to about 150 farmers.

Judges will apply the brief's test directly, so the AI must do something SMS cannot. That means one of three things:

- understanding unstructured speech or text in a local language,
- reading an image, or
- making sense of a pile of scattered input.

Pushing a fact out to people is not enough.

## 3. Health (Annex A)

### What exists

The strongest evidence in this sector is image screening. WHO's 2021 recommendation on computer-aided detection for TB chest X-rays was based on three products: CAD4TB, Lunit INSIGHT CXR and qXR. The brief deliberately puts imaging and diagnosis out of bounds, so that path is closed.

The most relevant recent proof point is Penda Health's AI Consult in Nairobi. Clinicians using it made 16% fewer diagnostic errors and 13% fewer treatment errors, and history-taking errors fell by 32%. It runs on GPT-4o inside the electronic health record of urban clinics, so it depends on the cloud and existing infrastructure. IFC's TechEmerge Health paired 16 health-tech companies with 15 private providers in Kenya, Uganda and Ethiopia; the brief notes those tools still needed 2G/3G.

### Gaps

Nothing comparable exists offline at a rural public clinic. The brief names burdensome record-keeping as the reason doctors cannot give each patient attention, and Penda's largest gain was in history-taking. Documentation is the clearest opportunity.

### H1: Offline voice-to-register scribe

The clinician speaks the encounter in the local language. A small speech model (MMS) transcribes it, and a constrained extractor fills a fixed register form that matches a DHIS2 export. Any field the model is unsure of is flagged for the clinician to confirm. Records are stored on the phone and sent when a signal appears. The tool never diagnoses, so it stays inside the hard limits, and its fixed list of answers can be checked for safety.

### H2: Dari, localized

Dari's guided intake already produces a plain summary for the patient and a SOAP note for the doctor, which maps onto the challenge's documentation, referral and follow-up examples. The intake would run in the waiting room on the clinic's phone, or through a voice callback to a basic phone, with the patient summary returned by SMS. Four changes would make it compliant:

- Swap cloud LLM translation for an on-device speech pipeline.
- Restrict outputs to what the patient reported.
- Add a red-flag rule that says "not sure, ask the nurse now."
- Answer the brief's data question: what happens when the phone is lost or shared.

Moving Dari from LEP immigrants in Toronto to a rural clinic is itself a strong answer to "what does localizing AI mean to you."

> **[Repo note] The SMS trap.** H2 above returns "the patient summary by SMS". We do not do that. Household phones are shared (RQ5.2), so any SMS says only a date and the clinic's name. See [docs/product/responsible-ai.md](../../docs/product/responsible-ai.md).

## 4. Other sectors (summary)

The review also covered Agriculture (Annex B: A1 co-op field notebook, A2 parchment quality and price check, A3 EUDR plot passport) and Tourism (Annex C: T1 Visitor Voice, T2 enquiry reply drafter, T3 story-to-listing). See the source document for the full text. They appear below only for the scoring comparison.

## 5. Scoring against the judging rubric

Each idea is scored 1 to 5 on each weighted criterion from section 09 of the brief. These are judgment calls; re-score them as a team. Responsible AI is pass/fail and is treated as a gate, not part of the total.

Scale: 5 means it can clearly be demonstrated with what is available this weekend. 3 means plausible but resting on assumptions that cannot be tested yet. 1 to 2 means a judge is likely to push back. The weighted total is the sum of score x weight.

| Idea | Built 25% | Relevance 20% | Data 15% | Evidence 15% | AI value 15% | Scale 10% | Weighted |
|---|---|---|---|---|---|---|---|
| **H1 Voice scribe** | 4 | 5 | 4 | 4 | 5 | 5 | **4.45** |
| T1 Visitor Voice | 5 | 4 | 4 | 4 | 5 | 4 | 4.40 |
| T2 Reply drafter | 5 | 4 | 4 | 4 | 4 | 4 | 4.25 |
| A1 Co-op notebook | 4 | 4 | 5 | 4 | 4 | 4 | 4.15 |
| **H2 Dari, localized** | 4 | 4 | 3 | 3 | 5 | 4 | **3.85** |
| A3 EUDR passport | 3 | 5 | 4 | 3 | 2 | 5 | 3.60 |
| A2 Quality/price | 3 | 5 | 3 | 3 | 3 | 4 | 3.50 |
| T3 Story-to-listing | 4 | 3 | 3 | 3 | 3 | 4 | 3.35 |

"AI value" is the review's short name for the brief's criterion "Clarity, design and inclusivity / Value proposition for AI".

Some ideas combine well. **H1 and H2 form a single clinic flow: intake before the visit, then the scribe during it.**

### H1 rationale (4.45)

| Criterion | Score | Why |
|---|---|---|
| Built | 4 | Speech recognition plus filling a fixed form can be demoed offline in a weekend. Not a 5 because local-language transcription with MMS is the shakiest link and the whole chain must run on a phone. |
| Relevance | 5 | The brief names burdensome record-keeping outright and lists documentation in the challenge. Penda's biggest gain was a 32% drop in history-taking errors. |
| Data | 4 | Speech data (MMS, Common Voice), a target schema (DHIS2) and problem evidence (Service Delivery Indicators). Minus one: no open local-language clinical conversation corpus, so test encounters are synthetic. |
| Evidence | 4 | Field-level accuracy and flag rate can be measured; real clinic use cannot be shown. |
| AI value | 5 | SMS cannot turn speech into a structured record. |
| Scale | 5 | DHIS2 is used in more than 70 countries; a new country is mostly a schema swap. |

### H2 rationale (3.85)

| Criterion | Score | Why |
|---|---|---|
| Built | 4 | The existing repo is a head start; moving to on-device offline speech is a substantial rework. |
| Relevance | 4 | Intake and referral are named in the challenge, but users are patients with low digital literacy, so adoption is a risk. |
| Data | 3 | Dari's data was built for Cantonese speakers and TCM terms in Canada; little matches a rural intake setting, so mostly synthetic. |
| Evidence | 3 | Hard to prove value without a real clinic workflow. |
| AI value | 5 | A conversational intake producing two different summaries is clearly beyond SMS. |
| Scale | 4 | Applicable to other clinics and languages with new data. Note: highest pass/fail risk, since patient health conversations can drift into triage. |

## 6. Risks we carry by combining H1 + H2

1. **H2's weaker data and evidence scores** (3 and 3). Dari's data does not match a rural Ugandan intake, so intake test data is mostly synthetic, and value is hard to prove without a real clinic workflow.
2. **Highest pass/fail risk.** Patient health conversations can drift into triage. On the pass/fail gate, H2 and H1 carry the most risk of all ideas reviewed; tourism carries the least.
3. **The SMS trap.** Every precedent shows SMS winning without AI, so the AI must do what SMS cannot (here: turn unstructured Luganda speech into a structured record). Separately, sending a patient summary by SMS to a shared phone is a disclosure risk (see the repo note above).
4. **MMS local-language transcription** is the shakiest technical link (H1 Built score).

## 7. What would flip the ranking

Built and Relevance together make up 45% of the score, so team skills matter most:

- Strong speech/ML engineer: H1 holds the top spot.
- Mostly design and no-code builders: T1 and T2 move ahead, because they are the most likely to work end to end.

## 8. Must-haves for any entry

- Name the local language, and say how the tool would fare in a less-supported one.
- Include an explicit "what our data does not cover" section, which is scored.
- Show the "not sure, ask a person" path in the demo video itself.

## 9. Sources (as listed in the review)

- Challenge 04 brief: HackNation_Debrief_04.pdf (Hack-Nation x World Bank Youth Summit)
- UNICEF, Project Mwana: unicef.org/innovation/stories/project-mwana
- Communication Initiative, Medicine Tracking System (mTrac): global.comminit.com/content/medicine-tracking-system-mtrac
- PLOS Global Public Health, Scanned: global investments in CAD and ultraportable X-ray for TB (PMC11913293)
- OpenAI, Pioneering an AI clinical copilot with Penda Health (July 2025); arXiv 2507.16947
- IFC, Building Africa's Health Resilience (TechEmerge Health East Africa), 2023
- Wadhwani AI, CottonAce; The Next Web, How AI is helping Indian cotton farmers (Oct 2020)
- SunbirdAI sunflower-app (GitHub); Gemma 4 release coverage (April 2026)
- Agriculture and tourism sources: see the source document.
