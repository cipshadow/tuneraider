/* ============================================================
   TUNERAIDER — interactive design-system helpers
   Framework-agnostic vanilla JS. Import after tuneraider.css.
   ============================================================ */

/* ---- FX BURST: overlapping retro title celebration / fail ----
   Spawns a fixed full-screen overlay of stacked words that pop in
   back-to-front and cascade upward, then auto-removes after 2s.   */
export function fireBurst(text, opts = {}) {
  const N = opts.layers || 6;
  const stepY = opts.stepY || 15;   // tight vertical cascade (px per layer)
  const stepX = opts.stepX || 7;    // horizontal drift (px per layer)
  const burst = document.createElement('div');
  burst.className = 'cb-burst';

  const flash = document.createElement('div');
  flash.className = 'cb-flash';
  if (opts.flash) flash.style.setProperty('--flash', opts.flash);
  burst.appendChild(flash);

  for (let i = 0; i < N; i++) {
    const up = N - 1 - i;            // 0 = front/bottom, larger = further up-back
    const w = document.createElement('div');
    w.className = 'cb-word';
    w.textContent = text;
    w.style.setProperty('--dx', (up * stepX) + 'px');
    w.style.setProperty('--dy', (-up * stepY) + 'px');
    w.style.setProperty('--delay', (i * 45) + 'ms');   // back pops first, front stamps last
    w.style.setProperty('--outline', opts.outline || '#0a0a0a');
    w.style.color = opts.palette[up % opts.palette.length];
    w.style.zIndex = i;
    burst.appendChild(w);
  }
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 2000);
}

// Positive — bright, joyful arcade colors (front = gold). Call on a correct answer.
export function fireCorrect(text = 'WEPA') {
  fireBurst(text, {
    palette: ['#ffd400', '#5dff3a', '#00d6ff', '#ff5ecb', '#ff8a1e'],
    outline: '#0c3b1e',
    flash: 'rgba(255,255,255,0.6)',
  });
}

// Negative — hot-to-dark danger reds (front = bright red). Call on a wrong answer.
export function fireWrong(text = 'NOOO') {
  fireBurst(text, {
    palette: ['#ff2d2d', '#c40000', '#7a000f', '#4a0a2a', '#2b2b2b'],
    outline: '#160000',
    flash: 'rgba(255,40,40,0.5)',
  });
}

/* ---- Volume staircase meter ----
   Wire a .gb-vol-meter (12 <i> bars) + optional [data-vol] buttons.
   onChange(volume 0-100) fires whenever the level changes.          */
export function initVolumeMeter(meter, { value = 70, onChange } = {}) {
  const bars = [...meter.querySelectorAll('i')];
  let vol = value;
  function render() {
    const lit = Math.round((vol / 100) * bars.length);
    bars.forEach((b, i) => {
      b.classList.toggle('on', i < lit);
      b.classList.toggle('peak', i === lit - 1 && lit > 0);
    });
    onChange && onChange(vol);
  }
  meter.addEventListener('click', e => {
    const r = meter.getBoundingClientRect();
    vol = clamp(Math.round(((e.clientX - r.left) / r.width) * 100));
    render();
  });
  return {
    set(v) { vol = clamp(v); render(); },
    nudge(d) { vol = clamp(vol + d); render(); },
    get value() { return vol; },
  };
}

function clamp(v) { return Math.max(0, Math.min(100, v)); }

/* ---- Melody EQ ----
   Pure CSS animation (see .gb-eq). Toggle .paused to freeze it
   when audio stops; helper provided for convenience.              */
export function setMelodyPlaying(eqEl, playing) {
  eqEl.classList.toggle('paused', !playing);
}

/* ---- Marquee chase bulbs ----
   Fills a .gb-bulbs container with N colored bulbs that chase in a wave.
   Pure CSS animation; this just builds the bars and stages the delays.  */
