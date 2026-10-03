# Demo script

End-to-end journey for the video (part 3 in [video-plan.md](../hackathon/video-plan.md)) and for any live demo. All patients, voices and records are **synthetic**. Target: under 2 minutes.

## Setup (before recording)

- [ ] Shared Android device charged, screen recording on, **airplane mode ON** and visible in the status bar
- [ ] App installed, models side-loaded (`scripts/fetch-models`)
- [ ] Synthetic clips ready from [eval/test-sets/](../../eval/test-sets/): Luganda intake, clinician dictation, silence, crying child, danger-sign phrase
- [ ] Device queue empty

## Journey

| Step | Who | What happens on screen | What to say | Shows |
|---|---|---|---|---|
| 1 | Patient (synthetic) | Consent prompt in Luganda; spoken yes | "Recording only starts after a spoken yes." | Consent (D.8) |
| 2 | Patient | Three short spoken questions in Luganda | "Intake runs fully offline. See airplane mode." | Offline, Luganda (C.2, C.4) |
| 3 | App | Intake card titled "Patient reported" | "It never calls this findings." | PR4 |
| 4 | Clinician | Opens record; intake card sits beside their own questions | "The clinician still asks their own questions." | Automation bias (RQ2.4) |
| 5 | Clinician | Dictates the encounter; fields fill; one field flagged "Check" | "Anything it is unsure of is flagged and blocks save." | PR6 |
| 6 | Clinician | Confirms fields, types diagnosis and treatment | "Diagnosis and treatment are clinician only." | PR7 |
| 7 | App | Play the silence or crying-child clip: "Not sure. Please ask a person." | "When it understands nothing, it hands over instead of guessing." | **Live ask-a-person moment (B.7)** |
| 8 | App | Play the danger-sign clip: "Tell the nurse now." | "Danger signs come from WHO and Uganda guidelines, never invented." | PR9 |
| 9 | App | Airplane mode off; queue sends; status "Sent" | "Saved on the device, sent when a signal appears." | Store-and-forward |
| 10 | App | Optional SMS preview: date and clinic name only | "Household phones are shared, so the SMS says nothing else." | PR12 |

## Offline simulation

Record steps 1 to 8 with airplane mode on. For step 9, turn it off on camera. To show several offline days (RQ6.2), pre-load the queue with synthetic records and show them all sync with no duplicates.

## Backup plan

| If this fails | Do this |
|---|---|
| Live speech recognition is too slow or wrong | Use the pre-recorded synthetic clips through the same pipeline, and say so on screen |
| The device fails | Run on the Android emulator with screen recording, and say so |
| Sync cannot reach DHIS2 | Show the export payload and the queue cleared; say the server was a demo stand-in |
| Everything fails | Slide-deck walkthrough of the flow with screenshots from [docs/product/user-flows.md](../product/user-flows.md) |

Never fake a result. If something is simulated, say so in the video.
