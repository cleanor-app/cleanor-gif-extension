'use strict';

// GIF Toolkit popup — UI only. All decoding/encoding happens locally in worker.js.
const $ = (id) => document.getElementById(id);
const els = {
  drop: $('drop'), file: $('file'), pick: $('pick'), workspace: $('workspace'),
  out: $('out'), busy: $('busy'),
  statDim: $('statDim'), statFrom: $('statFrom'), statTo: $('statTo'), savings: $('savings'), hint: $('hint'),
  reverse: $('reverse'), speed: $('speed'), spdVal: $('spdVal'), scale: $('scale'), sizeVal: $('sizeVal'),
  trimCtl: $('trimCtl'), trimStart: $('trimStart'), trimEnd: $('trimEnd'), trimVal: $('trimVal'), trimFill: $('trimFill'),
  colors: $('colors'), keep: $('keep'), loop: $('loop'), resetControls: $('resetControls'),
  download: $('download'), newfile: $('newfile'),
  err: $('err'), toast: $('toast'), cta: $('cta'), siteLink: $('siteLink'),
  incoming: $('incoming'), incomingText: $('incomingText'),
  loadIncoming: $('loadIncoming'), dismissIncoming: $('dismissIncoming'),
};

const SITE = 'https://cleanor.app';
const DEFAULTS = { reverse: false, speed: '1', scale: '1', colors: '256', keep: '1' };

function siteUrl(path, medium) {
  const u = new URL(path, SITE);
  u.searchParams.set('utm_source', 'chrome_extension');
  u.searchParams.set('utm_medium', medium);
  u.searchParams.set('utm_campaign', 'cleanor_gif_toolkit');
  u.searchParams.set('utm_content', chrome.runtime.getManifest().version);
  return u.href;
}

// Point the site links at the tool matching whatever the user is actually doing.
function activeTool() {
  if (els.reverse.checked) return '/tools/reverse-gif';
  if (els.speed.value !== DEFAULTS.speed) return '/tools/gif-speed-changer';
  if (els.scale.value !== DEFAULTS.scale) return '/tools/gif-resizer';
  return '/tools/gif-optimizer';
}

const state = { name: 'animation', srcSize: 0, srcLoop: 0, srcFrames: 0, blob: null, url: null, reqId: 0 };
const worker = new Worker('worker.js', { type: 'module' });

const fmt = (n) => (n < 1024 ? n + ' B' : n < 1048576 ? (n / 1024).toFixed(1) + ' KB' : (n / 1048576).toFixed(2) + ' MB');

function showError(msg) {
  els.err.textContent = msg;
  els.err.hidden = false;
  els.busy.hidden = true;
}

let toastTimer = 0;
function toast(msg) {
  els.toast.textContent = msg;
  els.toast.hidden = false;
  requestAnimationFrame(() => els.toast.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    els.toast.classList.remove('show');
    setTimeout(() => (els.toast.hidden = true), 200);
  }, 1800);
}

// ---- load -------------------------------------------------------------------
function loadFile(file) {
  if (!file) return;
  els.err.hidden = true;
  els.busy.hidden = false;
  els.workspace.hidden = false;
  els.drop.hidden = true;
  els.download.disabled = true;
  state.name = (file.name || 'animation').replace(/\.[^.]+$/, '');
  state.srcSize = file.size;
  worker.postMessage({ type: 'load', file });
}

// ---- render (debounced; only the newest request wins) -----------------------
let renderTimer = 0;
function scheduleRender(e) {
  syncControls(e && e.target);
  els.hint.hidden = true;
  els.busy.hidden = false;
  els.download.disabled = true;
  clearTimeout(renderTimer);
  renderTimer = setTimeout(requestRender, 120);
}

function requestRender() {
  els.err.hidden = true;
  worker.postMessage({
    type: 'render',
    id: ++state.reqId,
    opts: {
      trimStart: Number(els.trimStart.value),
      trimEnd: Number(els.trimEnd.value),
      reverse: els.reverse.checked,
      speed: Number(els.speed.value),
      scale: Number(els.scale.value),
      keepEvery: Number(els.keep.value),
      maxColors: Number(els.colors.value),
      loop: Number(els.loop.value),
    },
  });
}

