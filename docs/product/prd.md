# Product requirements: [PRODUCT NAME]

Status: draft, 3 October 2026. Every requirement (PR#) cites the finding (R#) or research question (RQ#) it rests on. When an RQ is answered, update the requirement and its CHECKLIST.md item.

## Problem statement

Brief template (fill once RQ1.1 is answered):

> Because of this tool, [a clinician at a rural Ugandan primary care clinic] will [TODO: action] by [TODO: when] that they would otherwise [TODO: not do / do late / do worse]; we know because [TODO: evidence].

What we know so far: the brief names "burdensome record-keeping" as a reason clinicians cannot give each patient enough attention (Annex A.1). Penda Health's largest gain was a 32% drop in history-taking errors (R2). Documentation time at Ugandan health centres is not yet measured in our evidence (RQ1.1 open).

## Users

| User | Context | What they need |
|---|---|---|
| Clinician (clinical officer or nurse) | Overcrowded rural clinic, many patients, paper or DHIS2 registers (RQ1.2 open) | Spend less time writing; never lose control of the record |
| Patient (Noor) | Speaks Luganda; owns a basic phone shared with the household; low digital literacy | Be heard before the visit; privacy in a crowded room; no health details on a shared phone |
| Clinic staff who look after the shared device | Charges, unlocks and hands over the device | Simple, robust, works with no signal |

## Goals

1. Cut the time a clinician spends filling the register per visit (measure in eval; RQ1.1, RQ1.3).
2. Capture what the patient reports, in Luganda, before the visit.
3. Never put anything in a record that nobody said.
4. Work with no connection, and sync later without losing or duplicating records.

## Non-goals

- Diagnosis, triage scoring, prescription or treatment advice.
- Interpreting images.
- Replacing the clinician's own questions or examination.
- Sending health details by SMS.
- Running on the patient's own basic phone (the patient reaches the clinic device by voice callback or in person).

## Requirements

| ID | Requirement | Based on | Checklist |
|---|---|---|---|
| PR1 | The core flow (intake, scribe, save) works with airplane mode on. | Brief 06; R3, R4 | C2, F |
| PR2 | All models together are small enough to side-load; size, RAM and latency are measured on the cheapest Android we have. | Brief 06; RQ6.1; R3 | C3 |
| PR3 | Intake runs as a short spoken Luganda conversation with recorded prompts. | Brief 06; RQ3.1, RQ3.2 | C4, F |
| PR4 | The intake output is a card labelled "patient reported", never "findings", and appears beside, not instead of, the clinician's own questions. | RQ2.4; R2 | F |
| PR5 | The scribe fills only fields defined in [register-field-map.md](register-field-map.md), using only values from fixed lists or validated ranges. | Brief glossary "fixed list of answers"; RQ4.3 | D5 |
| PR6 | Any field below the confidence threshold is flagged and cannot be saved until the clinician confirms or edits it. | Brief 06 guardrail; RQ4.2 | F |
| PR7 | Fields that imply a diagnosis or prescription are clinician-entered, or dictated and confirmed word for word. The AI never suggests them. | RQ4.3; team rule | D6 |
| PR8 | When the tool understands nothing (silence, crying child, unintelligible audio) or confidence is too low, it says "Not sure. Please ask a person." and hands over. | Brief 09 fail-safe; RQ4.4 | D2 |
| PR9 | A phrase matching a sourced danger sign triggers "Tell the nurse now", whatever the confidence. Danger signs come only from WHO IMCI, Uganda Clinical Guidelines and WHO maternal danger signs. | RQ4.1, RQ4.2 | D3, D4 |
| PR10 | Recording starts only after a recorded spoken yes. | RQ5.1 | D8 |
| PR11 | Records queue on the device and sync when a signal appears, with no duplicates and no lost records. | Brief glossary "store-and-forward"; RQ6.2; R5 | F |
| PR12 | Any SMS to a patient contains only a date and the clinic's name. | RQ5.2 | D9 |
| PR13 | Synced records map to DHIS2 fields. | R5; RQ1.2 | F |
| PR14 | Every screen meets the inclusivity rules in [design-system.md](../design/design-system.md) (older users, low literacy, privacy in a crowded room). | RQ2.1, RQ2.3 | F |
| PR15 | A quiet or private mode exists for sensitive symptoms. | RQ2.1 | F |

## Features

| ID | Feature | Requirements | Code |
|---|---|---|---|
| F1 | Patient voice intake and intake card | PR3, PR4, PR10, PR15 | [app/intake/](../../app/intake/) |
| F2 | Clinician dictation and register form | PR5, PR6, PR7 | [app/scribe/](../../app/scribe/) |
| F3 | Safety layer: danger signs, thresholds, "ask a person" | PR8, PR9 | [app/safety/](../../app/safety/) |
| F4 | Store-and-forward and DHIS2 export | PR1, PR11, PR13 | [app/sync/](../../app/sync/) |
| F5 | Follow-up SMS (date and clinic name only) | PR12 | [app/sync/](../../app/sync/) |

## Design decisions

Record decisions as D# here, one line each, with the PR# they serve. Use the documentation-and-adrs skill for anything bigger.

| ID | Decision | Serves | Date |
|---|---|---|---|
| D1 | Hub and spokes: the model runs on one shared clinic device; patients reach it in person or by voice/SMS on their own phone. | PR1, PR2 | 2026-10-03 |
| D2 | Rule-based constrained extractor instead of a generative model, so outputs can only come from fixed lists. | PR5 | 2026-10-03 |
| D3 | Danger-sign matching runs before, and independently of, the confidence threshold. | PR9 | 2026-10-03 |
