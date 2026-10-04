# How TuWulira would fare in a less-supported language (Lusoga)

The brief says entries will be asked this. Our example is **Lusoga**, spoken in Busoga (eastern Uganda) and much less resourced than Luganda.

## What data exists

| Resource | Luganda | Lusoga |
|---|---|---|
| Mozilla Common Voice | Yes, hundreds of hours | Not listed among Common Voice sources used by Sunbird's 51-language ASR |
| Sunbird SALT speech | Yes | Not among SALT's six speech languages (Lusoga appears only as a tag on the dataset card) |
| Makerere Radio Corpus | Yes | No |
| Large ASR support | Yes | Yes: Sunbird's 51-language Whisper adaptation and Sunflower list Lusoga (`xog`), but these are multi-GB models |

## Expected effect

- **Speech accuracy would drop** noticeably. There is far less Lusoga training data, and no small on-device Lusoga model we could find. Sunbird's own model cards report Lusoga results on small test sets, and their speech model's Lusoga error rates are markedly worse than for better-resourced languages. Treat these as directional, not as our numbers.
- **The safety-critical parts would not degrade.** Danger signs and most questions are buttons with recorded prompts. They work the same in any language once a native speaker records the prompts.
- **Low confidence falls back safely.** Unclear speech → ask once more → keypad → "unclear — clinician to ask". In a weaker language this path simply happens more often.

## What it would take to add Lusoga

1. A new question file (`config/questions.xog.json`) with Lusoga text and recorded prompts. No code change.
2. A glossary of Lusoga symptom words, including English loanwords.
3. Speech data: contribute Lusoga recordings to Common Voice, or collect consented clinic role-play clips.
4. Until a small Lusoga speech model exists: run TuWulira **buttons-only** in Lusoga, with the spoken answer turned off. The card then holds structured answers but no free-text complaint.

## Test we can run this weekend (if a speaker is available)

Record 5 short Lusoga symptom clips, run them through the same Ears model, and report how many words were right. Expect it to be poor, and say so.

## Line for the video

"In Lusoga, our speech accuracy would drop because there is much less data. But danger signs and most questions are buttons, so the safety parts still work, and unclear speech always goes to a person. Adding Lusoga is a new question file and recordings, not new code, and until a small Lusoga model exists, the tool runs buttons-only."
