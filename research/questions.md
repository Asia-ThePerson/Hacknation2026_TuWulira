# Research questions

Imported from [sources/brief/Dari_Clinic_Research_Questions.docx](sources/brief/Dari_Clinic_Research_Questions.docx) (3 October 2026). Numbering is kept as RQ1.1, RQ1.2 and so on.

**How to use this file.** When a question is answered, set Status to `answered` (or `assumption` if you are stating an assumption instead), write the answer in one or two sentences, and link the evidence. Then add a numbered finding to [findings.md](findings.md) that cites the RQ. Requirements in [docs/product/prd.md](../docs/product/prd.md) cite the R# or RQ#.

**Tiers.** Tier 1 decides whether the entry passes the Responsible AI gate and whether the video's problem statement holds up. Tier 2 strengthens the entry. Tier 3 belongs in the video's "what happens next" section, not this weekend's build.

> **Open point (Tier 1 count).** The source doc says "The 13 Tier 1 questions" but its list names 12 (shaded rows match those 12). RQ3.4 is shaded a different colour in the doc and may be the 13th. It is marked Tier 2 below until the team decides.

## What to do first

The 13 Tier 1 questions shape the video and the pass/fail standing:

- RQ1.1 and RQ1.2 ground the problem statement.
- RQ2.1 and RQ2.2 test the device and privacy assumptions.
- RQ3.1 and RQ3.2 decide technical credibility.
- RQ4.1 to RQ4.3 and RQ5.1 to RQ5.2 secure the Responsible AI gate.
- RQ6.1 is the one number judges will look for.

Most can be answered from documents and the team's own test recordings. The fastest first-hand evidence would come from a few short calls with Ugandan nurses or clinical officers, using a cut-down version (about five questions) of Dari's existing clinician interview guide, focused on documentation burden, intake, and trust in AI.

## Status summary

| Tier | Total | Open | Answered or assumption |
|---|---|---|---|
| Tier 1 | 12 | 12 | 0 |
| Tier 2 | 11 | 11 | 0 |
| Tier 3 | 1 | 1 | 0 |

## 1. Problem and context

Rubric criterion: Development relevance and impact (20%). Owner: Beth.

| ID | Tier | Question | Why it matters | How to answer this weekend | Owner | Status | Answer | Evidence |
|---|---|---|---|---|---|---|---|---|
| RQ1.1 | 1 | How much of a frontline health worker's time goes to documentation, and which registers and forms do they fill in at a rural Ugandan health centre? | It's the evidence behind your one-sentence problem statement. | Service Delivery Indicators (Uganda) and DHS/Service Provision Assessment, plus Uganda MoH HMIS form documentation. | Beth | open | | |
| RQ1.2 | 1 | Is the facility's record digital (DHIS2/eCHIS) or paper first, then transcribed to the monthly report? | It decides whether your output is a DHIS2 export or a digital copy of a paper register. | DHIS2 Uganda documentation, and mTrac's history of feeding DHIS2. | Beth | open | | |
| RQ1.3 | 2 | Who currently does intake: the receptionist, a nurse, or nobody? How long does a patient wait, and how long is the consult? | It shows whether the intake mode saves real time or just adds a step. | Published time-motion studies of Ugandan primary care, plus SDI caseload data. | Beth | open | | |

## 2. Users and workflow

Rubric criterion: Clarity, design and inclusivity (15%). Owner: Asia.

| ID | Tier | Question | Why it matters | How to answer this weekend | Owner | Status | Answer | Evidence |
|---|---|---|---|---|---|---|---|---|
| RQ2.1 | 1 | Will patients speak symptoms aloud in a crowded waiting room? | This is the biggest privacy and adoption risk. Women, and anyone with stigmatized conditions (HIV, reproductive health), may not. | Published research on privacy and disclosure in African primary care. Test a quiet-corner or whisper-mode option. | Asia | open | | |
| RQ2.2 | 1 | Does the clinic actually have a shared Android phone or tablet, and who looks after it? | This is your "device the user already has" claim. | Uganda eCHIS and VHT device rollouts, plus SDI equipment data. If unclear, state it as an assumption. | Asia | open | | |
| RQ2.3 | 2 | How comfortable are older and low-literacy patients with a recorded voice asking questions? | Inclusivity, and how well intake completes. | Quick remote tests with 3 to 5 Luganda speakers from different age groups, using your recorded prompts. | Asia | open | | |
| RQ2.4 | 2 | Does seeing the intake card first make the clinician anchor on what the patient said and skip their own questions? | Automation bias. Judges will ask whether the tool lowers the quality of care. | Penda's AI Consult write-up on keeping clinicians in control. Design the card to say "patient reported," never "findings." | Asia | open | | |

## 3. Language and speech

Rubric criterion: The built solution, Small AI fidelity (25%). Owner: TBD.

