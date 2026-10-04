# User flows

Each flow maps to features and components in [prd.md](prd.md). Wording on screen follows [design-system.md](../design/design-system.md). The source of truth for flows is the Figma [TuWulira Project hub](https://www.figma.com/design/46MiynCpDjTcAiYoqmiaEr/TuWulira---Project-hub?node-id=0-1), *System Diagram* page, *Final system diagram*.

## 1. Three paths, one card

One question set, three ways in. All three produce the same patient-reported card.

```mermaid
flowchart LR
  A[Path A: remote. Patient's own basic phone, callback voice line or SMS. Design only] --> Q[Same question set]
  B[Path B: in clinic. Kiosk or shared clinic Android, fully offline. PROTOTYPE] --> Q
  C[Path C: in clinic. Paper form in Luganda or English, photographed. Design only] --> Q
  Q --> K[Patient-reported card]
  K --> S[Staff screen queue, urgent first]
```

## 2. Patient journey (Path B, the prototype)

1. Patient arrives. The clerk checks for a visit code (Path A) or starts TuWulira on the clinic device.
2. Patient answers the question set with buttons and Luganda audio prompts. The main problem is one spoken answer.
3. Any danger-sign YES sends an urgent flag to triage immediately.
4. Card saved. Patient waits to be called.
5. Nurse sees urgent patients first and adds weight and temperature.
6. Clinician reads the card, takes their own history, and records diagnosis, treatment and referral (typed, picked, or dictated and confirmed).
7. Register row and tally update. Totals are exported for DHIS2.

## 3. Intake (before the visit, F1, components 1 to 6)

```mermaid
flowchart TD
  A[Clerk starts TuWulira on the shared device] --> L[Section 0: language]
  L --> B[Consent prompt]
  B -->|Spoken yes| W[Section 1: who is the visit for, child age, pregnancy]
  B -->|No or silence| X[Nothing asked or recorded. Visit goes on as normal]
  W --> D{Section 2: danger-sign set for this patient}
  D -->|Any yes, or not sure in pregnancy| DS[Tell the nurse now. Urgent flag to triage]
  D -->|All no| R[Section 3: registration details]
  DS --> R
  R --> M[Section 4: main problem, one spoken answer]
  M --> T{Speech-to-text confidence}
  T -->|Low| M2[Ask once more]
  M2 -->|Still low| U[Marked: unclear, clinician to ask]
  T -->|OK| N[Understanding: items from the fixed symptom list, Luganda kept underneath]
  M2 -->|OK| N
  U --> F[Sections 5 and 6: duration, trend, symptoms, medicines, allergies, private matter. Section 6 is button-only]
  N --> F
  F --> RB[Section 7: read-back. Correct or change]
  RB --> K[Card saved: PATIENT REPORTED. Patient waits]
```

Every question also accepts **Not sure** and **Ask clinician**.

## 4. Consultation (during the visit, F2 and F6, components 7 and 11)

```mermaid
flowchart TD
  P[Staff PIN] --> Q[Queue: urgent first, then arrival time]
  Q --> N[Nurse adds weight and temperature]
  N --> C[Clinician opens the card beside their own questions]
  C --> H[Clinician takes their own history]
  H --> S{Dictate or type?}
  S -->|Dictate| D[On-device speech model transcribes. Extractor drafts fields from fixed lists only]
  D --> E{Confidence per field}
  E -->|High| F[Field drafted]
  E -->|Low| G[Field flagged. Blocks save]
  F --> V[Clinician reviews every field]
  G --> V
  S -->|Type or pick| V
  V --> DX[Clinician picks diagnosis from HMIS 105 list, enters treatment and referral out]
  DX --> OK[Clinician confirms. Register row and tally update]
```

## 5. Records and sync (after the visit, F4, F5, components 8 to 10)

```mermaid
flowchart TD
  A[Visit closed] --> V[Voice clips deleted]
  A --> R[Register row and tally stored on the device, encrypted]
  R --> CSV[CSV export for the clinic register]
  R --> T[Aggregate totals]
  T --> B{Signal, and staff press Export totals?}
  B -->|No| T
  B -->|Yes| D[DHIS2-style file. Totals only, no names]
  A --> SMS[Optional SMS: date and clinic name only]
```

## 6. Remote danger sign (Path A, design only, decision D4)

```mermaid
flowchart TD
  A[Patient answers on own phone] --> B{Danger-sign yes?}
  B -->|No| C[Card waits for the clinic visit]
  B -->|Yes| S[SMS: come to your clinic immediately, with clinic address]
  S --> P{May we tell the clinic and share your answers?}
  P -->|Yes| Y[Alert and card sent to the clinic Android at the triage desk]
  P -->|No| N[Nothing shared]
```

Open: this SMS goes beyond the "date and clinic name only" rule (PRD open question 5).

## 7. "Not sure, ask a person"

```mermaid
flowchart TD
  A[Audio turn] --> B{Speech detected?}
  B -->|No: silence, crying, noise| AP[Say: Not sure. Please ask a person]
  B -->|Yes| C{Any value above threshold?}
  C -->|No| AP
  C -->|Some| D[Keep confident values, flag the rest]
  AP --> E[Nothing saved from this turn. Staff takes over]
```

## 8. Danger sign (in clinic)

```mermaid
flowchart TD
  A[Answer or transcript] --> B{Matches a sourced danger sign in rules/? Runs before the confidence check}
  B -->|Yes| C[Say and show: Tell the nurse now]
  C --> D[Urgent flag. Only a person can clear it]
  B -->|No| E[Normal flow]
```

## 9. Lost or shared phone

```mermaid
flowchart TD
  A[Device lost] --> B[Staff PIN and encryption protect records. Remote wipe in the full design]
  B --> C[Voice clips already deleted at visit close]
  D[Device passed to next patient] --> E[Patient screen shows one session only]
  F[SMS to household phone] --> G[Date and clinic name only]
```
