# Product video (60 s): Dreamina prompts

Dreamina version of the Seedance prompt pack (`docs/hackathon/video-assets/README.md` on branch `claude/keen-mendel-lvbyxz`) (same 9-shot storyboard, script v3). Dreamina runs ByteDance's Seedance video models and Seedream image models. Updated for the current product: the basic-phone path is now the demo lead (D38) and works in the live prototype.

## What changed from the Seedance pack

1. **Start frames first, then motion.** For each shot, make a still in **Dreamina AI Image** with Noor's portrait as the reference, then animate it in **AI Video** using that still as the **first frame**. Same face and clothes in every shot.
2. **Clip length.** Dreamina video clips come in fixed lengths (5 s or 10 s on the Seedance models). Generate 5 s and trim to the storyboard time in CapCut. Shot 1 (7 s): generate 10 s and trim.
3. **Shorter prompts, one action each.** Seedance follows one subject, one action and one camera move best. The style block is now a short line at the end of each prompt.
4. **Phone and tablet screens: record the live prototype.** The basic phone and the clinic tablet now work at https://asia-theperson.github.io/Hacknation2026_TuWulira/#/both. Screen-record it for shots 4a, 4b, 4c and 6 instead of the Figma PNGs. A working prototype is stronger evidence than a wireframe. Use the PNGs only as a fallback.
5. **Noor calls for her child.** The demo script uses the child path (a danger sign, then a crying child for "Not sure"). The child stays off camera or seen from behind, so no second face has to stay consistent.
6. **Honesty labels updated** (see the end).

## Settings (every clip)

- AI Video, newest Seedance model in the model menu, **Image to video** with the start frame from this pack.
- Aspect ratio **16:9**, highest resolution offered (1080p if available), **5 s**.
- 2 or 3 takes per shot. Keep the calmest; reject any with warped hands, extra fingers, or readable fake text.
- If the menu offers camera control, set it to match the camera line in the prompt; otherwise leave it on auto.

## Step 0. Noor's portrait (AI Image, text to image)

```
Portrait of a Ugandan woman in her early thirties, calm and kind expression, dark headwrap, patterned brown and orange dress, simple beaded necklace. Plain warm background, soft window light, medium close-up, photorealistic documentary portrait, 35mm film look.
```

Save the best as `noor-reference.png`. For every start frame below, upload it as the **reference image** (character or face reference, at a high strength).

## Style line

Already at the end of every prompt below, so all shots match:

```
Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```

## Shots

Each shot has a start-frame prompt (AI Image, with `noor-reference.png` where marked) and a motion prompt (AI Video, image to video). The style line is already included, so each block pastes as is.

### 1. Hook (0:00 to 0:07, generate 10 s)

Start frame (reference: Noor):
```
A Ugandan woman (reference) standing in the doorway of a crowded rural outpatient clinic, seen from just behind her shoulder. Wooden benches full of adults and mothers with young children, painted concrete walls, open windows. Background faces soft and out of focus. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Motion:
```
She steps into the room and pauses, looking around, a little uneasy at how many people are close by, then turns slightly toward camera. Camera follows gently behind her shoulder. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```

### 2. Problem (0:07 to 0:13, generate 5 s)

Start frame (no reference):
```
Wide view of a busy rural clinic waiting area in Uganda. Wooden benches, people waiting patiently, a staff member at a desk in the distance writing by hand in a large book. Faces soft and out of focus. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Motion:
```
Slow push-in across the waiting area toward the desk. People shift slightly while they wait. Calm atmosphere. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Then cut to the register image and the 52% card (see Fixes).

### 3. The turn (0:13 to 0:17, generate 5 s)

Start frame (reference: Noor):
```
Close-up of the woman (reference) sitting on a wooden bench in a busy clinic waiting room, looking away from camera. Clinic softly blurred behind her. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Motion:
```
She looks back over her shoulder at the camera and gives a small, warm smile. Slow push-in. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Overlay: title "TuWulira · we hear you".

### 4a. From her basic phone at home (0:17 to 0:21, generate 5 s)

Start frame (reference: Noor):
```
The woman (reference) sitting on a wooden stool outside a small farmhouse in green hills, coffee plants behind her, early morning. A toddler sits beside her, seen from behind. She holds a small basic feature phone with physical keys, not a smartphone, screen facing away from camera. Medium shot. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Motion:
```
She presses one key, hangs up and waits. The phone rings; she answers and lifts it to her ear. Camera still. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Overlay: screen recording of the basic phone on `#/both`: missed call, call back, consent (press 1).

### 4b. Danger sign goes straight to the nurse (0:21 to 0:25, generate 5 s)

