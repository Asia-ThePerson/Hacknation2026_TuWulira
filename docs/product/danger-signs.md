# Danger signs and their sources

**Rule:** every danger question in the app must cite a guideline. A question without a source is removed or disabled. Danger signs are **rule-based, never AI**. A YES (or "not sure" in pregnancy) raises an urgent flag immediately. The speech transcript can only *add* a flag, never remove one.

Status key: **Cited** = source checked · **Verify page** = source known, page number still to confirm in the PDF · **Disabled** = no checked source yet; not shown in the app.

Luganda wording for every question must be written and recorded by a native speaker and checked by a clinician before use.


## A. Child 2 months to 5 years: IMCI general danger signs

Source: WHO, *Integrated Management of Childhood Illness Chart Booklet* (March 2014), "Check for general danger signs". Also in Uganda Clinical Guidelines 2023, §17.3.2.1 "Check for General Danger Signs" (Ministry of Health Uganda).

| rule_id | Question to caregiver | Status |
|---|---|---|
| CHILD_DRINK | Is the child unable to drink or breastfeed? | Cited |
| CHILD_VOMIT | Does the child vomit everything? | Cited |
| CHILD_CONVULSION | Has the child had convulsions (fits) during this illness? | Cited |
| CHILD_LETHARGIC | Is the child very sleepy or hard to wake? (lay version of "lethargic or unconscious") | Cited: wording adapted; clinician to confirm |

IMCI also lists "convulsing now", which is observed, not asked. Staff see it; the app does not ask it.

## B. Young infant under 2 months: IMCI young infant signs

Source: WHO IMCI Chart Booklet (2014), young infant module; UCG 2023 §17. Only caregiver-reportable signs are asked. Signs that need examination (chest indrawing, measured temperature) stay with staff.

| rule_id | Question to caregiver | Status |
|---|---|---|
| INFANT_FEEDING | Is the baby not feeding well? | Verify page |
| INFANT_CONVULSION | Has the baby had convulsions (fits)? | Verify page |
| INFANT_BREATHING | Is the baby breathing fast or with difficulty? | Verify page |
| INFANT_TEMP | Does the baby feel very hot or very cold? | Verify page |
| INFANT_MOVEMENT | Does the baby move only when touched, or not at all? | Verify page |

## C. Pregnancy: WHO danger signs

Source: WHO, *Pregnancy, Childbirth, Postpartum and Newborn Care: a guide for essential practice* (PCPNC), 3rd edition, "Advise on danger signs" (section C15). Go to the health facility immediately, day or night, if any of these:

| rule_id | Question | Status |
|---|---|---|
| PREG_BLEEDING | Any bleeding from the vagina? | Verify page |
| PREG_CONVULSION | Any convulsions (fits)? | Verify page |
| PREG_HEADACHE_VISION | Severe headache with blurred vision? | Verify page |
| PREG_FEVER_WEAK | Fever and too weak to get out of bed? | Verify page |
| PREG_ABDO_PAIN | Severe pain in the belly? | Verify page |
| PREG_BREATHING | Fast or difficult breathing? | Verify page |

For pregnancy, "not sure" is treated as YES.

## D. Adults (not pregnant)

**No national adult triage guideline was found.** A study of hospitals in Northern Uganda reported the absence of national adult triage guidelines as a barrier. Candidate signs below are **disabled** until a Ugandan clinician confirms them against Uganda Clinical Guidelines 2023, Chapter 1 (Emergencies and Trauma), or the WHO Basic Emergency Care / Interagency Integrated Triage Tool.

| rule_id | Candidate question | Status |
|---|---|---|
| ADULT_BREATHING | Very hard to breathe right now? | Disabled |
| ADULT_CONVULSION | Convulsions (fits) today? | Disabled |
| ADULT_FAINT | Fainted or could not be woken today? | Disabled |
| ADULT_BLEEDING | Bleeding that will not stop? | Disabled |

Until then, the adult path shows a standing prompt on the patient screen: "If you feel very unwell right now, tell the staff immediately."


## Config file

These rules live in [`rules/danger-signs.json`](../../rules/danger-signs.json) and are read by [`app/safety/danger-signs.ts`](../../app/safety/danger-signs.ts). Each rule carries its `source` and `status`; the app only loads rules with status `cited` or `verify_page` (the latter shown in the demo with a visible "pending page check" label). Disabled rules are never loaded, and a test in [`app/check.test.ts`](../../app/check.test.ts) checks that.
