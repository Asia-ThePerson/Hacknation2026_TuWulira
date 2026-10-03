# app

Expo (React Native + TypeScript) app for the shared clinic Android device. Hello-world stage: the screen runs **synthetic** transcripts through the real safety, intake and scribe logic. The speech model is not wired in yet.

| Folder | Feature | What is in it now |
|---|---|---|
| [intake/](intake/) | F1 patient voice intake | `intake-card.ts`: builds the "Patient reported" card |
| [scribe/](scribe/) | F2 clinician dictation | `extract.ts`: rule-based extractor limited to the field schemas |
| [safety/](safety/) | F3 safety layer | `index.ts`: "ask a person" and "tell the nurse now"; `danger-signs.ts`: sourced list |
| [sync/](sync/) | F4, F5 store-and-forward | `queue.ts`: queue with no duplicates; SMS with date and clinic name only |
| [shared/](shared/) | used by all | field schemas, design tokens, Luganda and English strings |

## Run

```bash
npm install
npm test            # logic checks for the safety-critical paths
npm run typecheck
npm run android     # needs an Android device with Expo Go, or an emulator
```

Imports use explicit `.ts` extensions so `npm test` can run the logic with Node's built-in type stripping, with no test framework.
