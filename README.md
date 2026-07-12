<div align="center">

<img src="icons/icon-128.png" width="88" height="88" alt="Cleanor GIF Toolkit icon">

# GIF Toolkit — reverse, compress, trim, speed up & resize animated GIFs

**A free Chrome extension that edits animated GIFs entirely on your own device.**
No upload. No account. No tracking. No ffmpeg download.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/manifest-v3-34a853.svg)](manifest.json)
[![100% local](https://img.shields.io/badge/processing-100%25%20local-12b886.svg)](#privacy--permissions)
[![Web tools](https://img.shields.io/badge/web%20version-cleanor.app-4576fd.svg)](https://cleanor.app/tools/reverse-gif)

<img src="store-listing/png/screenshot-1.png" width="760" alt="GIF Toolkit popup: a 487 KB GIF optimized to 243 KB with live preview">

</div>

---

## What it does

| | |
| --- | --- |
| 🔄 **[Reverse a GIF](#reverse-a-gif)** | Play any animation backwards with one switch. |
| 🗜️ **[Compress / optimize a GIF](#compress-or-optimize-a-gif)** | Real inter-frame delta encoding — not a re-save that makes the file *bigger*. |
| ✂️ **[Trim a GIF](#trim-a-gif)** | Drag a two-handle range and keep only the frames you want. |
| ⏩ **[Change GIF speed](#change-gif-speed)** | Retime from 0.25× to 4×. |
| 📐 **[Resize a GIF](#resize-a-gif)** | Scale to 20–100% of the original dimensions. |
| 🎨 **[Palette, frame rate, loop](#palette-frame-rate-and-loop)** | 256 → 32 colors, keep every 2nd/3rd frame, loop forever / once / 3×. |
| 🖱️ **[Right-click a GIF on any page](#right-click-a-gif-on-any-page)** | Edit it without saving the file first. |
| 🔀 **[APNG → GIF, animated WebP → GIF](#convert-apng-and-animated-webp-to-gif)** | Frame-for-frame, transparency intact. |

Everything runs in your browser. The GIF you drop in never leaves your machine — there is no
server to send it to.

---

## Why another GIF optimizer?

Most browser-based "GIF compressors" decode your animation and write every frame back out in
full. A GIF written that way is often **larger than the one you started with**, because the
original was already frame-optimized and your "optimizer" threw that optimization away.

Cleanor writes real **inter-frame deltas**. When a pixel is identical to the pixel in the
previous frame, it is not stored again — it is written as the transparent index, with GIF
disposal method 1 ("leave the previous pixels in place"). Long runs of that one index compress
far better under LZW, which is exactly what the GIF format was built to exploit.

The honest catch, stated up front: **how much you save depends entirely on your GIF.** A clip
where a subject moves over a background that stays put — the overwhelming majority of memes,
reactions, product demos and screen recordings — is full of repeated pixels and shrinks a lot.
A full-motion clip where every pixel changes in every frame has no repetition to exploit and
will barely shrink at all. The popup tells you so instead of pretending otherwise, and points
you at the settings that *do* help (fewer colors, fewer frames, smaller size).

### Measured results

Real numbers, produced by driving the actual extension in Chrome 150 — not estimates:

| Source GIF | Size | Default | 64 colors | ½ frames | 64 colors + ½ frames + 60% size |
| --- | --- | --- | --- | --- | --- |
| Moving subject, steady background *(the common case)* | 487 KB | **243 KB** (−50%) | **194 KB** (−60%) | **134 KB** (−72%) | **61 KB** (−88%) |
| Simple animation, flat background | 177 KB | **55 KB** (−69%) | **49 KB** (−73%) | **37 KB** (−79%) | **20 KB** (−89%) |
| Full motion — every pixel changes each frame | 2 132 KB | **1 994 KB** (−6%) | **1 445 KB** (−32%) | **1 230 KB** (−42%) | **288 KB** (−86%) |
| Transparent background *(alpha preserved)* | 81 KB | **50 KB** (−38%) | **46 KB** (−43%) | **25 KB** (−69%) | **12 KB** (−85%) |

The default settings change nothing about how your GIF looks: same dimensions, same frame
count, same palette size, same timing. The saving comes purely from not storing pixels twice.

---

## Install

**Chrome Web Store:** *pending review — link goes here once published.*

**From source (developer mode):**

```bash
git clone https://github.com/cleanor-app/cleanor-gif-extension.git
# chrome://extensions → enable "Developer mode" → "Load unpacked" → pick the folder
```

Open it from the toolbar, or press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd>.

---

## Features in detail

### Reverse a GIF

Flip the switch and the animation plays backwards. Useful for turning a clip into a loop that
runs forward and back, undoing a direction that reads wrong, or landing a joke on the return
stroke. Frame timings are carried with their frames, so a reversed GIF keeps its rhythm.

### Compress or optimize a GIF

Drop the file in and it is already optimized at the default settings — see the table above.
Three dials take it further, and the exact output size updates as you turn them:

- **Colors** — 256 (best) → 128 → 64 (small) → 32 (tiny). Each frame is quantized with its own
  palette, so a smaller palette costs less than you would expect.
- **Frames** — keep all, every 2nd, or every 3rd. **The dropped frames' delays are merged into
  the frames that remain**, so a lighter GIF still plays at the speed you expect instead of
  quietly running fast. (Plenty of tools get this wrong.)
- **Size** — scale down; fewer pixels is always the bluntest, most effective saving.

### Trim a GIF

<img src="store-listing/popup-shots/04-trim.png" width="330" align="right" alt="Trim control: frames 6–18 of 30">

Drag the two handles to keep a range of frames. Cut the dead air before the action starts, stop
before the watermark at the end, or pull a single reaction out of a long clip. The handles
cannot cross, the frame count and file size update live, and the range is frame-exact — trimming
6–18 of 30 gives you exactly 13 frames.

Need to *split* a GIF into several files, or crop it to a region? Those live on the web version:
**[trim & split](https://cleanor.app/tools/trim-split-gif)** ·
**[crop](https://cleanor.app/tools/gif-cropper)**.

<br clear="right">

### Change GIF speed

0.25× to 4×, applied by retiming every frame delay (with the 20 ms floor that browsers enforce
on GIF playback). At 2× a 80 ms frame becomes 40 ms; at 0.5× it becomes 160 ms.

### Resize a GIF

Scale to anywhere from 20% to 100% of the source dimensions, with high-quality smoothing.

### Palette, frame rate and loop

Cap the palette, thin the frames, and set the loop count — forever, once, or three times. The
loop control is written into the GIF the proper way (the NETSCAPE application extension), so it
is honoured by browsers, Slack, Discord and Telegram alike. A source GIF's own loop setting is
detected and preselected.

### Right-click a GIF on any page

<img src="store-listing/popup-shots/06-incoming.png" width="330" align="right" alt="Confirmation banner before pulling a GIF from a page">

Right-click a GIF you see anywhere on the web and choose **"Open this GIF in Cleanor GIF
Toolkit"**. It opens in a tab, asks you to confirm, and loads the image — no saving the file to
disk first.

Access to that one website is requested **at that moment, for that origin only**. The extension
holds no host permissions up front, and it never touches a page's `<video>` element or media
streams — only an image you explicitly point at.

<br clear="right">

### Convert APNG and animated WebP to GIF

Drop an **APNG** or an **animated WebP** (or even a still PNG/JPEG) and it comes out as a GIF,
frame for frame. **Transparency survives**: alpha-carrying animations are written with a real
transparent index and disposal method 2, instead of coming back with black boxes where the
transparency used to be — a failure mode you will recognise from a lot of online converters.

---

## How it works

No ffmpeg.wasm, no 25 MB WebAssembly payload, no remote code — the whole extension is **26 KB
zipped**.

1. **Decode** — the browser's native [`ImageDecoder`](https://developer.mozilla.org/en-US/docs/Web/API/ImageDecoder)
   API pulls out every frame (Chrome decodes animated GIF, APNG and animated WebP natively).
2. **Transform** — trim → reverse → thin → retime → resize, as plain operations on an array of
   `{ rgba, delayMs }` frames.
3. **Encode** — [gifenc](https://github.com/mattdesl/gifenc) (a small, dependency-free JS
   encoder) writes the GIF, with the delta/transparency strategy described above.

All of it happens in a **Web Worker**, so dragging a slider never freezes the popup, and only
the newest render is ever shown (stale results from an abandoned drag are discarded).

```
popup.html · popup.css · app.js   UI only — controls, live preview, download
worker.js                         decode / transform / encode, off the main thread
gif-core.js                       the pipeline; the only file that touches gifenc
background.js                     right-click menu, install & uninstall hooks
vendor/gifenc/                    the bundled encoder (9 KB)
```

### Verification

The extension is driven end-to-end in a real Chrome over CDP: **58 behavioural checks** covering
every control, and asserting on the *decoded output pixels*, not just the UI — that reverse
really reverses (frame 0 of the output matches the last frame of the source), that trimming is
frame-exact, that frame delays are retimed, that Download lands a valid `GIF89a` on disk, that a
corrupt file produces a clean error, and that transparency survives the round-trip.

---

## Privacy & permissions

| Permission | Why it is needed |
| --- | --- |
| `contextMenus` | Adds the "Open this GIF in Cleanor GIF Toolkit" right-click item. That is all. |
| Host access (**optional**) | Requested only for the one site whose GIF you right-click, only when you confirm. Used solely to fetch that single image. |

There is **no** `storage`, **no** `downloads`, **no** `scripting`, **no** analytics, and no host
access by default. Nothing is uploaded, nothing is logged, and no data leaves your device — the
extension has no server to send it to.

---

## FAQ

**Does my GIF get uploaded anywhere?**
No. Decoding, editing and encoding all happen in your browser. The extension makes no network
requests at all, except when you explicitly right-click an image on a page and confirm.

**Why did my GIF barely shrink?**
Because every frame differs from the last — a full-motion clip has no repeated pixels to skip.
The popup says so and points you at the controls that help: fewer colors, ½ frames, smaller
size. See the [measured results](#measured-results).

**Why is my optimized GIF *bigger* in some other tool?**
Because that tool re-saved every frame in full and threw away the original's frame optimization.
That is the exact problem this extension was built to fix.

**Does transparency survive?**
Yes — alpha animations get a real transparent index and disposal 2. No black boxes.

**How large a GIF can it handle?**
Frames are held in memory as raw RGBA, so there is a ceiling (roughly 60 megapixels total —
e.g. 500×500 × 240 frames). Beyond that the popup tells you plainly and points at the web tool
instead of hanging.

**Can it convert a GIF to MP4, or crop one?**
Not in the extension — those need a real video encoder. They are free on the web version:
**[GIF → MP4](https://cleanor.app/tools/gif-to-mp4)** · **[crop](https://cleanor.app/tools/gif-cropper)**.

**Does it work in Edge / Brave / Opera?**
It is a standard MV3 extension and relies on `ImageDecoder`, which all Chromium browsers ship.
Loading it unpacked works in any of them.

---

## Develop

```bash
./pack-crx.sh --zip-only     # → cleanor-gif-extension.zip, ready for the Web Store
```

The extension is plain ES modules — no build step, no bundler, no dependencies to install.

---

## Free GIF tools on the web

Same engine, no install, plus the heavier operations the popup deliberately leaves out:

[Reverse GIF](https://cleanor.app/tools/reverse-gif) ·
[GIF optimizer](https://cleanor.app/tools/gif-optimizer) ·
[GIF speed changer](https://cleanor.app/tools/gif-speed-changer) ·
[GIF resizer](https://cleanor.app/tools/gif-resizer) ·
[GIF cropper](https://cleanor.app/tools/gif-cropper) ·
[Trim & split GIF](https://cleanor.app/tools/trim-split-gif) ·
[GIF → MP4](https://cleanor.app/tools/gif-to-mp4) ·
[Video → GIF](https://cleanor.app/tools/video-to-gif) ·
[WebP → GIF](https://cleanor.app/tools/webp-to-gif) ·
[GIF frame extractor](https://cleanor.app/tools/gif-frame-extractor)

More privacy-first, on-device tools at **[cleanor.app](https://cleanor.app)**.

## Related extensions

- **[Cleanor Image Optimizer](https://chromewebstore.google.com/detail/dfclfjboflnefohkjpkjnffpdoelbakk)** — compress & convert images (HEIC, AVIF, WebP, PDF), screenshots, save every image on a page.
- **Cleanor QR Code Generator** — QR for the current page, Wi-Fi, contact, event and more.

---

MIT © [Cleanor](https://cleanor.app)