export function initMarquee(el, { count = 9, colors } = {}) {
  const COLORS = colors || [
    '#ff2d2d', '#ff8a1e', '#ffd400', '#5dff3a',
    '#00e5ff', '#2d7bff', '#ff5ecb', '#b46bff',
  ];
  el.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const b = document.createElement('i');
    b.className = 'gb-bulb';
    b.style.setProperty('--c', COLORS[i % COLORS.length]);
    b.style.animationDelay = (i * 0.107).toFixed(3) + 's';  // chase wave
    el.appendChild(b);
  }
}

/* ---- Arcade VU meter ----
   Fills a .gb-vu container with N columns whose green→red fills rise
   at randomized speeds for an organic bouncing-meter look.            */
export function initVUMeter(el, { count = 14 } = {}) {
  el.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const col = document.createElement('div'); col.className = 'col';
    const fill = document.createElement('div'); fill.className = 'fill';
    fill.style.animationDuration = (0.40 + Math.random() * 0.5).toFixed(2) + 's';
    fill.style.animationDelay = (-Math.random() * 0.7).toFixed(2) + 's';
    col.appendChild(fill); el.appendChild(col);
  }
}

/* ---- Disco grid ----
   When an AnalyserNode is provided the cells react to real audio energy
   (frequency bands drive rows, beat transients flash the whole grid).
   Without an analyser it falls back to the original CSS animation loop. */
export function initDiscoGrid(el, { rows = 3, cols = 8, colors, analyser } = {}) {
  const COLORS = colors || [
    '#ff2d2d', '#ff8a1e', '#ffd400', '#5dff3a',
    '#00e5ff', '#2d7bff', '#ff5ecb', '#b46bff',
  ];
  el.style.setProperty('--cols', cols);
  el.innerHTML = '';
  const cells = [];
  for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement('div'); cell.className = 'cell';
    cell.style.setProperty('--c', COLORS[Math.floor(Math.random() * COLORS.length)]);
    if (!analyser) {
      cell.style.animationDuration = (0.9 + Math.random() * 1.2).toFixed(2) + 's';
      cell.style.animationDelay = (-Math.random() * 1.5).toFixed(2) + 's';
    } else {
      cell.style.animationDuration = '0s'; // disable CSS loop; JS drives it
    }
    el.appendChild(cell);
    cells.push(cell);
  }

  if (!analyser) return;

  // Stop any previous RAF loop on this element
  if (el._discoRaf) cancelAnimationFrame(el._discoRaf);

  const freqData = new Uint8Array(analyser.frequencyBinCount);
  const bandSize = Math.floor(analyser.frequencyBinCount / cols);
  let prevEnergy = 0;

  function frame() {
    el._discoRaf = requestAnimationFrame(frame);
    analyser.getByteFrequencyData(freqData);

    // Split frequency spectrum into `cols` bands
    const bands = [];
    for (let c = 0; c < cols; c++) {
      let sum = 0;
      for (let b = 0; b < bandSize; b++) sum += freqData[c * bandSize + b];
      bands.push(sum / bandSize / 255); // 0..1
    }

    // Beat detection: sudden energy spike across all bands
    const totalEnergy = bands.reduce((a, v) => a + v, 0) / cols;
    const isBeat = totalEnergy > prevEnergy * 1.3 && totalEnergy > 0.15;
    prevEnergy = prevEnergy * 0.85 + totalEnergy * 0.15; // smooth

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = cells[r * cols + c];
        // Each row responds to a different frequency band with row offset
        const bandIdx = (c + r * 2) % cols;
        const energy = bands[bandIdx];
        const lit = isBeat || energy > 0.25 + r * 0.08;
        if (lit) {
          cell.style.setProperty('--c', COLORS[Math.floor(Math.random() * COLORS.length)]);
          cell.style.opacity = '1';
          cell.style.filter = `brightness(${1.2 + energy})`;
        } else {
          cell.style.opacity = (0.15 + energy * 0.5).toFixed(2);
          cell.style.filter = 'brightness(0.4)';
        }
      }
    }
  }
  frame();
}
