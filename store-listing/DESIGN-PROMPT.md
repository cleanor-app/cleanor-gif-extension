# Claude Design: prompt for the full GIF Toolkit graphics set

Upload the 7 popup captures from **`store-listing/popup-shots/`** together with this prompt.
They are real screenshots of the working extension (380 px popup, captured at 2x), not mockups:

| File | What it shows |
| --- | --- |
| `01-drop.png` | Empty drop zone |
| `02-optimize.png` | Real meme GIF: 426x426, 125 frames, **8.44 MB to 4.24 MB (-50%)** |
| `03-reverse.png` | Reverse switch on (dog reaction GIF) |
| `04-trim.png` | Trim: frames 34 to 92 of 125 |
| `05-speed.png` | Speed 2x, size 60%, 64 colors |
| `06-incoming.png` | Right-click hand-off banner ("Open the GIF from this page?") |
| `07-dark.png` | Dark mode result |

**Do not redraw or restyle the popup.** Google requires store screenshots to show the extension
as it actually is, and the savings figures visible in the captures are real measurements. Place
the captures as they are; invent only the background, headline and framing around them.

**House rule: no em dashes anywhere in the copy.** Use a comma, a colon, or a full stop.

---

## Prompt to paste into Claude Design

> You are designing the complete Chrome Web Store graphics set for **Cleanor GIF Toolkit**, a
> free Chrome extension that reverses, compresses, trims, speeds up and resizes animated GIFs
> entirely on the user's device. Nothing is uploaded.
>
> I am attaching real screenshots of the extension's popup. **Place them as-is** inside the
> compositions (you may add a rounded corner radius and a soft drop shadow). Do not redraw,
> restyle or invent UI.
>
> ### Brand system
>
> This has to sit beside two live Cleanor extensions, so stay in-family. Calm, technical,
> trustworthy: a developer tool, not a toy.
>
> - Primary blue `#4576FD`, deep blue `#2F55D4`, tint `#EEF3FF`
> - Ink `#1C2434`, muted text `#56617A`
> - Success green `#12B886` on `#E7F8F2` (use it for savings figures and privacy chips)
> - Surfaces: soft gradients from `#F7F9FF` to `#E4ECFF`; a faint blue dot grid is on-brand
> - Type: a clean geometric or neo-grotesque sans. Headlines heavy (800 weight), tight tracking
>   (about -2.5%), 56 to 64 px. Body 22 to 24 px in the muted grey. No serif, no script.
> - Generous whitespace. Light theme throughout, except where noted.
> - No em dashes in any text.
>
> ### 1. Store icon, 128x128 px
>
> A rounded square (about 22% corner radius) in a `#4576FD` to `#2F55D4` vertical gradient, with
> a white glyph centred on it. The glyph should read instantly at 16x16, so it must be one bold
> idea, not a scene: a filmstrip frame with a circular arrow around it (reverse), or a filmstrip
> with a downward compression arrow. Keep at least 10% padding inside the square. Deliver at
> 128x128, and confirm it still reads when scaled to 16x16 and 48x48.
>
> ### 2. Five screenshots, 1280x800 px each
>
> Layout for all five: headline and one supporting sentence on the left with a small accent chip
> beneath, the attached popup capture floating on the right at about 370 px wide with a soft
> shadow. The headline must stay readable when the image is scaled down to a 320 px-wide
> thumbnail. Bold marks the phrase to set in deep blue `#2F55D4`; the rest of the headline in ink.
>
> 1. Use `02-optimize.png`. Headline: "Make GIFs **actually smaller**". Sub: "Not a re-save.
>    Pixels that do not change are never stored twice, so a real meme GIF loses about half its
>    weight at the default settings, with nothing visibly lost." Chip: "On your device, nothing
>    uploaded".
> 2. Use `03-reverse.png`. Headline: "Reverse it, **one switch**". Sub: "Play any GIF backwards.
>    Turn a clip into a loop that runs forward and back, or just make the joke land." Chip: "Live
>    preview as you change it".
> 3. Use `04-trim.png`. Headline: "Trim to the **frames you want**". Sub: "Drag two handles to cut
>    the dead air at the start, stop before the logo, or pull one reaction out of a long clip."
>    Chip: "Frame exact".
> 4. Use `05-speed.png`. Headline: "Speed, size, **colors, loop**". Sub: "Retime from 0.25x to 4x,
>    scale to 20 to 100%, cap the palette, keep every 2nd frame. The exact output size updates as
>    you drag." Chip: "Real numbers, not estimates".
> 5. Use `06-incoming.png`. Headline: "Right-click any **GIF on a page**". Sub: "No saving the
>    file first. Access to that one site is asked for at that moment, never held up front. APNG
>    and animated WebP work too." Chip: "One permission, nothing else".
>
> ### 3. Marquee promo tile, 1400x560 px
>
> Headline: "Reverse, shrink and trim **any GIF, on your device**". Sub: "Free. No upload, no
> account, no tracking. APNG and animated WebP too." Use `07-dark.png` on the right at about
> 300 px wide. Keep everything important at least 60 px away from every edge: Google crops this
> tile on some surfaces.
>
> ### 4. Small promo tile, 440x280 px
>
> Displayed small, so keep it to four elements, centred: the extension icon, the word-mark "GIF
> Toolkit", the line "REVERSE · OPTIMIZE · TRIM · SPEED" in primary blue, and "100% on your
> device. By Cleanor." No screenshot, no paragraph.
>
> ### Hard constraints
>
> - Export every asset as **PNG, 24-bit, with no alpha channel**. The Web Store rejects
>   transparency.
> - Exact pixel dimensions. No bleed, no rounded outer corners.
> - Make no claim that the screenshots do not support: the savings shown must match the figures
>   visible in the captures.
> - No Google or Chrome logos or branding.

---

## Required sizes (Chrome Web Store)

| Asset | Size | Notes |
| --- | --- | --- |
| Store icon | **128x128** | Also used at 16, 32 and 48 px in the browser |
| Screenshots (1 to 5) | **1280x800** | 640x400 also allowed, 1280x800 preferred |
| Small promo tile | **440x280** | Not 440x220: that upload is rejected |
| Marquee promo tile | **1400x560** | Optional, needed for featured placement |

A 920x680 "large tile" existed in the old store and is no longer accepted, so it is not in the set.

## Working set already in the repo

`store-listing/png/` holds a complete set built from these same captures (5 screenshots, both
tiles, correct sizes, 24-bit, no alpha). It is good enough to submit as-is, and doubles as a
reference for the Claude Design pass.