worker.onmessage = ({ data }) => {
  if (data.type === 'error') {
    if (data.id && data.id !== state.reqId) return; // stale
    showError(data.message);
    els.workspace.hidden = true;
    els.drop.hidden = false;
    els.file.value = '';
    return;
  }

  if (data.type === 'loaded') {
    state.srcLoop = data.loop;
    state.srcFrames = data.frameCount;
    for (const el of [els.trimStart, els.trimEnd]) el.max = String(data.frameCount);
    els.trimCtl.classList.toggle('off', data.frameCount < 2); // nothing to trim in a still
    resetControls(data.loop);
    requestRender();
    return;
  }

  if (data.type === 'rendered') {
    if (data.id !== state.reqId) return; // a newer render is already on its way
    if (state.url) URL.revokeObjectURL(state.url);
    state.blob = new Blob([data.bytes], { type: 'image/gif' });
    state.url = URL.createObjectURL(state.blob);
    els.out.src = state.url;

    const pct = Math.round((1 - state.blob.size / state.srcSize) * 100);
    els.statDim.textContent = `${data.width}×${data.height} · ${data.frameCount} frame${data.frameCount === 1 ? '' : 's'}`;
    els.statFrom.textContent = fmt(state.srcSize);
    els.statTo.textContent = fmt(state.blob.size);
    els.savings.textContent = pct > 0 ? `−${pct}%` : `+${Math.abs(pct)}%`;
    els.savings.classList.toggle('grow', pct <= 0);
    // Little or no saving means the frames share few pixels (full-motion clips) or the file
    // was already tightly packed. Either way the fix is the same — say so instead of just
    // showing a disappointing number.
    els.hint.hidden = pct >= 10 || els.colors.value !== DEFAULTS.colors || els.keep.value !== DEFAULTS.keep;

    els.busy.hidden = true;
    els.download.disabled = false;
    els.siteLink.href = siteUrl(activeTool(), 'popup_footer');
    els.cta.href = siteUrl(activeTool(), 'results_cta');
  }
};

// ---- controls ---------------------------------------------------------------
function fillTrack(el) {
  const pct = ((el.value - el.min) / (el.max - el.min)) * 100;
  el.style.setProperty('--fill', pct + '%');
}

// The two trim thumbs share a track, so they must never cross.
function clampTrim(moved) {
  let a = Number(els.trimStart.value);
  let b = Number(els.trimEnd.value);
  if (a > b) {
    if (moved === els.trimStart) b = a;
    else a = b;
    els.trimStart.value = String(a);
    els.trimEnd.value = String(b);
  }
  return [a, b];
}

function trimmed() {
  return Number(els.trimStart.value) > 1 || Number(els.trimEnd.value) < state.srcFrames;
}

function syncControls(moved) {
  const [a, b] = clampTrim(moved);
  const n = state.srcFrames || 1;
  els.trimVal.textContent = trimmed() ? `frames ${a}–${b} of ${n}` : 'all frames';
  const pctOf = (v) => (n < 2 ? 0 : ((v - 1) / (n - 1)) * 100);
  els.trimFill.style.left = pctOf(a) + '%';
  els.trimFill.style.width = pctOf(b) - pctOf(a) + '%';

  els.spdVal.textContent = Number(els.speed.value) + '×';
  els.sizeVal.textContent = Math.round(Number(els.scale.value) * 100) + '%';
  fillTrack(els.speed);
  fillTrack(els.scale);

  const touched =
    trimmed() ||
    els.reverse.checked ||
    els.speed.value !== DEFAULTS.speed ||
    els.scale.value !== DEFAULTS.scale ||
    els.colors.value !== DEFAULTS.colors ||
    els.keep.value !== DEFAULTS.keep ||
    Number(els.loop.value) !== state.srcLoop;
  els.resetControls.hidden = !touched;
}

function resetControls(loop = state.srcLoop) {
  els.reverse.checked = DEFAULTS.reverse;
  els.speed.value = DEFAULTS.speed;
  els.scale.value = DEFAULTS.scale;
  els.colors.value = DEFAULTS.colors;
  els.keep.value = DEFAULTS.keep;
  els.trimStart.value = '1';
  els.trimEnd.value = String(state.srcFrames || 1);
  // Keep the source's own loop setting unless the file uses one we don't offer.
  els.loop.value = [...els.loop.options].some((o) => Number(o.value) === loop) ? String(loop) : '0';
  syncControls();
}