| ID | Tier | Question | Why it matters | How to answer this weekend | Owner | Status | Answer | Evidence |
|---|---|---|---|---|---|---|---|---|
| RQ3.1 | 1 | What word error rate do the best small Luganda speech models reach, and is it good enough for register fields? | Your core technical risk. Name the model and report its benchmark score. | Sunbird AI's published benchmarks (SALT), FLEURS Luganda, and your own test on 20 to 30 recorded clips. | TBD | open | | |
| RQ3.2 | 1 | How do patients actually talk about symptoms: in Luganda, in English medical words, or a mix? | Code-switching breaks most speech models. | Common Voice and Sunbird transcripts, plus your test recordings. Ask native speakers to role-play visits. | TBD | open | | |
| RQ3.3 | 2 | How far does accuracy drop in Lusoga or another less-supported language? | The brief says you'll be asked this. | Run the same test clips in Lusoga if speakers are available. Otherwise estimate from how much training data exists per language. | TBD | open | | |
| RQ3.4 | 2 (Tier 1 to confirm) | Which local illness terms don't map cleanly onto clinical categories? | Dari's original folk/TCM-terminology insight, applied to a new context. | Ethnographic literature on Luganda illness concepts, and native-speaker interviews. | TBD | open | | |

## 4. AI behaviour and safety

Rubric criterion: Responsible AI, data and safety (pass/fail). Owner: TBD.

| ID | Tier | Question | Why it matters | How to answer this weekend | Owner | Status | Answer | Evidence |
|---|---|---|---|---|---|---|---|---|
| RQ4.1 | 1 | Which danger signs should trigger "tell the nurse now," and from what authoritative source? | Inventing your own list fails the gate. It must come from guidelines. | WHO IMCI general danger signs, Uganda Clinical Guidelines, and WHO maternal danger signs. | TBD | open | | |
| RQ4.2 | 1 | When the model is wrong, which error is worse: a missed danger word or a false alarm? Where should the confidence threshold sit? | A missed danger sign is the worst possible failure. You need a calibrated, defensible threshold. | Test on a synthetic set with tricky phrasings. Report danger-word sensitivity separately from overall accuracy. | TBD | open | | |
| RQ4.3 | 1 | Which register fields can the AI fill, and which must a human always enter? | It defines the fixed list of answers and keeps you clear of diagnosis. | Map each register field. Anything implying a diagnosis or prescription stays clinician-entered, or is dictated and confirmed. | TBD | open | | |
| RQ4.4 | 2 | What does the tool do when it understands nothing at all, such as a silent patient or a crying child? | The "not sure, ask a person" path must cover total failure, not just low confidence. | Design review plus edge-case test clips. | TBD | open | | |

## 5. Data, privacy and governance

Rubric criteria: Responsible AI (pass/fail) and Data grounding (15%). Owner: TBD.

| ID | Tier | Question | Why it matters | How to answer this weekend | Owner | Status | Answer | Evidence |
|---|---|---|---|---|---|---|---|---|
| RQ5.1 | 1 | What does Uganda's Data Protection and Privacy Act (2019) require for consent and storing health data? | The brief asks where data sits, who can read it, and what happens when a phone is lost or shared. | Read the Act's provisions on health data. Design consent as a recorded spoken yes. | TBD | open | | |
| RQ5.2 | 1 | Is an SMS to a shared household phone safe, and what's the minimum it can say? | Noor's household shares phones, so a diagnosis in an SMS is a disclosure risk. | Review mHealth privacy precedents (Mwana's results messaging). Default to only a date and the clinic's name. | TBD | open | | |
| RQ5.3 | 2 | Which training and test data is synthetic, and how will you label it? | The brief requires synthetic data to be labelled, and "what your data doesn't cover" is scored. | Keep a data card for every dataset: source, licence, size, and gaps. | TBD | open | | |

## 6. Technical feasibility

Rubric criterion: The built solution, Small AI fidelity (25%). Owner: TBD.

| ID | Tier | Question | Why it matters | How to answer this weekend | Owner | Status | Answer | Evidence |
|---|---|---|---|---|---|---|---|---|
| RQ6.1 | 1 | What's the total model size, RAM use and processing time on a mid-range Android? | The rule about model files being small enough to side-load; you need a measured number. | Quantize the models and test on the cheapest Android your team has. Put the numbers in the video. | TBD | open | | |
| RQ6.2 | 2 | How long can it run offline before records pile up, and how does sync handle conflicts? | It shows store-and-forward working. | Simulate offline days in the demo. | TBD | open | | |
| RQ6.3 | 2 | How much battery does it use in a clinic with unreliable power? | A constraint health-sector judges will think of. | Measure battery drain from a morning of intake sessions. | TBD | open | | |

## 7. Adoption and scale

Rubric criterion: Scalability, replicability and what happens next (10%). Owner: TBD.

| ID | Tier | Question | Why it matters | How to answer this weekend | Owner | Status | Answer | Evidence |
|---|---|---|---|---|---|---|---|---|
| RQ7.1 | 3 | Would the Ministry of Health accept registers filled in with AI help? Who is accountable for an error? | The brief says clinician trust and regulator acceptance "took years." | Use Penda's approvals (Kenya's ministry, Digital Health Agency, ethics board) as precedent. Name the equivalent Ugandan bodies as the next step. | TBD | open | | |
| RQ7.2 | 2 | What would make clinicians actually use it? | Penda found that training and recognition for good use mattered. | Cite Penda's implementation lessons, and ask clinicians if you can reach any. | TBD | open | | |
| RQ7.3 | 2 | What changes to move to another country: language, register schema, danger-sign list? | The replicability story. | Write a short "country pack" spec: speech model, form mapping, guideline source. See [docs/product/country-pack.md](../docs/product/country-pack.md). | TBD | open | | |

Note on tiers for section 7: the source doc names "long-term ministry acceptance" as Tier 3, which is RQ7.1. RQ7.2 and RQ7.3 are unshaded, so Tier 2.
