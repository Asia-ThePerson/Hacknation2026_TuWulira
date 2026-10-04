# Design system

Style: **Guidelines handbook** (chosen from the design style proposals, Style 2). Navy and teal on white, taken from the Uganda Clinical Guidelines book, with numbered section labels, register line numbers and a thumb index. It applies to the shared clinic Android in staff mode. Patient screens on the basic phone keep their own greyscale low-fi style.

Code mirror: [app/shared/tokens.ts](../../app/shared/tokens.ts). Figma: the "Design System (Guidelines handbook)" page and the "TuWulira tokens" variable collection in the [TuWulira Project hub](https://www.figma.com/design/46MiynCpDjTcAiYoqmiaEr/TuWulira---Project-hub?node-id=0-1). Change all three together. Run the design skills (impeccable, emil-design-eng, design-taste-frontend, web-design-guidelines) over each screen and log findings in CHECKLIST F (Design).

## Principles

1. **Readable at arm's length in a bright, busy room.** Big type, high contrast, one primary action per screen.
2. **Patient reported, never findings.** Intake content always sits under the label "Patient reported".
3. **Uncertainty is visible.** A flagged field looks different from a confirmed one, never only by colour, and blocks save.
4. **Red means danger, nothing else.** Red is kept for danger signs so it never loses meaning.
5. **The paper forms are the map.** Register line numbers, HMIS 031 column numbers and HMIS 105 codes match the forms staff already use.
6. **Privacy in a crowded room.** Nothing on screen a passer-by should not see.
7. **Offline first, calm sync.** "Saved on this device" and "Waiting for signal", never "Error".

## Colour

Contrast is measured with the WCAG 2.2 formula against the paired background (4.5:1 text, 3:1 UI parts).

| Token | Hex | Use | Contrast |
|---|---|---|---|
| `primary` | `#12355B` | App bar, primary button | White on it 12.46:1 |
| `primaryPressed` | `#0C2541` | Pressed primary | White on it 15.48:1 |
| `accent` | `#24747D` | Section labels, line numbers, selected chip, checkbox | 5.43:1 on white, 5.13:1 on surface |
| `accentOnDark` | `#5FC1C9` | Tab underline on navy only | 5.91:1 on navy |
| `accentTint` | `#E3F1F2` | Reported-flag tags, cells from the patient card | Accent text 4.69:1 |
| `text` | `#14263D` | Body text | 15.28:1 on white |
| `textMuted` | `#4D5F75` | Secondary text, hints | 6.54:1 on white |
| `onPrimaryMuted` | `#AFC3DA` | Secondary text on navy | 6.90:1 on navy |
| `outline` | `#6F86A0` | Input borders | 3.75:1 on white |
| `line` | `#DCE5EC` | Dividers (decorative) | |
| `surface` | `#F6F9FB` | Rows, cards, patient strip | Text 14.45:1 |
| `chip` | `#EAF1F6` | Unselected chip | Text 13.40:1 |
| `danger` / `dangerBg` | `#A1121A` / `#FCEBEC` | Danger signs only | 8.02:1 on white, 6.97:1 on its bg |
| `flag` / `flagBg` | `#7A5300` / `#FFF3D1` | Check, Not sure, Ask clinician (always dashed plus a word) | 6.20:1 |
| `confirmed` / `confirmedBg` | `#1E6B3A` / `#E6F2EA` | Confirmed field (always with a check icon) | White on it 6.52:1 |

Rules: red only for danger signs. Teal marks structure (labels, line numbers, current position), never status. Navy is the one action colour. No gradients, no drop shadows, no colour-only legends. No dark mode in this version.

## Type

Roboto and Roboto Mono only (ship with Android, render Luganda including ŋ, no download). Sizes in sp.

| Token | Size / line height | Weight | Use |
|---|---|---|---|
| `display` | 28 / 34 | 500 | Landscape titles |
| `title` | 26 / 32 | 500 | App bar title |
| `headline` | 28 / 34 | 700 | Main problem on the card |
| `value` | 26 / 32 | 700 | Entered numbers, visit code (tabular) |
| `bodyLg` | 20 / 28 | 400 | Answers, banners |
| `body` | 16 / 24 | 400 | Default; row titles in 700 |
| `bodySm` | 14 / 20 | 400 | Meta and hints. Smallest reading size |
| `label` | 16 / 22 | 600 | Field labels |
| `sectionLabel` | 12 / 16 | 700, caps, 0.09em | Numbered section labels in accent ("1 · Main problem") |
| `code` | 13 / 18 | Mono 700 | Line numbers, HMIS codes |
| `prompt` | 32 / 40 | 700 | The one instruction a patient sees |

## Spacing, shape and touch

- Spacing scale: 4, 8, 12, 16, 24, 32, 48. Side margins 16 dp (20 dp landscape). 6 dp between queue rows.
- Radii: 4 (tags), 8 (buttons, inputs), 12 (banners, cards). Rows use 0 8 8 0 with a 4 dp left bar.
- Flat: no drop shadows. Depth is white on surface plus the left bar.
- Touch targets: 56 dp for primary actions and keypad keys, 48 dp minimum for anything tappable, 8 dp apart. One primary action per screen, pinned at the bottom.

## Components

| Component | Notes |
|---|---|
| App bar | Navy, full bleed: status line, back, eyebrow (role or line), title, meta. |
| Record tabs | On navy under the app bar; current tab underlined in `accentOnDark`, done tabs show a check. |
| Thumb index | Small tabs on the right edge marking the current record section. |
| Line number | Mono, accent. Danger colour on the urgent line. |
| Queue row | Surface fill, 4 dp left bar, line number, name, meta, status tag. Urgent row: danger bar and danger bg. |
| Status tag | Urgent (danger), Card (navy), Check / Not sure / Ask clinician (dashed flag), No card and Drafted (outline), Confirmed (green plus check). |
| Section label | Numbered caps in accent. |
| Patient reported block | Header "Patient reported · Not findings. Take your own history." Lists only what the patient said, with their own words one tap away. |
| Danger banner | `danger` border with a 6 dp left edge, spoken aloud: "Tell the nurse now." Only a person can dismiss it. |
| Ask-a-person banner | Dashed flag style: "Not sure. Please ask a person." |
| Number field | Outline border, unit inside, range below. Out of range: dashed flag border and a plain message; the value is refused, never guessed. |
| Visit code | Four 60 x 68 digit boxes. |
| Diagnosis row | Checkbox (accent when ticked), HMIS code in mono, label. Each tick is its own register line. |
| Scribe field | Drafted (outline tag), Check (dashed flag, blocks save), Confirmed (green with check icon). |
| Register row | Cells from the patient card shaded `accentTint`, with a legend. |
| Sync status | Calm line with icon: "3 records waiting for signal", "Saved on this device". |

## Accessibility and inclusion

- **Contrast:** every text pair above meets 4.5:1; field outlines meet 3:1.
- **Never colour alone:** urgent has a left bar, a red line number and the word Urgent; check states are dashed and worded; confirmed has a check icon.
- **Older users:** body text at least 16 sp (20 sp for answers), nothing to read below 14 sp, targets 56 dp, no time limits, no swipe-only gestures. Layouts tested at 200% font size.
- **Low literacy (patient side):** every patient-facing step has a recorded Luganda prompt and keypad answers (1 Yes, 2 No, 3 Not sure, 0 Ask clinician). No step needs reading.
- **Privacy in a crowded room:** staff PIN, lock after 2 minutes idle; sensitive HMIS rows are clinician-entered behind a disclosure; the intake screen never shows a diagnosis-like word.
- **Language:** strings live in `app/shared/i18n/` (Luganda and English). Never hard-code text. Luganda comes from a native speaker, never machine translation.
- **Motion:** 140 ms fades and 160 ms press feedback only; respect the system reduced-motion setting.
