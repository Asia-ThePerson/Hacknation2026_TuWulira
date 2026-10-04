# Demo script

End-to-end journey for the video (part 3 in [video-plan.md](../hackathon/video-plan.md)) and for any live demo. It uses the live web prototype: https://asia-theperson.github.io/Hacknation2026_TuWulira/. All patients, voices and records are **synthetic**. Target: about 2 minutes.

## Setup (before recording)

- [ ] Desktop browser, window at least 1280 px wide. Screen recording on.
- [ ] Open the site home, press **Reset demo (4 sample patients)** twice.
- [ ] Open `#/both`: the patient's basic phone on the left, the clinic tablet on the right.
- [ ] On the tablet, type any four digits to unlock the clinic.
- [ ] Optional offline proof: on a phone, open the site once, switch on airplane mode, reload. It still works (offline after first load).

Keys: click the phone keys, or click the phone once and use the keyboard (digits, `*`, `#`, Enter for `#`, Esc for End, C for Call).

## Journey

| Step | Do | What to say | Shows |
|---|---|---|---|
| 1 | Phone: **Call**, **End**, **Call** | "The patient gives the clinic a free missed call from their own basic phone. The clinic calls back." | Path A, a device they already have (D38) |
| 2 | **2** English, then **1** | "Luganda prompts wait for a native speaker; we do not machine-translate. Nothing is asked before a yes. In the prototype, 1 stands in for the recorded spoken yes." | Consent (D.8), honesty |
| 3 | **2** A child, **2** 2 months to 5 years | "The age picks the danger-sign set from WHO IMCI." | Rules, not AI |
| 4 | First danger question: **1** Yes | "Rule-based. A yes tells them to come in today, then asks permission." | PR9, D4 |
| 5 | **1** Yes, tell the clinic. Point at the tablet | "The card jumps to the top of the clinic queue, marked urgent: Tell the nurse now." | Alert reaches staff (D5) |
| 6 | **1** continue, **2 2 2** for the other danger questions, **#** for name and village, **\*** for date of birth, **3 #** for age, **1** or **2** for sex, **#** next of kin, **2 2** | "Registration answers fill the OPD register columns once." | HMIS 031 pre-fill |
| 7 | Main problem: set the speech control to **Silence or noise**, press **#**, then **#** again | "When it hears nothing usable it asks once more, then hands over. Not sure. Please ask a person." | **Live ask-a-person moment (B.7)** |
| 8 | **1** continue, **3 #** days, **2** worse, **1 1 2 2** symptoms, **1** correct | "It reads back what it noted. The visit code is spoken, not texted." | Read-back, PR12 |
| 9 | Tablet: open the card | "Everything is labelled Patient reported, not findings. The main problem says unclear, clinician to ask." | PR4, PR8 |
| 10 | Tablet: Nurse, type a weight of -5 | "A value outside the range is refused, never guessed." | Fixed lists, PR7 |
| 11 | Tablet: Clinician, pick a diagnosis from the HMIS 105 list | "Diagnosis and treatment are clinician only. The tool never suggests one." | Human in the loop |
| 12 | Open `#/evaluation/audio` | "Real Luganda speech, tested separately: a small model on three Common Voice clips, on a laptop, not a phone. Silence and noise go to Not sure." | Luganda (C.4), evidence |

## Say this openly

- The phone call and the speech step are simulated in the prototype; real Luganda speech-to-text is shown only on the evidence page.
- The tested model is 151.1 MB, above our side-load target; an 8-bit version is next.
- Not built yet: clinician dictation (scribe), register and tally screens, DHIS2 export, SMS, the paper form. Do not show them as working.

## Backup plan

| If this fails | Do this |
|---|---|
| The live site does not load | Run it locally: `cd web && npm ci && npm run build && npm run preview`, open http://localhost:4173/#/both |
| Side by side is too small to read | Record `#/call` and `#/clinic` in two windows instead |
| A step goes wrong | On `#/call` (desktop), click the step in the right-hand panel to jump straight to it |
| Everything fails | Walk through the Figma screens and say so |

Never fake a result. If something is simulated, say so in the video.
