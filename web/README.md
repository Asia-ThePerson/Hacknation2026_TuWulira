# web

Web prototype of TuWulira: patient intake on the intake phone, then the patient-reported card in the clinic queue. Built from the Figma [TuWulira Project hub](https://www.figma.com/design/46MiynCpDjTcAiYoqmiaEr/TuWulira---Project-hub?node-id=34-3) and [docs/design/wireframes.html](../docs/design/wireframes.html). All data is synthetic.

## Run

Needs Node 20.19 or newer (Vite 8).

```bash
cd web
npm ci
npm run dev        # http://localhost:5173, for development
npm run build      # typecheck, then a static build in dist/
npm run preview    # serves dist/ at http://localhost:4173, offline after first load
```

Open `#/intake` and `#/clinic` in two tabs of the same browser. Any four digits unlock the clinic.

## What it reads from the repo

| Source | Used for |
|---|---|
| [config/questions.lg-UG.json](../config/questions.lg-UG.json) | Question wording and order |
| [rules/danger-signs.json](../rules/danger-signs.json) through [app/safety/](../app/safety/) | Danger signs and the "Not sure. Please ask a person." fail-safe |
| [app/shared/field-schemas.ts](../app/shared/field-schemas.ts) | Allowed ranges for weight and temperature |
| [config/hmis105-diagnoses.json](../config/hmis105-diagnoses.json) | The clinician's diagnosis list |

## Data and offline

- Everything stays in the browser's localStorage on this device. No server, no network calls. The two tabs stand in for the encrypted QR handoff between devices (decision D33).
- The production build registers a service worker that caches the whole app on first load, so a reload with no signal still works.
- **Demo controls** on the home screen reload the four synthetic patients (normal, urgent, ask clinician, not finished) or clear everything. A new build with a changed data shape replaces old stored records.

## Danger signs

Read from `rules/danger-signs.json` through `app/safety/danger-signs.ts`, never written here ([docs/product/danger-signs.md](../docs/product/danger-signs.md)):

- Child 2 months to 5 years: four cited WHO IMCI signs.
- Baby under 2 months and pregnancy: shown with a **"pending page check"** label (source known, page to confirm). In pregnancy, Not sure and Ask clinician count as Yes.
- Adult: the candidate signs are disabled in the rules, so the step shows the standing prompt from the rules file and the card tells the nurse to ask in person. The step is never skipped.

## Not in this prototype

No real speech-to-text (a labelled control picks a synthetic transcript), no scribe, register, tally, paper form or SMS. Items marked `*` on the card are not yet validated: rules with a page still to check, or symptom questions written for this prototype (fever, cough, weight loss; to check against national TB guidance).

## Differences from Figma

**Intentional correction (Figma to be updated later):** Figma, Flash call 1 step 6, asks "Are you pregnant?" before sex, so men are asked it. Here, for "Me", sex is asked first, and pregnancy and breastfeeding only when the answer is not Male. For a child, sex stays in registration. Code: `src/patient/flow.ts`.

**Prototype refinements, not yet in Figma:**

- Touch-screen in-clinic intake (Figma's patient frames are the keypad-phone path), with a start screen, "Stop here: the nurse takes over" on the alert, and labelled synthetic speech.
- Tablet layout with the queue beside the record; phone width keeps Figma's one-screen-at-a-time.
- Card split into "Patient reported" and "Staff and clinician entered", "Ask and record" on flagged items (the patient's original stays), a safety-questions section, private answers collapsed, change history.
- Queue filters All, Urgent, Ask, Not finished, Card ready, Closed; visit-code search in the queue; clerk steps on one screen.
- Close visit needs report type, a diagnosis and an outcome; the closed screen says register and tally are not built.
- Cards update after every answer once consent is given, so staff can see a partly finished intake (the two-device design moves the card by QR at the end).
- Demo controls on the home screen and a live "Works offline / No signal" status line.
