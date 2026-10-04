# Product

<!-- impeccable:product-schema 1 -->

Drafted from CLAUDE.md, docs/product/prd.md and docs/design/design-system.md on 4 October 2026. Inferred from those docs; confirm or correct.

## Platform

android

## Users

- Clinic staff: clerk (front desk, runs staff-assisted intake on the intake phone), triage nurse, clinician (clinical officer or nurse), records assistant. Staff screens run on the clinic device (no AI), behind a staff PIN; in one-device mode both roles share the intake phone. Rural Ugandan health centre, overcrowded, bright and busy room, often no signal.
- Patients and caregivers answer the question set at registration, with a clerk or nurse holding the intake phone (main flow); self-intake with earphones is optional, and remote intake from their own basic phone is design only. Their words appear on the staff screens as "patient reported".

## Product Purpose

Offline, Luganda-first patient intake and record keeping. It gives clinicians back time lost to history-taking and paperwork, without ever diagnosing. Success: danger signs seen first, the clinician starts the visit already knowing the main problem, register and tally fields are captured once, nothing appears in a record that nobody said.

## Positioning

The patient's own words, captured in Luganda at registration, become a one-screen "patient reported" card and a pre-filled HMIS 031 register row on two clinic devices that work with no internet: an intake phone that runs the AI, and a clinic device that runs none. The card moves between them by QR code.

## Operating Context

- Paper HMIS 031 OPD register and HMIS 105 monthly tally are the forms staff already know. The register screen mirrors their columns and codes.
- Queue ordered urgent first, then arrival. The card reaches the clinic device by an encrypted QR scan, which assigns the register serial number.
- Roles hand the same device to each other through the day. Screen locks after 2 minutes idle.
- Store and forward: totals wait on the device until there is signal; only aggregate totals leave the clinic (DHIS2-style export).

## Capabilities and Constraints

- Runs fully offline on a low to mid range Android the clinic already has. Small model files.
- Human in the loop: the tool informs and flags uncertainty, never diagnoses, prescribes or interprets images. Diagnosis, treatment and outcome are clinician-entered.
- Fail-safe wording: "Not sure. Please ask a person."
- Danger signs come only from WHO IMCI, Uganda Clinical Guidelines and WHO maternal danger signs. They trigger "Tell the nurse now".
- Fixed answer lists only (app/shared/field-schemas.ts). Low-confidence fields are flagged for confirmation and block save.
- Luganda strings are left empty for a native speaker; never machine-translated.

## Brand Commitments

- Name: TuWulira. Label intake content "Patient reported", never "findings".
- Danger colour is used for danger signs and nothing else.
- Uncertainty and state are never shown by colour alone.
- Plain language, no em dashes.

## Evidence on Hand

- Low-fi wireframes: docs/design/wireframes.html and the Figma wireframe pages.
- All names and numbers are synthetic. No real patient data, metrics or quotes; leave numbers TODO until evaluation/results/ has them.

## Product Principles

1. Readable at arm's length in a bright, busy room.
2. Uncertainty is visible and blocks save until a person confirms.
3. Patient reported, never findings.
4. Privacy in a crowded room: nothing a passer-by should not see.
5. The paper forms staff know are the mental model, not a new one.

## Accessibility & Inclusion

Body text 20, touch targets 56 dp, high contrast (WCAG AA to check), system font so Luganda renders with no download, respect reduced motion, no swipe-only gestures, no time limits on answers.