Start frame (reference: Noor):
```
Close medium shot of the woman (reference) outside the farmhouse, holding the basic phone to her ear, listening carefully, her other hand resting on the toddler's back. Phone screen not visible. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Motion:
```
Her expression becomes concerned. She lowers the phone, presses one key firmly, raises it again, listens and nods. Camera still. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Overlay: screen recording: the danger question ("Is the child unable to drink or breastfeed?"), Yes, "Please come to the clinic today. May we tell the clinic now?", Yes, then the clinic tablet with the urgent card at the top of the queue. Optional still: `4b_03_sms-clinic-name-only.png`.

### 4c. Not sure, ask a person (0:25 to 0:29, generate 5 s)

Start frame (reference: Noor):
```
Medium shot of the woman (reference) outside the farmhouse speaking into the basic phone, the toddler beside her seen from behind, upset. Phone screen not visible. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Motion:
```
The toddler cries; she pauses, listens to the phone, then nods, reassured, and presses one key. Camera still. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Overlay: screen recording with the speech control on "Silence or noise": "Sorry, we did not hear you", then "Not sure. Please ask a person."

### 5. Paper form, in person (0:29 to 0:37, two 5 s clips)

Clip 5a start frame (reference: `5_02_paper-form-page2-danger-signs.png`, for layout only):
```
Overhead close-up of a printed black and white paper form with rows of rounded answer boxes on a wooden clinic desk, a hand holding a pen above it. All writing blurred and unreadable. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Motion:
```
The hand circles three answers with the pen. Slow, steady overhead camera. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Clip 5b start frame (no reference):
```
Over-the-shoulder view of a clinic clerk holding an Android phone flat above a paper form on a wooden desk. Phone screen out of focus. Soft daylight. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Motion:
```
The clerk lines up the phone over the four corners of the form and takes a photo. Camera still. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Overlay: `5_03` to `5_08` and `5_01`, `5_02` as before.

### 6. Consult (0:37 to 0:43, two 5 s clips, trim to 3 s each)

Clip 6a start frame:
```
A triage nurse in a white uniform at a small clinic desk with an Android tablet lying flat, screen out of focus. Medium shot, warm daylight. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Motion:
```
She taps the tablet, looks up and calls the next patient with a small wave. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Clip 6b start frame:
```
A clinician in a white coat across a small desk from a seated patient in a simple consultation room, a tablet on the desk, screen out of focus. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Motion:
```
The clinician listens, glances down at the tablet, nods and taps it. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Overlay: screen recording of the clinic tablet: the card labelled "Patient reported", a refused weight of -5, a diagnosis picked from the HMIS 105 list by the clinician.

### 7. Records, end of day (0:43 to 0:50, optional 5 s)

Start frame:
```
Late afternoon in an empty clinic records room, a large closed paper register book on a desk with an Android tablet on top, a desk lamp on. Golden light. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Motion:
```
A hand switches off the desk lamp. Very slow push-in. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Overlay: `7a` to `7d` with the label "Register, tally and export: designed in Figma, not built".

### 8. Our take (0:50 to 0:58, generate 10 s, trim to 8 s)

Start frame:
```
Still life on a wooden table: a large closed paper register book and a small basic feature phone with physical keys beside it, morning light. No readable writing. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Motion:
```
Morning light moves slowly across the table. Very slow push-in. Documentary style, natural warm colours, soft morning light, shallow depth of field, 35mm film look, rural Uganda, no text.
```
Overlay: quote card "Fitting the world that's already there", and the tag "Rejected: Gemma 4 E2B, needs about 2.4 GB RAM; floor phone has 2 GB".

### 9. End card (0:58 to 1:00)

`9_end-card.png`, held 2 s. Add the live link: asia-theperson.github.io/Hacknation2026_TuWulira

## Labels to keep on screen

- On every generated shot: "AI-generated footage · synthetic patient".
- Shots 4a to 4c: "Basic-phone path: working prototype, simulated call".
- Shot 5: "Paper path: designed in Figma, not built".
- Shot 7: "Register, tally and export: designed in Figma, not built".

## Fixes before you publish

1. **Shot 2 register image.** Use a real blank HMIS 031 scan with its source noted, or label the shot "illustration". Never show real patient entries.
2. **Names.** The prototype's sample child card says "Sample child"; the narration says Noor. Either say "Noor calls about her child" in the narration, or leave names out of the voice-over.
3. **The PNGs live on another branch.** The Figma exports in this folder are on branch `claude/keen-mendel-lvbyxz`, not merged yet. Merge it, or download them from Figma.
