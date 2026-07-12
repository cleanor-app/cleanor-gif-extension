'use strict';

// Decode / transform / encode off the popup's main thread, so dragging the
// sliders never freezes the UI. Frames stay here — the popup only gets bytes.
import { decodeAnimated, applyOps, encodeGif } from './gif-core.js';

let source = null; // { width, height, loop, frames }

self.onmessage = async ({ data }) => {
  try {
    if (data.type === 'load') {
      source = await decodeAnimated(data.file);
      const durationMs = source.frames.reduce((sum, f) => sum + f.delayMs, 0);
      self.postMessage({
        type: 'loaded',
        width: source.width,
        height: source.height,
        loop: source.loop,
        frameCount: source.frames.length,
        durationMs,
      });
      return;
    }

    if (data.type === 'render') {
      if (!source) throw new Error('No file loaded.');
      const { id, opts } = data;
      const { frames, width, height } = applyOps(source, opts);
      const bytes = encodeGif({
        width, height, frames,
        loop: opts.loop,
        maxColors: opts.maxColors,
        alpha: source.alpha,
      });
      self.postMessage(
        { type: 'rendered', id, bytes, width, height, frameCount: frames.length },
        [bytes.buffer],
      );
      return;
    }
  } catch (e) {
    self.postMessage({ type: 'error', id: data && data.id, message: e && e.message ? e.message : String(e) });
  }
};
