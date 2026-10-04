# TuWulira: HMIS 105 alignment update

Changes to the question set, staff screens and export so TuWulira's records can produce the Section 1 totals of the **HMIS 105 Health Unit Outpatient Monthly Report (print version September 2019)**.

Sections 2–11 of HMIS 105 (maternal and child health, immunization, HIV testing, circumcision, stock, lab, finance) come from other registers and are out of scope.

**Who enters it:** P = patient question · N = nurse screen · C = clinician screen · K = clerk · S = system

---

## 1. Decisions log (add to PRD section 10)

| # | Decision | Outcome |
|---|---|---|
| 1 | Age capture | Ask date of birth; for babies under 2 months, ask days old. System calculates every reporting band. |
| 2 | Report type (National / Refugee / Foreigner) | Clerk enters per patient on the staff screen. Never asked by the patient screen. |
| 3 | Referrals to the unit | Patient asked "Did a health worker send you here?"; clerk records the referral note number. |
| 4 | Malaria detail | Fever answer pre-flags "fever reported"; clinician records test type, result and a "treated" tick. |
| 5 | Multiple diagnoses | Multi-select from the HMIS 105 list; each diagnosis becomes its own register line. |
| 6 | TB symptom screen | Four button questions; any YES flags "TB symptoms reported — clinician to assess". |
| 7 | Nutrition | Nurse adds height/length and MUAC for children under 5; patient screen asks "breastfeeding?" alongside pregnancy. |
| 8 | Alcohol and tobacco | Private, button-only questions with "prefer not to say". |
| 9 | Visit outcome | Clinician picks: went home / referred out / admitted / died. |
| 10 | Arrival by ambulance | Not captured in this build. |
| 11 | Gender-based violence and attempted self-harm rows | Never asked by the tool. Recorded only by the clinician. Stated in the video as a Responsible AI choice. |
| 12 | DHIS2 export | Every total labelled with its HMIS 105 code, by age band and sex. |
| 13 | Form versions | Use the 2010 HMIS 031 register as-is, map to the 2019 HMIS 105, and state the version gap in the submission. |

---

## 2. Question set changes (FR-2 config)

Luganda text and audio for every new question still need a native-speaker translation and recording.

### 2.1 Registration

| id | English text | Answer type | Rule | Target field |
|---|---|---|---|---|
| REG-DOB | What is the date of birth? | Date (day / month / year), plus "Don't know" | "Don't know" → REG-AGE-EST | Age (HMIS 031 col 4); age band |
| REG-AGE-EST | About how old? | Number + unit (days / months / years) | Mark age as **estimated** on the card | Age; age band |
| REG-NEWBORN | Is the baby under 2 months old? How many days old? | Yes / No, then number of days | Shown when visit is for a baby | Neonatal 0–7 / 8–28 day split |
| REG-REFIN | Did a health worker send you here? (already in the set as A8) | Yes / No / Not sure | Yes → clerk prompted for referral note number | REF IN NUM (HMIS 031 col 11); OR01 |

### 2.2 Symptoms

| id | English text | Answer type | Rule | Target field |
|---|---|---|---|---|
| SYM-FEVER | Have you had a fever or felt hot? | Yes / No / Not sure / Ask clinician | Yes → "fever reported" on card | Pre-flag for EP01a (clinician confirms) |
| TB-1 | Have you been coughing? | Yes / No / Not sure / Ask clinician | Any TB YES → "TB symptoms reported — clinician to assess" | TP01 (screened), TP02 candidate |
| TB-2 | Have you had a fever? | Reuses SYM-FEVER answer; not asked twice | as above | as above |
| TB-3 | Do you sweat a lot at night? | Yes / No / Not sure / Ask clinician | as above | as above |
| TB-4 | Have you lost weight without trying? | Yes / No / Not sure / Ask clinician | as above | as above |

**Before finalizing:** check the TB question wording and cough duration against Uganda's national TB screening guidance; don't settle it from memory.

### 2.3 Pregnancy and breastfeeding

| id | English text | Answer type | Rule | Target field |
|---|---|---|---|---|
| PREG-BF | Are you breastfeeding? | Yes / No / Prefer not to say | Asked with the existing pregnancy question | Nutrition pregnant/lactating columns |

