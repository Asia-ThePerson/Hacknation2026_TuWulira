# Review: Style 1, After Hours

Reviewed: `reference/1-after-hours-board.html`, rendered at 1920×1080 with the intended fonts loaded (Barlow Condensed, DM Mono, DM Sans).
Lenses: design critique, accessibility, typography, colour, anti-slop, spacing and layout.

Findings are ranked by impact. Items marked **[direction]** would change what the style says or does, so they need the owner's call before enhancing. Everything else is a quality fix that keeps the style as it is.

---

## Summary

The concept is clear and it already reads as "fashion label, not gym": flat near-black, condensed caps, mono detail lines, and good format ideas (receipt, notes app, playlist). The weaknesses are not the direction. They are three rule breaks against the brief (tagline treatment, gradient glows, sub-12px captions), a voice sample that contradicts the voice rule, missing brand-system pieces the brief lists (sign-off, signature method, texture pairing), and a loose grid with uneven bottom edges and empty space.

---

## 1. Hard-constraint breaks (fix first)

**1.1 Tagline set in condensed caps on the statement cover. [direction]**
The cover sets "PRACTICE WITHOUT PERMISSION." in Barlow Condensed SemiBold caps. The brief says the tagline is *always* DM Sans Italic, tracked +6 to 8%. This is the hero tile of the board, so it teaches the wrong rule.
Fix options: (a) keep the cover's condensed statement but change the words to a different statement line ("LET YOURSELF IN." or "THE ROOM IS YOURS.") and put the true tagline small in DM Sans Italic; or (b) set the tagline itself in DM Sans Italic at display size on the cover. Option (a) keeps the style's look; option (b) keeps the copy.

**1.2 Gradient glows used as photo stand-ins. [direction, minor]**
The statement cover and the space reveal both use a `radial-gradient` warm glow (tan `rgba(214,180,130)` and `rgba(220,200,160)`). The brief bans gradient washes in all four styles. They are meant to suggest LED and window light, but on a brand board they read as a design device, and a soft spotlight glow is a stock "premium dark" template trope.
Fix: replace with flat placeholder blocks plus a labelled light direction ("PHOTO · LED STRIP, LEFT, LOW"), or a hard-edged flat light shape (a single lighter rectangle for a window or strip). Hard light also fits "sleek" better than a soft bloom, and helps separate this style from Style 4's grain.

**1.3 Board text below 12px.**
At 1920×1080 the board *is* the export, so these fail the 12px caption floor:

| Element | Size |
|---|---|
| Postcard "QUEEN ST W · SOON" | 9px |
| Swatch labels and hex codes | 10px |
| Sock box "GRIP SOCKS · ONE PAIR" | 10px |
| Photo labels ("PHOTO · CROPPED TORSO...", "PHOTO · DOORWAY VIEW") | 10px |
| Space reveal detail line | 10px |
| Highlight captions ("The method", "Access"...) | 11px |
| Launch slide "[DATE] · [TIME]" | 11px |
| Receipt lines | 11px |

Text *inside* the post tiles scales about 3.5× at real 1080px export (10px becomes about 35px), so it is fine on the final post. Only the board needs bumping. Fix: 12px minimum on the board, 13px for mono with 0.2em tracking (wide tracking at small size reads lighter).

**1.4 Logo resolution note missing.**
The brief asks for a note wherever the low-res PNGs should be swapped for vector originals. There is none. Fix: one small "Logo: replace with vector original" note in the board footer.

---

## 2. Brand-system and voice gaps (high impact)

**2.1 Voice sample contradicts the voice rule. [direction, small]**
The voice is "lowercase, deadpan, one line (let yourself in.)". The board shows it as "LET YOURSELF IN." in 38px condensed caps, so the one voice example on the board is not in the voice. It also blurs the two registers the style needs: CAPS for on-image statements, lowercase for captions.
Fix: show both explicitly. A "Statement" sample in caps, and a "Caption" sample in lowercase DM Sans ("let yourself in.") with the fixed sign-off under it.

