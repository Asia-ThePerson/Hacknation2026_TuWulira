# Submission text

Copy and paste from here into the Hack-Nation submission form. Keep it in sync with README.md. Replace every TODO before submitting, and never paste a number that is not in [evaluation/results/](../../evaluation/results/).

## Project name

TuWulira

## Track

Challenge 04, Small AI for Development. Health (Annex A).

## Team

Hotline Bling. Members: Beth A and Asia A (both designer and developer).

## One-sentence problem statement

Because of TuWulira, health workers at rural Ugandan health centres will capture each patient's danger signs, main complaint in Luganda, and register details once, at registration, before the consultation, which would otherwise be gathered late in a rushed verbal history and re-written by hand into the OPD register and tally sheets; we know because more than half (52%) of public health providers were absent from their facility on an unannounced visit (World Bank Service Delivery Indicators, Uganda, 2013), and Uganda's outpatient process requires each visit to be written in the OPD register, then tallied by hand into monthly reports (Ministry of Health Uganda, HMIS Health Unit Procedure Manual, 2010).

## Short description (about 100 words)

TuWulira gives clinicians at rural health centres in Uganda back time lost to history-taking and record keeping, without ever diagnosing. At registration, a clerk holds the intake phone while the patient answers a short fixed question set in Luganda, by buttons and one spoken answer. Danger signs are flagged at once by rules, not AI. The phone turns the answer into a one-screen card labelled "patient reported" and hands it to the clinic device by QR code, offline. Answers pre-fill the OPD register and tally; only totals leave the clinic. When unsure, it says "Not sure. Please ask a person."

## AI and why not SMS

A keypad survey alone could run on SMS. TuWulira's AI listens to the patient in their own words, in Luganda, offline, on the intake phone: on-device speech-to-text (Ears), then a labeler that maps the words onto a fixed symptom list using a glossary with English loanwords, keeping the original Luganda underneath. No translation model, no cloud. The clinic device runs no AI. Danger signs stay rule-based, with every rule citing WHO IMCI, WHO PCPNC or Uganda Clinical Guidelines 2023, because a confident wrong answer there is unsafe.

## Guardrails

Human makes every final call. Danger signs are rules, not AI, and the transcript can only add a flag. Every card item labelled "PATIENT REPORTED: verify". Staff PIN, encrypted storage, audit log, voice clips never leave the intake phone, aggregate-only export. "Not sure, ask a person" on low confidence and total failure. Danger signs only from WHO / Uganda guidelines. No diagnosis or prescription. Fixed list of answers. Consent is a recorded spoken yes. SMS says only a date and the clinic's name. Synthetic data only.

## Links

- Prototype / code: https://github.com/Asia-ThePerson/Hacknation2026_TuWulira (must be public)
- Design hub: https://www.figma.com/design/46MiynCpDjTcAiYoqmiaEr/TuWulira---Project-hub?node-id=0-1
- Video: TODO
- Demo: TODO

## Disclaimer

Prototype for a hackathon. Not a medical device. Uses synthetic data only.
