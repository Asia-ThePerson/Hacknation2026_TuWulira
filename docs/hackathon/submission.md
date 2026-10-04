# Submission text

Copy and paste from here into the Hack-Nation submission form. Keep it in sync with README.md. Replace every TODO before submitting, and never paste a number that is not in [evaluation/results/](../../evaluation/results/).

## Project name

TuWulira

## Track

Challenge 04, Small AI for Development. Health (Annex A).

## Team

Hotline Bling. Members: Beth A and Asia A (both designer and developer).

## One-sentence problem statement

Because of TuWulira, patients at rural Ugandan health centres will have their symptoms, danger signs and register details captured in Luganda before they see the clinician, which would otherwise happen late, in a rushed verbal history, or not at all; we know because [TODO: evidence with source, year and country].

## Short description (about 100 words)

TuWulira gives clinicians at rural health centres in Uganda back time lost to history-taking and record keeping, without ever diagnosing. While they wait, patients answer a short fixed question set in Luganda on the clinic's shared Android, by buttons and one spoken answer. Danger signs are flagged at once by rules, not AI. The clinician gets a one-screen card labelled "patient reported", and can dictate the visit so a constrained extractor drafts register fields for confirmation. Answers pre-fill the OPD register and tally; only totals leave the clinic. It runs offline. When unsure, it says "Not sure. Please ask a person."

## AI and why not SMS

A keypad survey alone could run on SMS. TuWulira's AI listens to the patient in their own words, in Luganda, offline: on-device speech-to-text, then a step that maps the words onto a fixed symptom list, keeping the original Luganda underneath. The same speech model lets the clinician dictate the visit. Danger signs stay rule-based because a confident wrong answer there is unsafe.

## Guardrails

Human makes every final call. Danger signs are rules, not AI. Card labelled PATIENT REPORTED. Staff PIN, encrypted storage, voice clips deleted at visit close, aggregate-only export. "Not sure, ask a person" on low confidence and total failure. Danger signs only from WHO / Uganda guidelines. No diagnosis or prescription. Fixed list of answers. Consent is a recorded spoken yes. SMS says only a date and the clinic's name. Synthetic data only.

## Links

- Prototype / code: https://github.com/Asia-ThePerson/Hacknation2026_TuWulira (must be public)
- Design hub: https://www.figma.com/design/46MiynCpDjTcAiYoqmiaEr/TuWulira---Project-hub?node-id=0-1
- Video: TODO
- Demo: TODO

## Disclaimer

Prototype for a hackathon. Not a medical device. Uses synthetic data only.