function outName() {
  const tag = trimmed()
    ? 'trimmed'
    : els.reverse.checked
      ? 'reversed'
      : els.speed.value !== DEFAULTS.speed
        ? 'speed'
        : els.scale.value !== DEFAULTS.scale
          ? 'resized'
          : 'optimized';
  return `${state.name}-${tag}-cleanor.gif`;
}

// ---- events -----------------------------------------------------------------
els.pick.addEventListener('click', (e) => { e.stopPropagation(); els.file.click(); });
els.drop.addEventListener('click', () => els.file.click());
els.drop.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); els.file.click(); }
});
els.file.addEventListener('change', () => loadFile(els.file.files && els.file.files[0]));

// Accept a drop anywhere in the popup, not just on the dropzone — and never let the
// browser navigate away to the dropped file if the user misses.
for (const ev of ['dragover', 'dragenter']) {
  document.addEventListener(ev, (e) => { e.preventDefault(); els.drop.classList.add('drag'); });
}
for (const ev of ['dragleave', 'dragend']) {
  document.addEventListener(ev, (e) => { if (!e.relatedTarget) els.drop.classList.remove('drag'); });
}
document.addEventListener('drop', (e) => {
  e.preventDefault();
  els.drop.classList.remove('drag');
  loadFile(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]);
});

for (const el of [els.reverse, els.speed, els.scale, els.colors, els.keep, els.loop, els.trimStart, els.trimEnd]) {
  el.addEventListener('input', scheduleRender);
}
els.resetControls.addEventListener('click', () => { resetControls(); scheduleRender(); });

els.download.addEventListener('click', () => {
  if (!state.blob) return;
  const a = document.createElement('a');
  a.href = state.url;
  a.download = outName();
  document.body.appendChild(a);
  a.click();
  a.remove();
  toast('GIF saved');
  els.cta.hidden = false;
});

els.newfile.addEventListener('click', () => {
  if (state.url) URL.revokeObjectURL(state.url);
  Object.assign(state, { blob: null, url: null });
  els.file.value = '';
  els.out.removeAttribute('src');
  els.workspace.hidden = true;
  els.cta.hidden = true;
  els.err.hidden = true;
  els.hint.hidden = true;
  els.drop.hidden = false;
});

// ---- right-click hand-off (popup.html?tab=1&src=<image url>) ----------------
const params = new URLSearchParams(location.search);
if (params.has('tab')) document.body.classList.add('tab');

function nameFromUrl(url) {
  try {
    const p = new URL(url).pathname;
    return decodeURIComponent(p.slice(p.lastIndexOf('/') + 1)) || 'animation.gif';
  } catch { return 'animation.gif'; }
}

async function fetchIncoming(src) {
  // Host access is asked for one origin, on the user's click — never held up front.
  if (!src.startsWith('data:') && chrome.permissions) {
    const origin = new URL(src).origin + '/*';
    if (!(await chrome.permissions.contains({ origins: [origin] }))) {
      const granted = await chrome.permissions.request({ origins: [origin] });
      if (!granted) throw new Error('permission denied');
    }
  }
  const resp = await fetch(src);
  if (!resp.ok) throw new Error('fetch failed');
  const blob = await resp.blob();
  loadFile(new File([blob], nameFromUrl(src), { type: blob.type || 'image/gif' }));
}

const incomingSrc = params.get('src');
if (incomingSrc) {
  let host = 'this page';
  try { host = new URL(incomingSrc).host || host; } catch {}
  els.incomingText.textContent = `Open the GIF from ${host}?`;
  els.incoming.hidden = false;
  els.dismissIncoming.addEventListener('click', () => { els.incoming.hidden = true; });
  els.loadIncoming.addEventListener('click', async () => {
    els.loadIncoming.disabled = true;
    els.loadIncoming.textContent = 'Loading…';
    try {
      await fetchIncoming(incomingSrc);
      els.incoming.hidden = true;
    } catch {
      els.loadIncoming.disabled = false;
      els.loadIncoming.textContent = 'Load GIF';
      els.incomingText.textContent =
        'Could not load that image (the site blocked it, or access was denied). Drag the file in instead.';
    }
  });
}

syncControls();
els.siteLink.href = siteUrl('/tools/reverse-gif', 'popup_footer');
els.cta.href = siteUrl('/tools/gif-optimizer', 'results_cta');
