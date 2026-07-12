'use strict';

// GIF toolkit core — 100% local, no ffmpeg, no network.
// Decode animated frames with the browser's native ImageDecoder (Chrome decodes
// animated GIF / APNG / animated WebP), transform the frame array, and re-encode
// to an animated GIF with the bundled pure-JS encoder (gifenc).
import { GIFEncoder, quantize, applyPalette } from './vendor/gifenc/gifenc.esm.js';

// Decoded frames are kept as raw RGBA, so a huge source can blow up memory
// (w * h * 4 bytes per frame). Refuse politely instead of crashing the popup.
const MAX_PIXELS = 60e6; // ~240 MB of RGBA — e.g. 500×500 × 240 frames.

// Loop counts follow the GIF/gifenc convention: 0 = forever, -1 = play once,
// n > 0 = repeat n times.
export const LOOP_FOREVER = 0;
export const LOOP_ONCE = -1;

// ---- decode -----------------------------------------------------------------
// Returns { width, height, loop, frames: [{ rgba: Uint8ClampedArray, delayMs }] }.
export async function decodeAnimated(file) {
  if (typeof ImageDecoder === 'undefined') {
    throw new Error('This browser cannot decode animated images (no ImageDecoder).');
  }
  const buf = await file.arrayBuffer();
  const type = file.type || sniffType(new Uint8Array(buf));
  const decoder = new ImageDecoder({ data: buf, type });
  let track;
  try {
    await decoder.tracks.ready;
    track = decoder.tracks.selectedTrack;
  } catch {
    // The decoder's own message ("Failed to retrieve track metadata") means nothing to a user.
    throw new Error("Couldn't read this file. Try a GIF, APNG, or animated WebP.");
  }
  const count = track.frameCount || 1;

  const frames = [];
  let width = 0;
  let height = 0;
  let canvas = null;
  let ctx = null;
  for (let i = 0; i < count; i++) {
    const { image } = await decoder.decode({ frameIndex: i });
    if (!canvas) {
      width = image.displayWidth;
      height = image.displayHeight;
      if (width * height * count > MAX_PIXELS) {
        image.close();
        decoder.close();
        throw new Error('This animation is too large for the popup. Use the full tool on cleanor.app.');
      }
      canvas = new OffscreenCanvas(width, height);
      ctx = canvas.getContext('2d', { willReadFrequently: true });
    }
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0);
    frames.push({
      rgba: ctx.getImageData(0, 0, width, height).data,
      // VideoFrame.duration is microseconds; GIF delays are milliseconds.
      delayMs: image.duration ? Math.max(20, Math.round(image.duration / 1000)) : 100,
    });
    image.close();
  }
  decoder.close();
  if (!frames.length) throw new Error('No frames found in this file.');
  // Scanned once here, not per render — it decides the whole encoding strategy.
  return { width, height, loop: sourceLoop(track.repetitionCount), frames, alpha: hasAlpha(frames) };
}

// ImageDecoder counts *repeats* (0 = play once, Infinity = endless); gifenc
// counts loops the GIF way (0 = endless, -1 = play once).
function sourceLoop(repetitionCount) {
  if (repetitionCount === Infinity) return LOOP_FOREVER;
  if (!repetitionCount) return LOOP_ONCE;
  return repetitionCount;
}

function sniffType(bytes) {
  if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) return 'image/gif';
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e) return 'image/png'; // APNG
  if (bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42) return 'image/webp';
  return 'image/gif';
}

// ---- transforms (pure array ops on {rgba, delayMs}) -------------------------
export function reverse(frames) {
  return frames.slice().reverse();
}

// factor > 1 = faster (shorter delays), < 1 = slower.
export function changeSpeed(frames, factor) {
  const f = Math.max(0.1, Number(factor) || 1);
  if (f === 1) return frames;
  return frames.map((fr) => ({ rgba: fr.rgba, delayMs: Math.max(20, Math.round(fr.delayMs / f)) }));
}

// Keep every Nth frame to shrink size / lower fps (keep >= 2 frames).
export function reduceFrames(frames, keepEvery) {
  const k = Math.max(1, Math.round(keepEvery) || 1);
  if (k === 1) return frames;
  const out = [];
  for (let i = 0; i < frames.length; i += k) {
    // merge the dropped frames' delay into the kept one, so timing is preserved
    let delay = frames[i].delayMs;
    for (let j = 1; j < k && i + j < frames.length; j++) delay += frames[i + j].delayMs;
    out.push({ rgba: frames[i].rgba, delayMs: delay });
  }
  return out.length >= 2 ? out : frames;
}

// Keep frames [start, end] (1-based, inclusive).
export function trimFrames(frames, start, end) {
  const a = Math.max(1, Math.min(Math.round(start) || 1, frames.length));
  const b = Math.max(a, Math.min(Math.round(end) || frames.length, frames.length));
  return a === 1 && b === frames.length ? frames : frames.slice(a - 1, b);
}

