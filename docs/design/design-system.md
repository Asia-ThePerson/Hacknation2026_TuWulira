# Design system

Starting tokens for the clinic app. Code mirror: [app/shared/tokens.ts](../../app/shared/tokens.ts); change both together. Run the design skills (impeccable, emil-design-eng, design-taste-frontend, web-design-guidelines) over each screen and log findings in CHECKLIST F (Design).

Figma: none yet. Add the link here and in [docs/links.md](../links.md) when one exists.

## Principles

1. **Readable at arm's length in a bright, busy room.** Big type, high contrast.
2. **Voice first, text second.** Patients may not read. Every patient prompt is spoken; text is a backup.
3. **Uncertainty is visible.** A flagged field looks different from a confirmed one, and never only by colour.
4. **Patient reported, never findings.** Intake content always sits under the label "Patient reported".
5. **Privacy in a crowded room.** Nothing on screen a passer-by should not see.

## Colour

| Token | Light | Use |
|---|---|---|
| `bg` | `#FFFFFF` | Screen background |
| `surface` | `#F4F6F7` | Cards |
| `text` | `#111417` | Body text |
| `textMuted` | `#4A5560` | Secondary text |
| `primary` | `#0F4C5C` | Main actions |
| `onPrimary` | `#FFFFFF` | Text on primary |
| `flag` | `#8A5A00` with `flagBg` `#FFF4D6` | Low-confidence field (plus a "Check" label and icon) |
| `danger` | `#A1121A` with `dangerBg` `#FDE7E8` | "Tell the nurse now" only |
| `confirmed` | `#1E6B3A` | Confirmed field (plus a check icon) |

Rule: `danger` is used for danger signs and nothing else, so it never loses meaning. TODO: check every pair against WCAG AA contrast.

## Type

| Token | Size / line height | Use |
|---|---|---|
| `title` | 28 / 34, bold | Screen titles |
| `body` | 20 / 28 | Default. Larger than usual on purpose (older users) |
| `label` | 16 / 22, semibold | Field labels |
| `prompt` | 32 / 40, bold | The one instruction a patient sees |

System font (Roboto on Android) so Luganda characters render with no font download.

## Spacing and touch

- Spacing scale: 4, 8, 12, 16, 24, 32.
- Minimum touch target: 56 x 56 dp (bigger than the 48 dp Android minimum, for older users and busy hands).
- One primary action per screen.

## Components

| Component | Notes |
|---|---|
| Intake card | Heading "Patient reported". Lists only what the patient said. Shows the patient's own words beside any mapped symptom. |
| Field row | Label, value, state (drafted, flagged, confirmed). Flagged rows show "Check" and block save. |
| Ask-a-person banner | Full-width, calm, spoken aloud: "Not sure. Please ask a person." |
| Danger banner | Full-width, `danger` colour, spoken aloud: "Tell the nurse now." Only a person can dismiss it. |
| Record button | One large button. Shows recording state with shape and text, not colour alone. |
| Sync status | "Saved on this device" / "Sent". Never alarming. |

## Inclusivity rules

- **Low literacy:** every patient-facing step has a recorded Luganda prompt and an icon. No step needs reading.
- **Older users:** body text at 20, targets at 56 dp, no time limits on answers, no swipe-only gestures.
- **Privacy in a crowded room:** a quiet mode lets the patient answer by tapping picture options instead of speaking (RQ2.1). The intake screen never shows a diagnosis-like word. Screen dims after the session.
- **Language:** strings live in `app/shared/i18n/` (Luganda and English). Never hard-code text in a screen.
- **Motion:** respect the system reduced-motion setting.
