# Claude Design — prompt for the GIF Toolkit store graphics

Upload the 7 real popup captures from **`store-listing/popup-shots/`** alongside this prompt.
They are actual screenshots of the working extension (380 px popup, captured at 2×), not mockups:

| File | State it shows |
| --- | --- |
| `01-drop.png` | Empty drop zone |
| `02-optimize.png` | Result: 480×360 · 30 frames · **487.2 KB → 243.4 KB (−50%)** |
| `03-reverse.png` | Reverse switch on |
| `04-trim.png` | Trim: **frames 6–18 of 30** → 487.2 KB → 110.3 KB (−77%) |
| `05-speed.png` | Speed 2× · Size 60% · 64 colors |
| `06-incoming.png` | Right-click hand-off banner ("Open the GIF from this page?") |
| `07-dark.png` | Dark mode result |

⚠️ **Do not redraw or restyle the popup.** Google requires store screenshots to show the
extension as it actually is. Place the real captures inside the compositions; invent only the
background, headline and framing around them.

---

## Prompt to paste

> You are designing the Chrome Web Store listing graphics for **Cleanor GIF Toolkit**, a free
> Chrome extension that reverses, compresses, trims, speeds up and resizes animated GIFs
> entirely on the user's device (nothing is uploaded).
>
> I am attaching real screenshots of the extension's popup. Compose the store assets around
> them — **place the attached screenshots as-is** (you may add a rounded corner radius and a
> soft drop shadow); do not redraw, restyle or fake the UI.
>
> **Brand system** (this must sit next to two live Cleanor extensions, so stay in-family):
> - Primary blue `#4576FD`, deep blue `#2F55D4`, tint `#EEF3FF`
> - Ink `#1C2434`, muted text `#56617A`
> - Success green `#12B886` on `#E7F8F2` (use for the savings figure / privacy chip)
> - Surfaces: near-white `#F7F9FF` → `#E4ECFF` soft gradients; a very subtle dot grid is on-brand
> - Type: a clean geometric/neo-grotesque sans. Headlines heavy (800), tight tracking (−2.5%),
>   large (56–64 px); body 22–24 px, muted. No serif, no script, no outline fonts.
> - Feel: calm, technical, trustworthy — a developer tool, not a toy. Generous whitespace.
>   Light theme by default; one asset may go dark for contrast.
>
> **Deliverables**
>
> **5 screenshots — 1280×800 px each.** Layout: headline + one supporting sentence + a small
> accent chip on the left, the attached popup capture floating on the right at ~370 px wide with
> a soft shadow. Keep the headline readable when the image is scaled to a 320 px-wide thumbnail.
>
> 1. **Use `02-optimize.png`.** Headline: "Make GIFs **actually smaller**". Sub: "Not a re-save.
>    Unchanged pixels are never stored twice, so a moving subject on a steady background is
>    halved or better — with nothing visibly lost." Chip: "🔒 On your device · nothing uploaded".
> 2. **Use `03-reverse.png`.** Headline: "Reverse it, **one switch**". Sub: "Play any GIF
>    backwards. Turn a clip into a loop that runs forward and back, or just make the joke land."
>    Chip: "⚡ Live preview as you change it".
> 3. **Use `04-trim.png`.** Headline: "Trim to the **frames you want**". Sub: "Drag two handles
>    to cut the dead air at the start, stop before the logo, or pull one reaction out of a long
>    clip." Chip: "✂️ Frame-exact".
> 4. **Use `05-speed.png`.** Headline: "Speed, size, **colors, loop**". Sub: "Retime from 0.25×
>    to 4×, scale to 20–100%, cap the palette, keep every 2nd frame. The exact output size
>    updates as you drag." Chip: "📉 Real numbers, not estimates".
> 5. **Use `06-incoming.png`.** Headline: "Right-click any **GIF on a page**". Sub: "No saving
>    the file first. Access to that one site is asked for at that moment — never held up front.
>    APNG and animated WebP work too." Chip: "🛡️ One permission, nothing else".
>
> (Bold marks the phrase to set in the deep blue `#2F55D4`; the rest of the headline in ink.)
>
> **Marquee promo tile — 1400×560 px.** Headline: "Reverse, shrink and trim **any GIF — on your
> device**". Sub: "Free. No upload, no account, no tracking. APNG and animated WebP too."
> Use `07-dark.png` on the right, ~300 px wide. Nothing important within 60 px of any edge —
> Google crops this tile on some surfaces.
>
> **Small promo tile — 440×280 px.** Centred: the extension icon (attached separately, or a
> rounded blue square with "GIF"), the word-mark "GIF Toolkit", the line
> "REVERSE · OPTIMIZE · TRIM · SPEED" in primary blue, and "100% on your device — by Cleanor".
> It is displayed small — keep it to those four elements, no screenshot, no paragraph.
>
> **Hard constraints**
> - Export every asset as **PNG, 24-bit, no alpha channel** — the Web Store rejects transparency.
> - Exact pixel dimensions, no bleed, no rounded outer corners.
> - No claims beyond these: the savings shown must match the numbers visible in the screenshots.
> - No Google/Chrome logos or branding of any kind.

---

## Size note

Google's small promo tile is **440×280**, not 440×220 — a 440×220 upload is rejected. Sizes the
Web Store accepts:

| Asset | Required size |
| --- | --- |
| Screenshots (1–5) | **1280×800** (or 640×400) |
| Small promo tile | **440×280** |
| Marquee promo tile | **1400×560** |
| Store icon | **128×128** |

## Already generated

`store-listing/png/` holds a working set built from the same captures (5 screenshots, both
tiles, correct sizes, 24-bit, no alpha) — usable as-is for submission, or as a reference for the
Claude Design pass.