**2.2 Missing pieces the brief asks for.**
- **Fixed caption sign-off** (from KŌR): not shown anywhere. Propose a placeholder line, for example `— free former, queen st w` or `[SIGN-OFF]`, and show it once in a caption mock.
- **Named signature method with its own highlight:** the "METHOD" highlight exists but the method has no name. Keep it as `[METHOD NAME]` (do not invent one) and show where it lives.
- **Movement + texture pairing:** every movement post should pair with a quieter texture post. The board has no pairing example. A two-tile "pair" (cropped movement / close texture: walnut grain, spring, strap) would show the rhythm.
- **Logomark etched on equipment:** only the wall shadow is shown. Add a placeholder for an etched or embossed mark on the carriage or footbar.
- **Moss rule:** the palette says Moss appears "only in real objects (plants, tile)". The board shows a Moss swatch with no note. Add the note under the swatch.

**2.3 Photo stand-ins are not labelled consistently.**
Two tiles have "PHOTO ·" labels, the café postcard tile has a sentence caption, the sock box has none. The brief asks for clearly labelled placeholders saying what to shoot. Fix: every photographic tile gets the same mono "SHOOT ·" line with subject, crop and light (for example "SHOOT · TORSO CROP AT THE HIP, BACK TO CAMERA, LED STRIP LEFT"). This also keeps privacy explicit (crops at joints, backs).

---

## 3. Typography

**3.1 Statement weight inconsistency.** Launch slide uses Barlow Condensed 500; every other statement uses 600. Tracking also varies with no clear rule (0.10, 0.12, 0.14, 0.18em). Fix: one statement spec, SemiBold 600, tracking 0.12em for display sizes, 0.16em at small sizes.

**3.2 Mono tracking is uniform and wide everywhere.** DM Mono at 0.2em is used for the header, details, labels, swatches and receipts. Everything mono looks the same, so detail lines lose their role. Fix: 0.2em only for detail lines and the header; 0.08em for labels and receipts.

**3.3 Interpunct overuse.** The "·" separator appears in the header, detail lines, captions, playlist meta, photo labels and the postcard. It is a good Salud trait for detail lines; elsewhere it turns into texture. Fix: keep "·" for detail lines and stamps; use plain sentences in board captions.

**3.4 Notes-app tile.** The bullet "○" is a typed glyph with uneven alignment. Use a drawn 14px circle so the list aligns, and use the real checklist feel (one item ticked).

---

## 4. Colour and contrast

Contrast checked with WCAG relative luminance:

| Pair | Ratio | Result |
|---|---|---|
| Ground on Deep | 13.6 | Pass |
| Ground on Forest | 8.4 | Pass |
| Ground on Moss (swatch label) | 4.7 | Pass, just |
| Ground 85% on Deep (board captions) | 10.2 | Pass |
| Ground on café brown | 6.0 | Pass |
| **Stone #6F6D67 on Ground ("Notes · today", 12px)** | **4.28** | **Fail AA** |
| Forest fill on Deep (Founders highlight edge) | 1.6 | Shape nearly vanishes |

**4.1 Stone on Ground fails.** Notable because Stone is the site's body text colour. On Ground it needs darkening for small text. Fix: use Forest (8.4:1) for small secondary text on Ground. Moss passes only just (4.7:1) and is reserved for real objects in this style anyway. Flag to owner that Stone on Ground is under AA for body text on the live site too, if the site uses that pair.

**4.2 Off-palette colours.** The board uses seven colours not in the palette: `#141512`, `#2A2C27`, `#2A2C26`, `#2E2B25`, `#0F100E`, `#6B5240` (café table), `#D8D0C2`, plus the tan glows. Most are near-black variants of Deep. Fix: define two named tints (Deep −1 and Deep +1) as stand-in surfaces, and mark the café brown as "photo stand-in, not a brand colour".

