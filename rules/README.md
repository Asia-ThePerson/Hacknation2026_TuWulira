# rules

Rule-based logic that is deliberately not AI (component 3 in the [README](../README.md), PR9 in the [PRD](../docs/product/prd.md)). A confident wrong answer here is unsafe, so these are plain lists a person can read and check.

| File | What | Source rule |
|---|---|---|
| [danger-signs.json](danger-signs.json) | Every danger sign that raises "Tell the nurse now", with its source, the patient set it belongs to, and the phrases that match it | Only WHO IMCI general danger signs, Uganda Clinical Guidelines and WHO maternal danger signs. Never invented. |

The app reads this file through [app/safety/danger-signs.ts](../app/safety/danger-signs.ts), which types it and exports the list. Edit the JSON, not the TypeScript.

## Rules for editing

- Add a sign only with its source document named. Set `verified` to `true` only after checking the entry against that document (RQ4.1, CHECKLIST D.3).
- `phrasesLg` stays empty until a native Luganda speaker writes the phrases. Do not machine-translate.
- A new country swaps this file for its own guideline-sourced list ([country pack](../docs/product/country-pack.md)).
