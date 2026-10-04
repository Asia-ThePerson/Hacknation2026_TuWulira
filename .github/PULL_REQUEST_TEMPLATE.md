## What this changes

## IDs

- CHECKLIST.md items this closes (only if the evidence link now exists):
- PR# / F# / D# / RQ# / R#:

## Checks

- [ ] `scripts/check` run (paste PASS/FAIL lines below)
- [ ] `cd app && npm test && npm run typecheck` pass (if app/ changed)
- [ ] Numbers in README or docs match a file in evaluation/results/

## Responsible AI

- [ ] No diagnosis, prescription or image interpretation added to any output
- [ ] Extractor still outputs only field-schema values
- [ ] "Not sure. Please ask a person." still covers low confidence and total failure
- [ ] Danger signs unchanged, or every new one cites WHO IMCI, Uganda Clinical Guidelines or WHO maternal danger signs
- [ ] Nothing in any output that the patient or clinician did not say
- [ ] SMS still says only a date and the clinic's name
- [ ] No secrets, real API keys or real patient data; any new data is labelled synthetic
- [ ] Intake content still labelled "patient reported"
