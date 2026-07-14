# How do I compress a GIF for Discord?

**Shrink the GIF until the "after" number sits under the upload limit Discord shows you, and get there by cutting size first, then frames, then colors.** The [Cleanor GIF Toolkit](../README.md) Chrome extension shows the exact output file size while you drag the controls, so you can aim at a target instead of exporting, uploading, failing, and guessing again.

## Know the number you are aiming at

Discord's free upload limit has changed more than once, and Discord has also run experiments where some accounts get a different cap. At the time of writing it is 10 MB per file on a free account, with higher limits on Nitro Basic and Nitro. Rather than trust any article about it (this one included), do one of two things:

- Try the upload once and read the limit Discord states in the rejection message, or
- Aim comfortably under it. A GIF that lands at 6 to 8 MB will pass a 10 MB limit and still be there if the cap moves.

The workflow below is the same whatever the number is, and it works just as well for a 1 MB email attachment, a 2 MB Slack post, or a README that has to load quickly.

## Hit a target size

1. Open GIF Toolkit from the toolbar (or <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>G</kbd>) and drop the GIF in. If the GIF is on a page, right-click it and choose "Open this GIF in Cleanor GIF Toolkit" instead of saving it first.
2. Look at the stats line: `original → new` plus the saving as a percentage. The default pass is lossless in the sense that nothing about the animation changes, it is just encoded properly, and on a clip with a background that stays put it is often already half the size.
3. Still over target? Pull the levers in this order and watch the number.

   **Size.** Scale from 100% down to as low as 20%. This is the biggest single win: 60% of the original dimensions removes about two thirds of the pixels. Discord scales a GIF into the chat column anyway, so a 900 px wide reaction GIF is mostly wasted bytes.

   **Frames.** Keep every 2nd or every 3rd frame. The dropped frames' delays are merged into the frames that remain, so the animation plays at the right speed rather than running fast, which is the bug you get from most frame-dropping tools.

   **Colors.** 256 → 128 → 64 → 32. One palette is built for the whole animation, so this shrinks every frame at once. 64 colors is usually invisible on a reaction clip.

   **Trim.** Drag the two handles to cut the run-up and the tail. A reaction is rarely more than a second and a half of the source.

4. When the number is under target, press **Download GIF**, then drag the file into Discord.

## A worked example

An 8.6 MB, 125-frame meme GIF (426×426), measured with the actual extension:

| Settings | Result |
| --- | --- |
| Default (nothing changed) | 4 345 KB (−50%) |
| 64 colors | 4 123 KB (−52%) |
| ½ frames | 2 634 KB (−70%) |
| 64 colors + ½ frames + 60% size | **723 KB (−92%)** |

So a file that a free Discord account would reject outright comes back at well under a megabyte, and the middle settings give you plenty of room to stop earlier if you want it to look better.

## If you cannot get it small enough

Some GIFs have nothing to give: a full-motion clip where every pixel changes in every frame has no repetition between frames to exploit, and the popup will tell you so instead of showing a disappointing number and leaving you to guess. In that case:

- Trim harder. Length is the one thing that always works.
- Post it as a video. Discord plays MP4 inline, and an MP4 of the same clip is typically a fraction of the GIF. Convert with [GIF to MP4](https://cleanor.app/tools/gif-to-mp4).

Everything above happens on your own device. The extension has no server to upload to, no account, and no analytics.

## Related

- [How do I reduce GIF file size?](reduce-gif-file-size.md)
- [How do I reverse a GIF?](reverse-a-gif.md)
- Free web versions: [GIF optimizer](https://cleanor.app/tools/gif-optimizer) · [GIF resizer](https://cleanor.app/tools/gif-resizer) · [GIF to MP4](https://cleanor.app/tools/gif-to-mp4)
- Back to the [README](../README.md)