// Scale every frame to `scale` (0..1) of the source size.
export function resizeFrames(frames, srcW, srcH, scale) {
  const s = Math.min(1, Math.max(0.05, Number(scale) || 1));
  if (s >= 0.999) return { frames, width: srcW, height: srcH };
  const w = Math.max(1, Math.round(srcW * s));
  const h = Math.max(1, Math.round(srcH * s));
  const src = new OffscreenCanvas(srcW, srcH);
  const sctx = src.getContext('2d');
  const dst = new OffscreenCanvas(w, h);
  const dctx = dst.getContext('2d', { willReadFrequently: true });
  dctx.imageSmoothingQuality = 'high';
  const out = frames.map((fr) => {
    sctx.putImageData(new ImageData(new Uint8ClampedArray(fr.rgba), srcW, srcH), 0, 0);
    dctx.clearRect(0, 0, w, h);
    dctx.drawImage(src, 0, 0, w, h);
    return { rgba: dctx.getImageData(0, 0, w, h).data, delayMs: fr.delayMs };
  });
  return { frames: out, width: w, height: h };
}

// ---- pipeline ---------------------------------------------------------------
// opts: { trimStart, trimEnd, reverse, speed, keepEvery, scale }
// Order matters: cut the range the user picked out of the *source*, then reverse it,
// then thin the frames, then retime, then scale.
export function applyOps(src, opts = {}) {
  let frames = src.frames;
  if (opts.trimStart > 1 || (opts.trimEnd && opts.trimEnd < frames.length)) {
    frames = trimFrames(frames, opts.trimStart || 1, opts.trimEnd || frames.length);
  }
  if (opts.reverse) frames = reverse(frames);
  if (opts.keepEvery > 1) frames = reduceFrames(frames, opts.keepEvery);
  if (opts.speed && opts.speed !== 1) frames = changeSpeed(frames, opts.speed);
  return resizeFrames(frames, src.width, src.height, opts.scale ?? 1);
}

// ---- encode -----------------------------------------------------------------
// opts: { maxColors=256, loop=0 }. Lower maxColors => smaller file.
//
// Two encoding modes, picked per animation:
//  - Source has real transparency: every frame carries its own transparent index
//    and disposal 2 (restore to background), so alpha survives the round-trip.
//  - Fully opaque source: inter-frame delta — pixels identical to the previous
//    frame are written as the transparent index with disposal 1 (leave in place),
//    which is what makes the re-encoded GIF smaller than the original instead of
//    bigger. Long runs of one index compress far better under LZW.
export function encodeGif({ width, height, frames, loop = LOOP_FOREVER, maxColors = 256, alpha }) {
  const enc = GIFEncoder();
  const colors = Math.max(2, Math.min(256, maxColors));
  if (alpha === undefined) alpha = hasAlpha(frames);

  let prev = null;
  for (let i = 0; i < frames.length; i++) {
    const fr = frames[i];
    const opts = { delay: fr.delayMs, repeat: loop };

    if (alpha) {
      const palette = quantize(fr.rgba, colors, { format: 'rgba4444', oneBitAlpha: true });
      const index = applyPalette(fr.rgba, palette, 'rgba4444');
      const tIndex = palette.findIndex((c) => c[3] === 0);
      Object.assign(opts, {
        palette,
        transparent: tIndex >= 0,
        transparentIndex: Math.max(0, tIndex),
        // dispose defaults to 2 (restore to background) when transparent.
      });
      enc.writeFrame(index, width, height, opts);
    } else {
      // Keep one slot free for the "unchanged pixel" index.
      const palette = quantize(fr.rgba, Math.max(2, colors - 1));
      const index = applyPalette(fr.rgba, palette);
      const tIndex = palette.length;
      if (prev) {
        const cur32 = new Uint32Array(fr.rgba.buffer, fr.rgba.byteOffset, index.length);
        const prev32 = new Uint32Array(prev.buffer, prev.byteOffset, index.length);
        for (let p = 0; p < index.length; p++) if (cur32[p] === prev32[p]) index[p] = tIndex;
      }
      Object.assign(opts, {
        // The extra entry only pads the colour table so tIndex is addressable;
        // applyPalette never maps a pixel onto it.
        palette: [...palette, [0, 0, 0]],
        transparent: Boolean(prev),
        transparentIndex: tIndex,
        dispose: 1, // leave previous pixels in place — required for delta frames
      });
      enc.writeFrame(index, width, height, opts);
      prev = fr.rgba;
    }
  }
  enc.finish();
  return enc.bytes();
}

function hasAlpha(frames) {
  for (const fr of frames) {
    const { rgba } = fr;
    for (let i = 3; i < rgba.length; i += 4) if (rgba[i] < 250) return true;
  }
  return false;
}
