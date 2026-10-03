# Video plan

Required by brief section 08. **2 to 5 minutes total. No video means no shortlist.** Target: 4:00, which leaves a minute of slack.

Each part links to its item in [CHECKLIST.md](../../CHECKLIST.md) section B. Fill the script slots; do not put a number on screen unless it is in [eval/results/](../../eval/results/).

| # | Part | Target time | Checklist |
|---|---|---|---|
| 1 | Problem statement | 0:00 to 0:25 | B.1 |
| 2 | AI capabilities and guardrails | 0:25 to 1:05 | B.2, B.3 |
| 3 | Tool demo, including "not sure, ask a person" | 1:05 to 2:50 | B.4, B.7 |
| 4 | Where it sits in the user's day, plus tech stack | 2:50 to 3:30 | B.5 |
| 5 | Our take on localizing AI | 3:30 to 4:00 | B.6 |

## 1. Problem statement (B.1)

Exact template, one sentence, on screen and spoken:

> Because of this tool, [user] will [action] by [when] that they would otherwise [not do / do late / do worse]; we know because [evidence].

Script slot (TODO, needs RQ1.1 answered):
> Because of this tool, **[a clinical officer at a rural Ugandan health centre]** will **[TODO: action]** by **[TODO: when]** that they would otherwise **[TODO]**; we know because **[TODO: evidence with source, year, country]**.

## 2. AI capabilities and guardrails (B.2, B.3)

Say what the AI does and why SMS, a spreadsheet or a search could not:
- On-device speech recognition turns spoken Luganda into text. SMS cannot listen.
- A constrained extractor turns that text into a fixed register form. A spreadsheet cannot read speech.
- It flags what it is unsure of instead of guessing.

Guardrails to **name on screen** (B.3): human makes every final call; "not sure, ask a person"; danger signs from WHO / Uganda guidelines only; no diagnosis or prescription; fixed list of answers; nothing added that nobody said; SMS says only date and clinic name.

Script slot: TODO

## 3. Tool demo (B.4, B.7)

Follow [docs/demo/demo-script.md](../demo/demo-script.md). Must show, end to end, with airplane mode visibly on:
1. Patient gives a recorded spoken yes, then intake in Luganda. Card says "patient reported".
2. Clinician dictates. Form fills; a low-confidence field is flagged and confirmed.
3. **A live "not sure, ask a person" moment** (B.7). Use the silence or crying-child clip.
4. A danger-sign phrase triggers "tell the nurse now".
5. Airplane mode off, the queued record syncs.

Script slot: TODO

## 4. Where it sits in the user's day, plus tech stack (B.5)

Morning: staff switch on the shared device. Waiting room: patients do intake. Consult: clinician dictates. End of day or when signal appears: records sync to DHIS2. Show the stack: see [README.md](../../README.md#tech-stack) and measured model size, RAM and latency from [eval/results/](../../eval/results/).

Script slot: TODO

## 5. Our take: what localizing AI development means (B.6)

Starting point from the landscape review: moving Dari from limited-English-proficiency immigrants in Toronto to a rural Ugandan clinic is itself an answer. Cover trade-offs honestly (the brief encourages it): Luganda works better than Lusoga; synthetic test data; no real clinic validation yet.

Script slot: TODO

## Before upload (B.8)

- [ ] Runtime between 2:00 and 5:00
- [ ] Every number on screen matches eval/results
- [ ] Captions on (low-literacy and non-English-speaking judges)
- [ ] Link tested from a logged-out browser
