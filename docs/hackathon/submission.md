# Submission text

Copy and paste from here into the Hack-Nation submission form. Keep it in sync with README.md. Replace every TODO before submitting, and never paste a number that is not in [eval/results/](../../eval/results/).

## Project name

[PRODUCT NAME]

## Track

Challenge 04, Small AI for Development. Health (Annex A).

## Team

TODO: team name. Members: Beth A, Asia A.

## One-sentence problem statement

Because of this tool, [TODO: user] will [TODO: action] by [TODO: when] that they would otherwise [TODO: not do / do late / do worse]; we know because [TODO: evidence].

## Short description (about 100 words)

[PRODUCT NAME] gives clinicians at a rural primary care clinic in Uganda back time lost to record keeping, without ever diagnosing. Before the visit, the patient answers a short spoken intake in Luganda on the clinic's shared Android device; the clinician sees a card labelled "patient reported". During the visit, the clinician speaks the encounter; a small on-device speech model transcribes it and a constrained extractor fills the register form, flagging anything it is unsure of. Records are stored on the device and sent when a signal appears. When the tool is unsure, it says "not sure, ask a person".

## AI and why not SMS

On-device speech recognition and constrained extraction turn unstructured Luganda speech into a structured register record. SMS, a spreadsheet or a search cannot listen or structure speech.

## Guardrails

Human makes every final call. "Not sure, ask a person" on low confidence and total failure. Danger signs only from WHO / Uganda guidelines. No diagnosis or prescription. Fixed list of answers. Consent is a recorded spoken yes. SMS says only a date and the clinic's name. Synthetic data only.

## Links

- Prototype / code: https://github.com/Asia-ThePerson/Hacknation2026_WBC4Health (must be public)
- Video: TODO
- Demo: TODO

## Disclaimer

Prototype for a hackathon. Not a medical device. Uses synthetic data only.
