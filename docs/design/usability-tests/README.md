# Wireframe usability tests

Automated checks for [../wireframes.html](../wireframes.html), the clickable low-fi wireframe of the TuWulira patient, staff, scribe and register screens. They were run on 4 October 2026.

**These are not tests with real people.** They find broken controls, dead ends, layout faults and wrong error handling. They cannot tell whether a nurse or clerk finds the wording clear. Run the task list below with 3 to 5 clinic staff next (RQ7.2).

## Run

Needs Node 20+ and Google Chrome (or set `CHROME` to a Chromium path).

```bash
cd docs/design/usability-tests
npm install
npm run tasks            # 13 scripted tasks, plus overflow checks at 375px and 1280px
npm run dead-controls    # clicks every control on every screen and lists those that do nothing
```

Pass another file as the first argument to test a different copy of the wireframe.

## What the tasks cover

| Task | Role | What it checks |
|---|---|---|
| T1 | Nurse | Unlock with a PIN, filter the queue to urgent, open the child, reach weight entry |
| T2 | All | Each queue filter chip shows only its rows; All restores the list |
| T3 | All | Every queue row opens something |
| T4 | Clerk | A wrong visit code shows an error and a way out; the right code finds the card |
| T5 | Clinician | Search the HMIS 105 list, tick a diagnosis, close the visit |
| T6 | Clinician | Treatment total recalculates |
| T7 | Nurse | An out-of-range temperature is caught on leaving the field and clears when fixed |
| T8 | Clinician | In the scribe, a flagged field blocks save; an empty confirm is refused |
| T9 | Clinician | A drafted field can be edited and keeps its unit |
| T10 | Records assistant | Register search keeps continuation lines with their patient |
| T11 | Records assistant | Each tally section chip shows its own table |
| T12 | Records assistant | Save file gives feedback |
| T13 | Clinician | Choosing Died shows a check message; sensitive rows are clinician only |

## Known limits

- `dead-controls` reports a few false alarms: tabs and choices that are already selected, checkboxes, and text fields do not change the screen markup. Read its list, do not trust the count.
- A checkbox or choice that the test cannot see change is not necessarily broken.
- The in-clinic intake button on the walk-in screen only shows a note, because that fallback (Path B) is not drawn.
- The check for hidden elements relies on the `hidden` rule, which the wireframe sets itself.
