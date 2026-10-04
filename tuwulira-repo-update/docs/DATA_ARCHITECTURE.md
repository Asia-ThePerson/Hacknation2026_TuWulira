# TuWulira — Data architecture (two-device, v2)

**Status:** Agreed 4 Oct 2026
**Figma:** [TuWulira — Project hub → System Diagram → *Data architecture — two-device (v2)*](https://www.figma.com/design/46MiynCpDjTcAiYoqmiaEr/TuWulira---Project-hub?node-id=99-2)

All AI runs on the **intake phone**. The **clinic device** runs no AI. The patient card moves between them by **QR code**, fully offline. Only aggregate totals leave the clinic.

Sizes below are **targets**. They must be measured on a real low-end phone before they are quoted in the video.

---

## 1. Layers

```mermaid
flowchart TB
  subgraph B["1. Build time (off device)"]
    B1["Speech data: Common Voice, SALT, radio corpus, own role-play"]
    B2["Base models: small Luganda ASR (int8); Sunflower = benchmark only"]
    B3["MoH forms: HMIS 031, HMIS 105, UCG / IMCI danger signs"]
    B4["Team-made data: synthetic complaints (labelled), glossary + loanwords"]
  end
  subgraph I["2. Intake phone: itel A50 (floor), Galaxy A06 (typical)"]
    I1["Question set + danger rules"]
    I2["Ears model (target under ~120 MB)"]
    I3["Labeler (fixed symptom list, under 5 MB)"]
    I4["Intake store (encrypted, temporary)"]
  end
  Q["QR card handoff (offline, encrypted, no audio)"]
  subgraph C["3. Clinic device (no AI): any Android 8+ (floor), Galaxy Tab A9 (typical)"]
    C1["Queue + cards (urgent first, verify each item)"]
    C2["Staff entries (weight, temp, diagnosis, treatment)"]
    C3["Register + tally (HMIS 031 rows, derived tallies)"]
    C4["Clinic store (encrypted, staff PIN, audit log)"]
  end
  subgraph O["4. Leaves the clinic (only with signal)"]
    O1["DHIS2: HMIS 105 totals only"]
    O2["CSV export: paper register backup"]
  end
  B --> I --> Q --> C --> O
```

## 2. Reference devices

| Role | Floor | Typical |
|---|---|---|
| Intake phone (AI runs here) | itel A50, 2 GB RAM, Android 14 Go, Unisoc T603, 5000 mAh, earphones in box. From ~UGX 275,000 | Samsung Galaxy A06, 4 GB RAM, Android 14, Helio G85, 5000 mAh. ~UGX 400,000–450,000 |
| Clinic device (no AI) | Any Android 8+ phone already at the facility (second itel, VHT eCHIS phone) | Samsung Galaxy Tab A9 8.7", 4 GB RAM, Helio G99, 5100 mAh. ~UGX 520,000–820,000 |
| One-device mode | Intake phone holds both roles; staff screens behind a PIN | — |

**Assumption to state in the submission:** no source confirms a shared device pool inside HC II/III facilities. eCHIS Android phones exist at VHT level. We target the same entry-level, offline-first Android profile.

**Why these devices:** Samsung leads usage share in Uganda; Transsion brands (Tecno, Infinix, itel) lead shipments across Africa. One Transsion floor phone plus one Samsung covers both.

## 3. Intake phone size budget (targets)

| Item | Target |
|---|---|
| Ears model (int8) | Under ~120 MB |
| Labeler + glossary | Under 5 MB |
| Recorded prompts | ~5 MB |
| App + database | ~30 MB |
| **Total bundle** | **Under ~160 MB** |
| Peak memory while transcribing | Under ~300 MB |
| If it does not fit on 2 GB | State the floor as itel A50 3 GB |

Build settings: minSdk 26 (Android 8), ship `arm64-v8a` and `armeabi-v7a`, no GPU dependence.

## 4. What lives where

| Data | Intake phone | Clinic device |
|---|---|---|
| Answers, danger flags, card items | Until handoff | After scan |
| Voice clips | Deleted at visit close | Never |
| Patient details (cols 2–5, 7) | Draft until handoff | Yes |
| Staff entries (cols 6, 9, 10, 12) | Never | Yes |
| Register rows, tally, export log | Never | Yes |
| Unscanned sessions | Wiped at end of clinic day | — |

**QR payload:** card items, danger flags, answers, patient draft. No audio, no confidence scores. Encrypted with a key set when the two devices are paired at the clinic. Shown on screen only, never printed.

**Danger flags:** in staff-assisted mode the clerk sees the alert on the intake phone immediately. In self-intake mode, any danger YES shows a full-screen "go to the nurse now".

## 5. Intake phone database (temporary)

```mermaid
erDiagram
  INTAKE_SESSION ||--o{ ANSWER : collects
  INTAKE_SESSION ||--o| VOICE_CLIP : records
  INTAKE_SESSION ||--o{ CARD_ITEM : produces
  INTAKE_SESSION ||--o{ DANGER_FLAG : raises
  INTAKE_SESSION ||--o| HANDOFF : sent_as
  INTAKE_SESSION {
    uuid session_id PK
    string mode "staff_assisted self paper remote"
    string device_id FK
    datetime started_at
    datetime consent_at
    string consent_method "spoken_yes or button"
    json patient_draft "cols 2-5 and 7 until handoff"
  }
  ANSWER {
    uuid session_id FK
    string question_id
    string value
    string channel "button voice private_keypad"
  }
  VOICE_CLIP {
    uuid session_id FK
    string transcript_lg
    float confidence
    int retries "max 1 then unclear"
    datetime deleted_at "never leaves phone"
  }
  CARD_ITEM {
    uuid session_id FK
    string symptom_label "fixed list"
    string duration
    string original_lg
    float confidence
    string flag "ok not_sure unclear"
  }
  DANGER_FLAG {
    uuid session_id FK
    string rule_id "cited guideline"
    string trigger "button or transcript_add_only"
    datetime raised_at
  }
  HANDOFF {
    uuid handoff_id PK
    uuid session_id FK
    string payload_hash
    datetime shown_at
    datetime wiped_at
  }
```

## 6. Clinic device database (permanent)

```mermaid
erDiagram
  PATIENT ||--o{ VISIT : has
  VISIT ||--|| HANDOFF_RECEIPT : received_via
  VISIT ||--o{ CARD_ITEM : shows
  VISIT ||--o{ DANGER_FLAG : shows
  VISIT ||--o| CLINICAL_ENTRY : completes
  VISIT ||--o{ VISIT_DIAGNOSIS : has
  STAFF ||--o{ CLINICAL_ENTRY : enters
  STAFF ||--o{ AUDIT_EVENT : logs
  VISIT }o--|| TALLY : counts_into
  TALLY }o--o| EXPORT_LOG : sent_in
  PATIENT {
    uuid patient_id PK
    string name "col 2"
    string village "col 3"
    string parish "col 3"
    int age_years "col 4"
    string age_band "0-4 or 5+"
    string sex "col 5"
    string next_of_kin "col 7"
  }
  VISIT {
    uuid visit_id PK
    int serial_no "col 1 assigned here only"
    string attendance "col 8 new or re"
    string ref_in_no "col 11"
    string mode "staff_assisted self paper remote"
    string status "waiting urgent seen closed"
  }
  HANDOFF_RECEIPT {
    uuid handoff_id PK
    uuid visit_id FK
    string payload_hash
    datetime scanned_at
    string scanned_by FK
  }
  CARD_ITEM {
    uuid visit_id FK
    string symptom_label
    string flag
    bool verified "PATIENT REPORTED verify"
    string verified_by FK
  }
  DANGER_FLAG {
    uuid visit_id FK
    string rule_id
    string acknowledged_by FK
    datetime acknowledged_at
  }
  CLINICAL_ENTRY {
    uuid visit_id FK
    float weight_kg "col 6"
    float temperature_c
    string treatment "col 10"
    string ref_out_no "col 12"
    string entered_by FK
  }
  VISIT_DIAGNOSIS {
    uuid visit_id FK
    string hmis105_code "col 9"
    bool notifiable "starred"
  }
  STAFF {
    string staff_id PK
    string role "clerk nurse clinician records"
    string pin_hash
  }
  AUDIT_EVENT {
    string staff_id FK
    uuid visit_id FK
    string action "view edit export"
    datetime at
  }
  TALLY {
    string month
    string age_band
    string category
    int count "derived from closed visits"
  }
  EXPORT_LOG {
    uuid export_id PK
    string period
    datetime sent_at
    string status
  }
```

## 7. Changes from v1

| # | Change | Why |
|---|---|---|
| 1 | Split into intake (temporary) and clinic (permanent) databases | Two-device setup; intake phone keeps nothing long term |
| 2 | `VISIT` on the intake phone became `INTAKE_SESSION` with `patient_draft` | No permanent patient record on a shared or lost phone |
| 3 | New `HANDOFF` / `HANDOFF_RECEIPT` linked by `payload_hash` | Records the QR transfer; intake copy wiped only after an intact receipt |
| 4 | `serial_no` assigned on the clinic device only | Avoids duplicate register serials across intake phones |
| 5 | Added `mode` | Staff-assisted is the main flow; all paths share tables |
| 6 | Added `consent_at`, `consent_method` | Data Protection and Privacy Act (2019), research question 5.1 |
| 7 | `ANSWER.channel` with `private_keypad` | Sensitive items use keypad + earphones (Q2.1) |
| 8 | `VOICE_CLIP` intake-only, with `retries` | Audio never leaves the phone; ask once more, then unclear |
| 9 | `CARD_ITEM.confidence`; `verified`, `verified_by` on clinic | "PATIENT REPORTED — verify" per item (Q2.4) |
| 10 | `DANGER_FLAG.trigger`, `acknowledged_by` | Transcript can only add a flag (4.2); shows a nurse responded |
| 11 | `CLINICAL_ENTRY.temperature_c`, `entered_by` | Temperature was in the PRD but missing from the diagram |
| 12 | New `VISIT_DIAGNOSIS` with `notifiable` | HMIS 105: multiple diagnoses, starred notifiable cases |
| 13 | `PATIENT.age_band` | Tally needs 0–4 / 5+ directly |
| 14 | New `STAFF`, `AUDIT_EVENT` | Answers "who can read it"; role-based access |
| 15 | New `EXPORT_LOG`; `TALLY` marked derived | What went to DHIS2 and when; tallies are never typed |

**Decided:** re-attendance is matched on the clinic device after scanning; unscanned sessions are wiped at the end of the clinic day; the QR carries card items, flags, answers and the patient draft, with no audio and no confidence scores.

## 8. Privacy answers the brief asks for

| Question | Answer |
|---|---|
| Where does the data sit? | Intake phone: encrypted, temporary, wiped after handoff or at day end. Clinic device: encrypted SQLite (SQLCipher) behind a staff PIN. |
| Who can read it? | Staff by role (clerk, nurse, clinician, records). Every view, edit and export is written to `AUDIT_EVENT`. |
| What if the phone is lost or shared? | Intake phone exposes at most the current day's waiting patients, encrypted. Clinic device is PIN-protected and encrypted; remote wipe in the full design. |
| What leaves the clinic? | Aggregate HMIS 105 totals only. No names, no patient-level data, no audio. |