### 2.4 Private questions (button-only, never spoken)

| id | English text | Answer type | Target field |
|---|---|---|---|
| RB-ALC | Do you drink alcohol? | Yes / No / Prefer not to say | RB01 |
| RB-TOB | Do you smoke or use tobacco? | Yes / No / Prefer not to say | RB02 |
| RB-EXP | Does anyone smoke near you at home? | Yes / No / Prefer not to say | RB03 |

RB01 and RB02 are greyed out for ages 0–4 on HMIS 105, so don't ask them for young children.

---

## 3. Staff screen changes (FR-7)

### Clerk
- **Report type:** National / Refugee / Foreigner (required before the record closes).
- **Referral note number** when REG-REFIN = Yes.

### Nurse
- Existing: weight (kg), temperature.
- New, children under 5: height/length (cm), MUAC (cm).
- The tool records the measurements. The nurse confirms any malnutrition category; the tool does not assign one.

### Clinician
- **Diagnoses:** multi-select from the HMIS 105 list (★ = notifiable). Each diagnosis is its own register line; extra lines fill only the diagnosis columns, per HMIS 031 instructions.
- **Malaria (shown when fever reported or a malaria diagnosis is picked):**
  - Test done: RDT / Blood slide / None
  - Result: Positive / Negative
  - Treated: tick
- **TB:** "presumptive TB" tick (clinician decision, not the intake flag).
- **Outcome:** Went home / Referred out / Admitted / Died.
- Existing: treatment (units × doses/day × days), referral-out number.

---

## 4. Age band logic (system)

Age in days = visit date − date of birth (or from the estimate). Each section of HMIS 105 uses its own bands:

| Section | Bands |
|---|---|
| 1.1–1.3 OPD attendance, referrals, diagnoses | 0–28 days · 29 days–4 yrs · 5–9 · 10–19 · 20+ |
| 1.3.3 Neonatal rows | 0–7 days · 8–28 days |
| 1.4 TB | <5 · 5–9 · 10–14 · 15–19 · 20+ |
| 1.5 Nutrition | 0–5 mo · 6–23 mo · 24–59 mo · 5–9 · 10–19 · 20–24 · 25+ (women split non-pregnant / pregnant-lactating) |

Estimated ages are counted in their band and marked "estimated" in the export.

---

## 5. Export (FR-10: sync to DHIS2)

Totals only, no names. One row per code × age band × sex.

| HMIS 105 code | Source in TuWulira |
|---|---|
| OA01 / OA02 | New vs re-attendance (existing question A7) |
| OR01 | Referral in (REG-REFIN + note number) |
| OR02 | Referral out (clinician) |
| EP01a | Fever reported and confirmed by clinician |
| EP01b–d | Malaria diagnosis, test result, treated tick |
| All 1.3 diagnosis codes | Clinician multi-select |
| TP01 | Patients who completed the TB symptom questions |
| TP02 | Clinician "presumptive TB" tick |
| NA01a / NA01b | MUAC / weight-for-height recorded (nurse) |
| RB01–RB03 | Private alcohol and tobacco questions |
| DT01 | Outcome = died |

---

## 6. Guardrails added

- Intake flags describe what the patient reported ("fever reported", "TB symptoms reported — clinician to assess"). Only the clinician records a diagnosis or classification.
- Gender-based violence rows (CD05, MH02, IN03, MC01) and attempted self-harm (NE21) are never asked by the tool.
- Alcohol and tobacco questions are button-only, with "prefer not to say".
- Report type is clerk-entered so the patient screen never asks about origin or status.
- Estimated ages are marked, not presented as exact.

---

## 7. Submission note (form versions)

> TuWulira's register mapping uses HMIS 031 from the Ministry of Health's 2010 Health Unit Procedure Manual; its monthly totals map to the September 2019 print of HMIS 105. A revised HMIS manual (2014) exists, and the current HMIS 031 may differ. The question set and export are config files, so updating to the current forms is a data change, not a code change.

---

## 8. Open items

- Native-speaker Luganda translation and audio for all new questions.
- TB question wording and cough duration checked against national guidance.
- Whether each clinic's devices are shared by MUAC-trained staff.
