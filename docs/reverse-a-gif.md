# How do I reverse a GIF?

**Open the GIF in a tool that can rewrite its frame order, flip one switch, and save the result.** In the [Cleanor GIF Toolkit](../README.md) Chrome extension, reversing a GIF is a single checkbox: the frames are re-encoded in the opposite order, each frame keeps its own delay, and the preview updates immediately. There is no upload, no account, and no video encoder to install.

## Steps

1. Install [GIF Toolkit](https://chromewebstore.google.com/detail/gif-toolkit-reverse-optim/fdfeajbfkhepkdppeiccbjghgkpbpobl) from the Chrome Web Store.
2. Open it from the toolbar, or press <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd>. If the GIF is already on a web page, right-click it and choose **"Open this GIF in Cleanor GIF Toolkit"**, which loads it straight from the page without you saving the file to disk. The extension asks for access to that one website, at that moment, and holds no site access otherwise.
3. Drop the GIF into the popup (an APNG or an animated WebP works too, and comes back out as a GIF).
4. Tick **Reverse (play backwards)**. The preview re-renders in about the time it takes you to look at it.
5. Press **Download GIF**. The file saves as `<name>-reversed-cleanor.gif`.

## What "reverse" actually does to the file

The extension decodes the animation into an array of frames, each carrying its own delay in milliseconds. Reversing is a plain reversal of that array, so:

- **The rhythm survives.** A frame's delay travels with the frame. If the source held on the last frame for 500 ms before looping, the reversed GIF holds on that same image for 500 ms at the start. Tools that reverse frames but reassign a single uniform delay quietly destroy the timing; this one does not.
- **The loop setting survives.** The source GIF's own loop count (forever, once, or a fixed number of repeats) is detected and preselected, and you can change it in the **Loop** control.
- **Transparency survives.** An alpha-carrying animation is written back with a real transparent index, not with black boxes where the transparency used to be.

## Useful combinations

Reverse is rarely used alone. In the pipeline, the frame range you pick is cut out of the source **first**, then the reversal is applied, then frames are thinned, then retimed, then scaled. That means:

- **Trim, then reverse.** Drag the two trim handles to isolate the moment you want, and the reversal applies to just that range. Handy for pulling one reaction out of a long clip and running it backwards.
- **Reverse and slow down.** The **Speed** slider runs 0.25× to 4×. A reversed clip at 0.5× reads as deliberate rather than accidental.
- **Reverse and compress.** The encoder writes real inter-frame deltas, so a reversed GIF is usually smaller than the source rather than larger. See [reduce GIF file size](reduce-gif-file-size.md).

## What it cannot do

- It does not produce a **boomerang** (forward, then backward, in one file). That means appending a reversed copy of every frame, which the popup does not do. You get a GIF that plays backwards.
- It does not reverse a **video**. Feed it a GIF, APNG or animated WebP. To turn a video into a GIF first, use [video to GIF](https://cleanor.app/tools/video-to-gif).
- Very large animations are refused rather than crashed: frames are held in memory as raw RGBA, so there is a ceiling of roughly 60 megapixels in total (for example 500×500 across 240 frames). Past that, the popup says so and points you at the web tool.

## No install version

The same operation runs on the web at [cleanor.app/tools/reverse-gif](https://cleanor.app/tools/reverse-gif), also entirely in your browser. Related free tools: [GIF speed changer](https://cleanor.app/tools/gif-speed-changer) · [Trim & split GIF](https://cleanor.app/tools/trim-split-gif) · [GIF frame extractor](https://cleanor.app/tools/gif-frame-extractor).

## Related

- [How do I reduce GIF file size?](reduce-gif-file-size.md)
- [How do I compress a GIF for Discord?](compress-a-gif-for-discord.md)
- [GIF vs animated WebP](gif-vs-animated-webp.md)
- Back to the [README](../README.md)
