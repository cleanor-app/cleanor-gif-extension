# How do I reduce GIF file size?

**Drop the GIF into a compressor that rewrites it with inter-frame deltas, then cut whichever of the three things costs the most bytes: pixels, frames, or colors.** With the [Cleanor GIF Toolkit](../README.md) Chrome extension, the default render already shrinks most GIFs without changing a single visible thing (same dimensions, same frame count, same palette size, same timing), and three dials take it further while the exact output size updates live.

## Why a GIF is big in the first place

A GIF stores an animation as a stack of full images. Its only real compression is LZW over each frame plus an optional trick where a frame only stores the pixels that changed since the last one. Most online "GIF compressors" decode your file and write every frame back out in full, which throws that trick away, and the result is frequently **bigger** than what you started with.

So the file size is driven by three multipliers:

- **Pixels per frame** (width × height)
- **Number of frames**
- **How much of each frame is new** (a still background compresses to almost nothing, a full-motion clip does not)

Everything below attacks one of those three.

## Step by step, in the extension

1. Install [GIF Toolkit](https://chromewebstore.google.com/detail/gif-toolkit-reverse-optim/fdfeajbfkhepkdppeiccbjghgkpbpobl) and open it from the toolbar, or press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd>. You can also right-click a GIF on any page and choose "Open this GIF in Cleanor GIF Toolkit".
2. Drop the GIF into the popup. It is decoded and re-encoded on your device, so nothing is uploaded.
3. **Read the result before you touch anything.** The stats line shows the original size, the new size, and the saving as a percentage. On a GIF with a background that stays put, the default pass alone is often half the file.
4. If that is not enough, turn the dials in this order:

   **Size (20% to 100%).** The bluntest and most effective control. Halving the dimensions removes three quarters of the pixels. If the GIF is going into a chat window or a README, it is almost certainly wider than it needs to be.

   **Frames (all, every 2nd, every 3rd).** Drops frames and merges the dropped frames' delay into the frame that stays, so the animation still plays at the speed you expect instead of quietly running fast. Cheap on a 25 fps screen recording, visible on a short snappy loop.

   **Colors (256, 128, 64, 32).** One palette is built for the whole animation, so a smaller palette shrinks every frame at once. 64 is usually invisible on photographic content; 32 will start to band flat gradients.

5. **Trim** with the two-handle range if part of the clip is dead air. Fewer frames is fewer frames, and cutting the three seconds before the action starts costs you nothing.
6. Press **Download GIF**. The file saves as `<name>-optimized-cleanor.gif`.

## What the numbers actually look like

Measured by running the extension in Chrome over real files, including two ordinary meme GIFs from Giphy:

| Source GIF | Size | Default | 64 colors | ½ frames | 64 colors + ½ frames + 60% size |
| --- | --- | --- | --- | --- | --- |
| Meme GIF (dog reaction, 480×406, 28 frames) | 1 233 KB | 966 KB (−22%) | 847 KB (−31%) | 619 KB (−50%) | **190 KB (−85%)** |
| Meme GIF (husky puppies, 426×426, 125 frames) | 8 641 KB | 4 345 KB (−50%) | 4 123 KB (−52%) | 2 634 KB (−70%) | **723 KB (−92%)** |
| Moving subject, steady background | 487 KB | 128 KB (−74%) | 97 KB (−80%) | 73 KB (−85%) | **28 KB (−94%)** |
| Simple animation, flat background | 177 KB | 29 KB (−84%) | 27 KB (−85%) | 19 KB (−89%) | **9 KB (−95%)** |

## If the GIF barely shrinks

That is information, not a bug. It means the frames share very little: a full-motion clip, a hard cut every few frames, or a file that was already tightly packed. The popup says so and points at the controls that help. In that situation, scale it down and thin the frames, and accept that a genuinely busy animation is simply expensive as a GIF. If the destination allows video, [GIF to MP4](https://cleanor.app/tools/gif-to-mp4) will beat any GIF encoder by an order of magnitude.

## Related

- [Compress a GIF for Discord](compress-a-gif-for-discord.md), hitting a specific target size
- [GIF vs animated WebP](gif-vs-animated-webp.md)
- Free web versions, no install: [GIF optimizer](https://cleanor.app/tools/gif-optimizer) · [GIF resizer](https://cleanor.app/tools/gif-resizer) · [Trim & split GIF](https://cleanor.app/tools/trim-split-gif)
- Back to the [README](../README.md)
