# User flows

Each flow maps to features in [prd.md](prd.md). Wording on screen follows [design-system.md](../design/design-system.md).

## 1. Intake (before the visit, F1)

```mermaid
flowchart TD
  A[Staff opens intake mode on shared device] --> B[Recorded prompt in Luganda asks for consent]
  B -->|Spoken yes| C[Short spoken questions in Luganda]
  B -->|No or silence| X[No recording. Visit goes on as normal]
  C --> D{Safety check on each answer}
  D -->|Danger sign| DS[Tell the nurse now]
  D -->|Understood nothing| AP[Not sure. Please ask a person]
  D -->|OK| E[Intake card: Patient reported]
  E --> F[Card waits for the clinician]
```

Voice callback path for a basic phone: the clinic device calls the patient, plays the same prompts, and builds the same card. TODO: decide whether the demo shows this (it needs a SIM and signal).

## 2. Scribe (during the visit, F2)

```mermaid
flowchart TD
  A[Clinician opens patient record, sees intake card beside own questions] --> B[Clinician speaks the encounter]
  B --> C[On-device speech model transcribes]
  C --> D[Extractor fills fields from fixed lists only]
  D --> E{Confidence per field}
  E -->|High| F[Field drafted]
  E -->|Low| G[Field flagged]
  F --> H[Clinician reviews every field]
  G --> H
  H --> I[Clinician enters diagnosis and treatment]
  I --> J[Clinician confirms. Record saved to queue]
```

## 3. Sync (after the visit, F4, F5)

```mermaid
flowchart TD
  A[Confirmed record in device queue] --> B{Signal?}
  B -->|No| A
  B -->|Yes| C[Send to DHIS2 with record_id]
  C --> D{Server confirms?}
  D -->|Yes| E[Delete record and audio from device]
  D -->|No or duplicate| A
  E --> F[Optional SMS: date and clinic name only]
```

## 4. "Not sure, ask a person"

```mermaid
flowchart TD
  A[Audio turn] --> B{Speech detected?}
  B -->|No: silence, crying, noise| AP[Say: Not sure. Please ask a person]
  B -->|Yes| C{Any value above threshold?}
  C -->|No| AP
  C -->|Some| D[Keep confident values, flag the rest]
  AP --> E[Nothing saved from this turn. Staff takes over]
```

## 5. Danger sign

```mermaid
flowchart TD
  A[Transcript of a turn] --> B{Matches a sourced danger sign? Runs before confidence check}
  B -->|Yes| C[Say and show: Tell the nurse now]
  C --> D[Record flagged. Only a person can clear it]
  B -->|No| E[Normal flow]
```

## 6. Lost or shared phone

```mermaid
flowchart TD
  A[Device lost] --> B[Screen lock protects it]
  B --> C[Only unsynced, confirmed records remain. Audio already deleted]
  D[Device passed to next patient] --> E[Intake mode shows one session only]
  F[SMS to household phone] --> G[Date and clinic name only]
```
