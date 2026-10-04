# Video plan

Required by brief section 08. **2 to 5 minutes total. No video means no shortlist.** Target: 4:00, which leaves a minute of slack.

Each part links to its item in [CHECKLIST.md](../../CHECKLIST.md) section B. The script lines below are drafts; edit them in your own words. Do not put a number on screen unless it is in [evaluation/results/](../../evaluation/results/), and label laptop numbers as laptop.

| # | Part | Target time | Checklist |
|---|---|---|---|
| 1 | Problem statement | 0:00 to 0:25 | B.1 |
| 2 | AI capabilities and guardrails | 0:25 to 1:05 | B.2, B.3 |
| 3 | Tool demo, including "not sure, ask a person" | 1:05 to 2:50 | B.4, B.7 |
| 4 | Where it sits in the user's day, plus tech stack | 2:50 to 3:30 | B.5 |
| 5 | Our take on localizing AI | 3:30 to 4:00 | B.6 |

## 1. Problem statement (B.1)

Exact template, one sentence, on screen and spoken. Same sentence as [submission.md](submission.md):

> Because of this tool, health workers at rural Ugandan health centres will capture each patient's danger signs, main complaint in Luganda, and register details once, before the consultation, which would otherwise be gathered late in a rushed verbal history and re-written by hand into the OPD register and tally sheets; we know because more than half (52%) of public health providers were absent from their facility on an unannounced visit (World Bank Service Delivery Indicators, Uganda, 2013), and Uganda's outpatient process requires each visit to be written in the OPD register, then tallied by hand into monthly reports (Ministry of Health Uganda, HMIS Health Unit Procedure Manual, 2010).

## 2. AI capabilities and guardrails (B.2, B.3)

Draft script:
> SMS can ask yes or no. It cannot listen. TuWulira lets the patient describe the problem in their own words, in Luganda. Speech-to-text runs offline on the clinic's intake phone, and a labeler maps the words onto a fixed symptom list, keeping the original words. The patient's basic phone runs nothing; the clinic tablet runs no AI. Danger signs are not AI at all: they are rules from WHO and Uganda guidelines.

Guardrails to **name on screen** (B.3): a person makes every final call; "Not sure. Please ask a person."; danger signs from WHO and Uganda guidelines only; no diagnosis or prescription; fixed list of answers; nothing added that nobody said; permission before the clinic is told; SMS says only the clinic's name and a date.

## 3. Tool demo (B.4, B.7)

Follow [docs/demo/demo-script.md](../demo/demo-script.md) on the live prototype in side-by-side view (`#/both`). Must show:
1. A missed call from a basic phone, the call back, and consent before any question.
2. A danger-sign yes: come in today, permission, and the urgent card at the top of the clinic queue ("Tell the nurse now").
3. **A live "Not sure. Please ask a person." moment** (B.7): silence on the main problem, one retry, then hand-over.
4. The card on the clinic tablet labelled "Patient reported", a refused out-of-range value, and a clinician-only diagnosis.
5. Real Luganda speech on the evidence page (`#/evaluation/audio`), with its caveats.

Say on screen that the call and the speech step are simulated in the prototype.

## 4. Where it sits in the user's day, plus tech stack (B.5)

Draft script:
> Before the visit, from home, the patient gives the clinic a missed call and answers by phone. Danger signs reach the nurse straight away. At the desk, the clerk finds the card by its visit code; walk-ins answer the same questions with the clerk on the intake phone. In the consultation, the clinician reads one screen of patient-reported answers, asks their own questions, and enters the diagnosis. The answers pre-fill the OPD register, and only monthly totals leave the clinic.

Tech stack to show: the web prototype (React, TypeScript, Vite, offline after first load), the shared safety and card logic in `app/` with tests, the danger-sign rules file, and the speech smoke test: whisper-tiny-luganda-v2, 151.1 MB, about 4.3 to 4.9 s per clip **on a laptop, not a phone** ([results](../../evaluation/results/2026-10-04-luganda-asr-smoke.md)).

## 5. Our take: what localizing AI development means (B.6)

Draft script:
> Localizing is not translating an app. It is fitting the tool to the phones people already own, the paper forms staff already fill, and the guidelines nurses already trust. Honest trade-offs: we had no native Luganda speaker, so the prompts are empty rather than machine-translated; Luganda works better than Lusoga today; our test data is synthetic or public; and nothing has been validated in a real clinic yet.

## Before upload (B.8)

- [ ] Runtime between 2:00 and 5:00
- [ ] Every number on screen matches evaluation/results, laptop numbers labelled as laptop
- [ ] Simulated parts said out loud
- [ ] Captions on (low-literacy and non-English-speaking judges)
- [ ] Link tested from a logged-out browser
