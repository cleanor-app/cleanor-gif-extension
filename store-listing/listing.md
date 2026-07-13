# Chrome Web Store: listing copy & submission checklist

New item (first publish). Upload the plain **`cleanor-gif-extension.zip`** (Verified CRX Uploads
is not enabled yet; enable it after the first release if desired, see the image extension's
SIGNING.md).

> **House style:** no em dashes anywhere in the store copy or the manifest. Use a comma, a colon,
> a semicolon, or a full stop instead. Same rule for every Cleanor extension.

## Basics

- **Name (from manifest):** GIF Toolkit: Reverse, Optimize, Speed & Convert
- **Summary (≤132):** Reverse, optimize, trim, speed up and resize animated GIFs. Reads APNG & WebP too. On your device, nothing uploaded.
- **Category:** Productivity
- **Language:** English

## Detailed description

Cleanor GIF Toolkit is a fast, private GIF editor that lives in your browser toolbar. Drop in a GIF, or right-click one you found on a page, then reverse it, shrink it, trim it, slow it down or speed it up, and save the result. Every frame is decoded, changed and re-encoded on your own device. Nothing is uploaded, there is no account to create, and there is no tracking.

MAKE GIFS SMALLER, PROPERLY

Most "GIF optimizers" simply re-save the file, and a re-saved GIF is often bigger than the one you started with. Cleanor writes real inter-frame deltas: pixels that do not change from one frame to the next are not stored again. For the kind of GIF people actually share, meaning a moving subject over a background that stays put, a reaction clip, a screen recording, that usually means half the size or better at the default settings, with nothing visibly lost. A full-motion clip where every pixel changes in every frame has no repetition to exploit and will save little; the popup says so plainly rather than pretending. For those, cap the palette (256, 128, 64 or 32 colors), keep every second or third frame, or scale the whole thing down. The preview and the exact file size update as you drag.

When frames are dropped, their time is merged into the frames that stay, so a lighter GIF still plays at the speed you expect instead of quietly running fast.

REVERSE

One switch plays the animation backwards. It is the fastest way to turn a clip into a loop that runs forward and back, to undo an unfortunate direction, or to make the joke land.

TRIM

Drag the two handles to keep only the frames you want. Cut the dead air at the start, stop before the logo at the end, or pull a single reaction out of a long clip.

SPEED AND SIZE

Retime an animation anywhere from 0.25x to 4x, and scale it from 20% to 100% of its original dimensions. Both are the usual fix for a GIF that is too heavy to attach or too slow to hold attention.

RIGHT-CLICK A GIF ON ANY PAGE

You do not have to save a file first. Right-click a GIF you see on a page and choose "Open this GIF in Cleanor GIF Toolkit". It opens in a tab, ready to edit. Access to that one website is requested at that moment, and only then. The extension does not ask for permission to read sites up front, and it never touches videos or media streams, only an image you point at.

APNG AND ANIMATED WEBP TOO

Drop an APNG or an animated WebP and it is converted, frame for frame, into a GIF you can post anywhere. Transparency survives: alpha-carrying animations are written with a real transparent index, instead of coming back with black boxes around the edges.

PRIVATE BY DESIGN

Frames are decoded with the browser's own image decoder and re-encoded with a small, bundled JavaScript encoder. No servers, no uploads, no remote code, no giant WebAssembly download. The extension asks for one permission (the right-click menu) and nothing else.

Need to crop a GIF, split it into pieces, or convert it to MP4? Those live on the free web tools at cleanor.app, one click from the popup.

## Privacy

- **Single purpose:** edit animated images (GIF, APNG, animated WebP) that the user provides, entirely on the user's device.
- **Permission `contextMenus`:** adds the "Open this GIF in Cleanor GIF Toolkit" right-click item.
- **Permission, optional host access (`<all_urls>`):** requested only for the specific site whose GIF the user right-clicks, at the moment they confirm. Used solely to fetch that one image.
- **Remote code:** none. All logic is bundled in the package.
- **Data collected:** none. Nothing leaves the device.

## Graphics

| Asset | Size | File |
| --- | --- | --- |
| Icon | 128×128 | `icons/icon-128.png` |
| Screenshots (5) | 1280×800 | `png/screenshot-1..5.png` |
| Small promo tile | 440×280 | `png/small-promo-440x280.png` |
| Marquee tile | 1400×560 | `png/marquee-1400x560.png` |

All store PNGs are 24-bit, **no alpha channel** (the Web Store rejects transparency).

## Submission checklist

- [ ] `./pack-crx.sh --zip-only` → `cleanor-gif-extension.zip`
- [ ] Upload zip, paste name / summary / description above
- [ ] Upload 5 screenshots + both promo tiles
- [ ] Category: Productivity · Language: English
- [ ] Privacy tab: single purpose + justification for `contextMenus` and optional host access (text above)
- [ ] "No, I am not selling user data" · no analytics in the extension
- [ ] Promo video (YouTube, unlisted), optional, add if produced
