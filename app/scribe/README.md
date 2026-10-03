# scribe (F2)

Clinician dictation during the visit. The extractor only outputs values allowed by `shared/field-schemas.ts` and only from what was said (PR5). Low-confidence fields are flagged and block save (PR6). Clinician-only fields are never filled (PR7). Next: connect the on-device speech model and Luganda rules.
