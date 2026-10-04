# Product video (60 s): Seedance prompts and asset pack

Script: v3 (see [video-plan.md](../video-plan.md) and the Figma page "↳ 60s PRODUCT VIDEO"). Storyboard: the 9-shot board (Hook to End card).

## How to use this

1. **Seedance makes the people and places only.** It garbles on-screen text, so never ask it to draw an app screen, a form or a register. Every screen in the video comes from the PNGs in this folder, laid over the footage in CapCut.
2. **Make Noor once, reuse her everywhere.** Generate the character still first (prompt C0), pick one, and attach it as the reference image on every shot she is in. Same clothes in every shot.
3. **One clip per prompt, 4 to 8 seconds, 1080p, 16:9.** Generate 2 or 3 takes per shot and keep the calmest.
4. **Phone screens:** shots where Noor holds the phone keep the screen turned away or out of focus. Cut to the full-screen PNG for the UI beat, or place the PNG beside her as a split screen (as in the storyboard).
5. **Paste the style block at the start of every prompt** so all shots match.
6. **Label it.** Keep a small caption on every generated shot: "AI-generated footage · synthetic patient". Keep the honesty pills from the script ("Remote path: designed, simulated in web demo", "Paper path: designed in Figma, not built", "Register, tally and export: designed in Figma, not built").

## Style block (paste first in every prompt)

```
Documentary style, dignified and respectful, natural warm colours, soft morning light, shallow depth of field, 35mm film look, gentle handheld camera, rural Uganda. No on-screen text, no subtitles, no logos, no watermarks, no readable writing on any paper or screen.
```

## C0. Character reference (image, generate first)

```
Portrait of a Ugandan woman in her early thirties, calm and kind expression, dark headwrap, patterned brown and orange dress, simple beaded necklace. Plain warm background, soft window light, medium close-up, photorealistic, documentary portrait.
```

Save the best one as `noor-reference.png` and attach it to shots 1, 3, 4a, 4b, 4c.

## Shot prompts

| Shot | Time | Seedance clip | Attach as reference | Overlay from this folder |
|---|---|---|---|---|
| 1 Hook | 0:00 to 0:07 | 7 s | noor-reference | none |
| 2 Problem | 0:07 to 0:13 | 4 s (benches only) | none | 52% card (Figma slide 02), real HMIS 031 image (see Fixes) |
| 3 The turn | 0:13 to 0:17 | 4 s | noor-reference | title "TuWulira · we hear you" |
| 4a Basic phone | 0:17 to 0:21 | 4 s | noor-reference | 4a_01 to 4a_05 |
| 4b Danger sign | 0:21 to 0:25 | 4 s | noor-reference | 4b_01 to 4b_04 |
| 4c Not sure | 0:25 to 0:29 | 4 s | noor-reference | 4c_01 to 4c_03 |
| 5 Paper form | 0:29 to 0:37 | 2 clips, 4 s each | 5_02_paper-form-page2 | 5_01 to 5_08 |
| 6 Consult | 0:37 to 0:43 | 2 clips, 3 s each | none | 6a to 6d |
| 7 Records | 0:43 to 0:50 | optional 3 s | none | 7a to 7d |
| 8 Our take | 0:50 to 0:58 | 6 s | none | quote card, "Rejected: Gemma 4 E2B" tag |
| 9 End card | 0:58 to 1:00 | none | none | 9_end-card |

### 1. Hook (7 s)

```
[style block] A woman (reference image) steps through the doorway of a crowded rural outpatient clinic in Uganda and pauses. Wooden benches full of adults and mothers with young children, painted concrete walls, open windows, morning light. She looks around, a little uneasy at how many people are close by. Camera follows behind her shoulder, then she turns slightly toward camera. Faces in the background soft and out of focus.
```

### 2. Problem (4 s, benches only)

```
[style block] Slow push-in across a busy rural clinic waiting area. Wooden benches, people waiting patiently, a staff member at a desk writing by hand in a large book, seen from a distance. Faces soft and out of focus, calm atmosphere.
```

Then cut to a real HMIS 031 register image with a slow zoom (CapCut keyframes), and lay the 52% card over it.

### 3. The turn (4 s)

```
[style block] Close-up of the same woman (reference image) sitting in the clinic waiting room. She looks back over her shoulder at the camera and gives a small, warm smile. Busy clinic softly blurred behind her. Slow push-in.
```

### 4a. From her basic phone at home (4 s)

```
[style block] The same woman (reference image) sits outside a small farmhouse in green hills, coffee plants behind her, early morning. She holds a small basic feature phone with physical keys (not a smartphone), presses one key, hangs up, waits, then answers when it rings and lifts it to her ear. Medium shot. The phone screen faces away from the camera.
```

Overlay order: 4a_01 flash call, 4a_02 callback, 4a_03 consent, 4a_04 private questions (keypad), 4a_05 visit code.

### 4b. Danger signs go straight to the nurse (4 s)