**4.3 Invented share proportions.** The swatch strip widths imply shares (45/22/15/10/8). The brief only gives Deep ~45%. Either label only that share or note the rest as indicative.

**4.4 Swatch labels inconsistent.** Deep and Forest show hex codes; Ground, Linen and Moss do not.

---

## 5. Layout and spacing

**5.1 Ragged bottom edges and dead space.** Column bottoms land at different heights: logo panel 778px, swatches 902px, post grid 905px, postcard 920px, highlights 1031px, left text 1030px. The middle grid leaves about 125px empty under it. Fix: a 12-column grid with one shared bottom line; let the post grid take the full height (two rows of 4:5 tiles fit at about 290px wide with a third row of format tiles), or add the texture-pair row there.

**5.2 Oversized logo panel.** The lockup panel is 400×676 with the logo in the middle third. It is the largest object on the board and the least informative. Fix: shorten it to about half and use the freed height for the voice samples (2.1) and the logo-on-photo rule (minimum size, clear space, which ink on which surface).

**5.3 Gutters vary.** 28px between columns, 18px between tiles, 20px vertical in the left column, 6px tile-to-caption, 10 to 22px inside tiles. Fix: one 24px gutter, 8px tile-to-caption, a 4px base unit. This also sets up the cross-style margin unification the brief asks for.

**5.4 Highlights row.** The Founders circle has no border, so it is 2px smaller and its label sits 2px higher than the others. "FOUNDERS" and "QUEEN W" nearly touch the circle edge at 14px with 0.1em tracking. The caption under each circle repeats the circle text. Fix: same 1px border on all four (Founders filled *and* bordered), 13px with 0.08em tracking, and drop the duplicate captions or use them for what each highlight holds.

**5.5 Space reveal centre line.** The 1px vertical line runs behind "REFORMER." and reads like a crop guide left in by mistake. Either make it a deliberate doorway edge (offset to one side, full strength) or remove it.

**5.6 Sock box.** The lid floats with a gap above the box and reads unfinished. The monogram is 34px, below a sensible minimum for an ornate mark. Fix: set a minimum monogram size (proposed 48px on screen, 12mm in print) and either draw the box cleanly or replace with a labelled shoot placeholder.

**5.7 Postcard tile.** The only drop shadow and only rotated object on an otherwise flat board. Acceptable as an "in place" photo stand-in, but label it as one (see 2.3).

---

## 6. Anti-slop pass

- Soft radial spotlight glows: template "premium dark" trope. Remove (see 1.2).
- Blurred monogram at 14% opacity as the "wall shadow": reads as a watermark, not a cast shadow. A real shadow has a hard light source. As a stand-in, use a crisper, larger, skewed shadow shape and label "SHOOT · MONOGRAM PROJECTED ON WALL (GOBO)". Note: the logo must not be redrawn, so the shadow should come from the PNG, not a recreation.
- Centred everything: launch slide, space reveal, logo panel, sock box, postcard and highlights are all centred. Salud's look uses one centred launch label as the exception. Fix: left-align statements and details by default; keep centring for the launch slide only, so it lands as an event.
- No emoji, neon or intensity language anywhere. Good.

---

## 7. Separation from Style 4

Both are dark. To keep After Hours clearly "fashion label sleek": flat surfaces, hard edges, no grain, no blur, generous negative space, one statement per tile, condensed caps. Removing the glows and blur (1.2, section 6) does most of this work. Style 4 keeps grain, halftone, collage and outlined wide type.

---

## Questions for the owner

1. Tagline on the cover (1.1): keep the condensed look with a different statement line, or set the tagline in DM Sans Italic at display size?
2. Light stand-ins (1.2): OK to replace the soft glows with flat, hard-edged light shapes plus shoot notes?
3. Sign-off and method name (2.2): is there a working sign-off or method name, or should both stay `[PLACEHOLDER]`?
4. Is "FROM KŌR + SALUD" fine in the board header? It is useful internally but names a local competitor if the board is shared.
