# Cleanor GIF Toolkit — Chrome extension

**Reverse, optimize, trim, speed up and resize animated GIFs — right in your toolbar.** Everything runs locally in your browser: **nothing is uploaded, no account, no tracking.**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/manifest-v3-34a853.svg)](manifest.json)
[![Try on the web](https://img.shields.io/badge/or%20use%20it%20online-cleanor.app%2Ftools-0a7cff.svg)](https://cleanor.app/tools/reverse-gif)

> 🔒 A privacy-first companion to the free tools at **[cleanor.app/tools](https://cleanor.app/tools)**. Same GIF engine, in your toolbar.

## Features

- **Reverse** — play any GIF backwards.
- **Optimize** — the encoder writes inter-frame deltas (unchanged pixels become the transparent index, disposal 1). How much that saves depends on the GIF: a moving subject over a steady background (memes, reactions, screen recordings) typically drops **50–80%** with no visible loss, while a full-motion clip where every pixel changes each frame saves little — for those, cap the palette, drop every 2nd frame, or scale down.
- **Trim** — drag a two-handle range to keep only the frames you want.
- **Speed** — 0.25× to 4×, retiming every frame delay.
- **Resize** — 20–100% of the original size.
- **Colors / frame rate / loop** — cap the palette (256 → 32), keep every 2nd or 3rd frame (dropped frames' time is merged into the kept ones, so the animation doesn't silently speed up), and set the loop to forever / once / 3×.
- **Right-click any GIF on a page** → "Open this GIF in Cleanor GIF Toolkit". Access to that one site is requested at that moment, never held up front.
- **Also reads APNG and animated WebP** (and a still image), always writing a GIF.
- **Transparency survives** — alpha-carrying animations are encoded with a real transparent index and disposal 2, instead of coming back with black edges.
- **100% local** — decoding, transforming and encoding all happen on your device.

## How it works

Frames are decoded with the browser's native **`ImageDecoder`** (Chrome decodes animated
GIF / APNG / animated WebP), transformed as a plain array, and re-encoded with the bundled
pure-JS **[gifenc](https://github.com/mattdesl/gifenc)** encoder — **no ffmpeg.wasm, no 25 MB
of WebAssembly, no remote code**. Everything after the decode happens in a **Web Worker**
(`worker.js`), so dragging a slider never freezes the popup.

```
popup.html / app.js   UI only — controls, preview, download
worker.js             decode → trim → reverse → thin → retime → resize → encode
gif-core.js           the pipeline itself (also the only file that touches gifenc)
background.js         right-click menu + install/uninstall funnel
```

## Permissions

| Permission | Why |
| --- | --- |
| `contextMenus` | the "Open this GIF in Cleanor GIF Toolkit" right-click item |
| `<all_urls>` (**optional**) | only requested — for that one origin — when you right-click a GIF and confirm |

No `storage`, no `downloads`, no host access by default. The extension never touches a page's
`<video>` or media streams; it only ever reads an image you explicitly hand it.

## Develop

```bash
# load it unpacked
open -a "Google Chrome" --args --load-extension="$PWD"   # or chrome://extensions → Load unpacked

./pack-crx.sh --zip-only     # build cleanor-gif-extension.zip for the Web Store
```

## Web version

Prefer a full page — or need crop, split, or GIF → MP4? Those live on the site:
[reverse](https://cleanor.app/tools/reverse-gif) ·
[optimize](https://cleanor.app/tools/gif-optimizer) ·
[speed](https://cleanor.app/tools/gif-speed-changer) ·
[resize](https://cleanor.app/tools/gif-resizer) ·
[crop](https://cleanor.app/tools/gif-cropper) ·
[trim & split](https://cleanor.app/tools/trim-split-gif) ·
[GIF → MP4](https://cleanor.app/tools/gif-to-mp4)

MIT © Cleanor
