# Submission text

Copy and paste from here into the Hack-Nation submission form. Keep it in sync with README.md. Replace every TODO before submitting, and never paste a number that is not in [evaluation/results/](../../evaluation/results/).

## Project name

TuWulira

## Track

Challenge 04, Small AI for Development. Health (Annex A).

## Team

Hotline Bling. Members: Beth A and Asia A (both designer and developer).

## One-sentence problem statement

Exact brief template (brief 08):

Because of this tool, health workers at rural Ugandan health centres will capture each patient's danger signs, main complaint in Luganda, and register details once, before the consultation, which would otherwise be gathered late in a rushed verbal history and re-written by hand into the OPD register and tally sheets; we know because more than half (52%) of public health providers were absent from their facility on an unannounced visit (World Bank Service Delivery Indicators, Uganda, 2013), and Uganda's outpatient process requires each visit to be written in the OPD register, then tallied by hand into monthly reports (Ministry of Health Uganda, HMIS Health Unit Procedure Manual, 2010).

## Short description (about 100 words)

TuWulira gives clinicians at rural health centres in Uganda back time lost to history-taking and record keeping, without ever diagnosing. A patient gives the clinic a free missed call from their own basic phone. The clinic line calls back and asks a short fixed question set by voice; the patient answers on the keypad and speaks once about the main problem. Danger signs are flagged at once by rules, not AI. The answers become a one-screen card labelled "patient reported" in the clinic queue. Walk-ins answer the same questions with a clerk in clinic. When unsure, it says "Not sure. Please ask a person."

## AI and why not SMS

A keypad survey alone could run on SMS. TuWulira's AI listens to the patient's own words in Luganda: speech-to-text, then a labeler that maps the words onto a fixed symptom list, keeping the original words underneath. It runs offline on the clinic's intake phone, not on the patient's basic phone and not in the cloud. The clinic tablet runs no AI. Danger signs stay rule-based, with every rule citing WHO IMCI, WHO PCPNC or Uganda Clinical Guidelines 2023, because a confident wrong answer there is unsafe.

What is real and what is simulated:

- **Real Luganda speech, tested:** a small Luganda model (whisper-tiny-luganda-v2, 151.1 MB, not yet quantized) on 3 Mozilla Common Voice test clips got 2 of 22 words wrong, on a laptop, not a phone. Silence and noise both went to "Not sure. Please ask a person." Three clips cannot estimate accuracy. Evidence: [results](../../evaluation/results/2026-10-04-luganda-asr-smoke.md) and the [evidence page](https://asia-theperson.github.io/Hacknation2026_TuWulira/#/evaluation/audio).
- **Simulated in the prototype:** the phone call and the speech step. A labelled control picks a synthetic transcript. Luganda prompts are empty until a native speaker records them; we do not machine-translate.
- **Still open:** the model is above our side-load target (about 120 MB), so the next step is an 8-bit version; and how call audio reaches the intake phone (a voice-line service or the clinic's own SIM).

## Guardrails

- A person makes every final call. No diagnosis, no prescription.
- Danger signs are rules from WHO and Uganda guidelines, never invented, and checked before any AI confidence. A danger answer tells the patient to come in today, then asks permission before the clinic is told.
- Every card item is labelled "patient reported", never findings.
- "Not sure. Please ask a person." on low confidence and on total failure (silence, noise, crying child).
- Fixed list of answers only. Nothing on the card that the patient did not say.
- Consent before any question: a spoken yes on the call. In the prototype, pressing 1 stands in for the recorded yes. Saying no, declining, or hanging up shares nothing.
- Staff PIN on the clinic device, aggregate-only export, SMS says only the clinic's name and a date.
- Synthetic data only.

## Links

- Live prototype (open on a desktop for both devices side by side): https://asia-theperson.github.io/Hacknation2026_TuWulira/#/both
- Code: https://github.com/Asia-ThePerson/Hacknation2026_TuWulira
- Luganda speech evidence: https://asia-theperson.github.io/Hacknation2026_TuWulira/#/evaluation/audio
- Design hub: https://www.figma.com/design/46MiynCpDjTcAiYoqmiaEr/TuWulira---Project-hub?node-id=0-1
- Video: TODO

## Disclaimer

Prototype for a hackathon. Not a medical device. Uses synthetic data only.