```
[style block] Same woman and setting (reference image). She listens to the phone carefully, her expression becomes concerned, she looks down and presses a key firmly, then listens again and nods. Close medium shot, phone screen not visible.
```

Overlay order: 4b_01 danger-sign question, 4b_02 come in today and permission, 4b_03 SMS with clinic name only, then 4b_04 the clinic tablet showing the remote alert.

### 4c. Not sure, ask a person (4 s)

```
[style block] Same woman and setting (reference image). She speaks into the basic phone while a child cries nearby off camera, she pauses, listens, then nods and presses one key, reassured. Medium shot, phone screen not visible.
```

Overlay order: 4c_01 no speech heard, 4c_02 ask once more, 4c_03 "Not sure. A person will ask."

### 5. Paper form, in person (2 clips)

Clip 5a (4 s), attach `5_02_paper-form-page2-danger-signs.png` as a reference for the layout only:

```
[style block] Overhead close-up of a woman's hand circling answers with a pen on a printed black and white paper form with rows of rounded answer boxes, on a wooden clinic desk. The writing on the form is blurred and not readable. Slow, steady camera.
```

Clip 5b (4 s):

```
[style block] A clinic clerk holds an Android phone flat above a paper form on a wooden desk, lining up the four corners, and takes a photo. Over-the-shoulder shot, the phone screen is out of focus. Soft daylight.
```

Overlay order: 5_03 danger signs first by eye, 5_04 photograph page, 5_05 reading the form, 5_06 check what is unsure, 5_07 confirm and create card, 5_08 the card says it came from paper. Show 5_01 and 5_02 as full-screen inserts of the form itself.

### 6. Consult (2 clips, 3 s each)

Clip 6a:

```
[style block] A triage nurse in a white uniform sits at a small clinic desk with an Android tablet, taps the screen, then calls the next patient with a gesture. Medium shot, tablet screen out of focus.
```

Clip 6b:

```
[style block] A clinician in a white coat sits across a small desk from a patient in a simple consultation room, listens, glances down at a tablet, then nods and taps it. Warm daylight, calm. Tablet screen out of focus.
```

Overlay order: 6a queue (urgent first), 6b triage urgent, 6b weight and temperature, 6c card labelled "Patient reported", 6c diagnoses (HMIS 105), 6d visit closed.

### 7. Records, end of day (optional 3 s)

```
[style block] Late afternoon in an empty clinic records room. A staff member closes a large paper register book and sets an Android tablet on top of it, then switches off the desk lamp. Slow push-in, golden light.
```

Then the four tablet screens full width, left to right: 7a register, 7b tally, 7c export (totals only), 7d sent when there is signal. Keep the pill "Register, tally and export: designed in Figma, not built".

### 8. Our take (6 s)

```
[style block] Still life on a wooden table: a large closed paper register book and a small basic feature phone with physical keys beside it, morning light moving slowly across the table. Very slow push-in. No readable writing.
```

Lay the quote card "Fitting the world that's already there" and the tag "Rejected: Gemma 4 E2B, needs about 2.4 GB RAM; floor phone has 2 GB" over it.

### 9. End card

Use `9_end-card.png` as is. Hold 2 s.

## Asset index

All PNGs are wireframes from the Figma project hub. Every name and number on them is synthetic sample data.

| File | Shows | Figma source |
|---|---|---|
| 4a_01 to 4a_05 | Flash call, callback, consent, private questions on the keypad, visit code | Wireframes: Patient screens (basic phone) |
| 4b_01 to 4b_03 | Danger-sign question, come in today and permission, SMS with clinic name only | same |
| 4b_04 | Clinic tablet showing the remote alert | same |
| 4c_01 to 4c_03 | No speech, ask once more, "Not sure. A person will ask." | same |
| 5_01, 5_02 | Printed patient intake form, pages 1 and 2 (proposed Version E) | Paper Intake Forms |
| 5_03 to 5_08 | Paper form photo capture, reading, staff check, card | Wireframes: Clinic device, "Paper form: photo capture" |
| 6a to 6d | Queue, triage, weight and temperature, card, diagnoses, visit closed | Wireframes: Clinic device |
| 7a to 7d | OPD register, monthly tally, export of totals, send when there is signal | Wireframes: Clinic device, "Register and tally" |
| 9_end-card | End card | 60s PRODUCT VIDEO page |

## Fixes before you publish

1. **Shot 2 register image.** The storyboard frame looks generated (the handwriting is not real words) but is labelled "Real HMIS 031 register". Use a real blank HMIS 031 scan with its source and licence noted, or relabel the shot "illustration". Never show real patient entries.
2. **Name mismatch.** The narration says Noor, but the clinic screens show the flash-call patient as "Nakato A.". Either rename the persona in the narration or accept that the screens show a different sample patient.
3. **Built versus designed.** Remote path, paper path, register, tally and export are not built (README "Not built" list). Keep the honesty pills on screen for shots 4, 5 and 7.
