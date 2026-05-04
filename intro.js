/* ================================================================
   THE LICENSED FOUNDRY™ — intro.js v2
   Cell-division buildup intro for login.html.

   Plays once per session (sessionStorage 'intro_played').
   ?intro=true force-plays. Any keydown/click skips immediately.
   Fires CustomEvent 'intro-complete' on finish or skip.
   ================================================================ */

(function () {
  'use strict';

  // ── Config ───────────────────────────────────────────────────────

  var STAGE   = 420;   // px — square stage, centered in viewport
  var MASK_SZ = 800;   // px — offscreen canvas for FDRY shape sampling
  var GRID_SP = 100;   // sampling stride in mask space (8×8 = 64 grid points)
  var CAP     = 1500;  // hard cap on total emblems across all phases

  // Per-phase config: emblem display size, spread offset from parent center
  var PH = [
    { sz: 50, off: null },  // phase 0 — sparse, one-by-one sequential
    { sz: 24, off: 18   },  // phase 1 → children at ±18px
    { sz: 11, off:  8   },  // phase 2 → children at ±8px
    { sz:  5, off:  4   },  // phase 3 → children at ±4px
  ];

  // Emblem SVG sources
  var SRCS = [
    'assets/emblem-04.svg',  // red    — FOUNDRY
    'assets/emblem-12.svg',  // blue   — DOMINION
    'assets/emblem-13.svg',  // yellow — REGISTRY
    'assets/emblem-14.svg',  // purple — YIELD
  ];

  // Interval between each phase-0 emblem appearing (ms)
  var SEQ_INTERVAL = 70;

  // Timeline milliseconds from sequence start
  var T = {
    ph1:      300,   // first emblem appears
    ph2:     2200,   // phase 0 done, phase 1 bursts in
    ph3:     3200,   // phase 1 → phase 2
    ph4:     4200,   // phase 2 → phase 3
    resolve: 5200,   // all emblems out, plain FDRY logo fades in
    fadeOut: 5900,   // plain logo fades out
    done:    6700,   // overlay removed, intro-complete fires
  };

  // ── State ────────────────────────────────────────────────────────

  var maskPx  = null;              // Uint8ClampedArray pixel data from mask canvas
  var cells   = [[], [], [], []];  // cells[p] = [{x, y, px, py}]
  var els     = [[], [], [], []];  // els[p]   = [<img>]
  var layers  = [];                // layer <div>s, one per phase
  var plainEl = null;              // plain fdrylogo <img>
  var overlay = null;
  var stageEl = null;
  var timers  = [];
  var done    = false;

  // ── Utilities ────────────────────────────────────────────────────

  function shouldPlay() {
    if (new URLSearchParams(window.location.search).get('intro') === 'true') return true;
    return !sessionStorage.getItem('intro_played');
  }

  function fireComplete() {
    sessionStorage.setItem('intro_played', 'true');
    document.dispatchEvent(new CustomEvent('intro-complete'));
  }

  function rndSrc() {
    return SRCS[Math.floor(Math.random() * SRCS.length)];
  }

  function sched(fn, ms) {
    timers.push(setTimeout(fn, ms));
  }

  function abort() {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    document.removeEventListener('keydown', abort, true);
    document.removeEventListener('click',   abort, true);
    if (overlay) overlay.remove();
    fireComplete();
  }

  // ── Mask sampling ────────────────────────────────────────────────

  function maskBright(mx, my) {
    var x = Math.max(0, Math.min(MASK_SZ - 1, Math.round(mx)));
    var y = Math.max(0, Math.min(MASK_SZ - 1, Math.round(my)));
    var i = (y * MASK_SZ + x) * 4;
    return (maskPx[i] + maskPx[i + 1] + maskPx[i + 2]) / 3;
  }

  function isDark(sx, sy) {
    if (!maskPx) return true;
    return maskBright(sx / STAGE * MASK_SZ, sy / STAGE * MASK_SZ) < 128;
  }

  function buildMask(cb) {
    var canvas    = document.createElement('canvas');
    canvas.width  = MASK_SZ;
    canvas.height = MASK_SZ;
    var ctx = canvas.getContext('2d');
    var img = new Image();

    img.onload = function () {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, MASK_SZ, MASK_SZ);
      ctx.drawImage(img, 0, 0, MASK_SZ, MASK_SZ);
      try {
        maskPx = ctx.getImageData(0, 0, MASK_SZ, MASK_SZ).data;
      } catch (e) {
        maskPx = null; // tainted canvas fallback
      }
      cb();
    };
    img.onerror = function () { maskPx = null; cb(); };
    img.src = 'assets/fdrylogo.svg';
  }

  // Fallback phase-0 positions scaled to STAGE=420 (circular badge outline)
  function fallbackP0() {
    var pts = [
      [150, 63],[216, 63],[273, 63],
      [93, 117],[153, 117],[213, 117],[273, 117],[330, 117],
      [63, 177],[123, 177],[183, 177],[243, 177],[303, 177],[357, 177],
      [93, 237],[153, 237],[213, 237],[273, 237],[330, 237],
      [147, 297],[210, 297],[273, 297],
      [189, 345],[240, 345],
    ];
    return pts.map(function (p) {
      return { x: p[0], y: p[1], px: p[0], py: p[1] };
    });
  }

  // ── Cell generation ──────────────────────────────────────────────

  function generateCells() {
    cells[0] = [];
    if (maskPx) {
      for (var gy = GRID_SP / 2; gy < MASK_SZ; gy += GRID_SP) {
        for (var gx = GRID_SP / 2; gx < MASK_SZ; gx += GRID_SP) {
          if (maskBright(gx, gy) < 128) {
            var sx = gx / MASK_SZ * STAGE;
            var sy = gy / MASK_SZ * STAGE;
            cells[0].push({ x: sx, y: sy, px: sx, py: sy });
          }
        }
      }
    }
    if (cells[0].length < 6) cells[0] = fallbackP0();

    var DIRS  = [[-1,-1],[1,-1],[-1,1],[1,1]];
    var total = cells[0].length;

    for (var p = 1; p <= 3; p++) {
      cells[p] = [];
      var off  = PH[p].off;
      var prev = cells[p - 1];

      for (var pi = 0; pi < prev.length; pi++) {
        if (total >= CAP) break;
        var par = prev[pi];

        for (var di = 0; di < 4; di++) {
          if (total >= CAP) break;
          var cx = par.x + DIRS[di][0] * off;
          var cy = par.y + DIRS[di][1] * off;

          if (cx >= 0 && cy >= 0 && cx <= STAGE && cy <= STAGE && isDark(cx, cy)) {
            cells[p].push({ x: cx, y: cy, px: par.x, py: par.y });
            total++;
          }
        }
      }
    }
  }

  // ── CSS injection ────────────────────────────────────────────────

  function injectStyles() {
    var half = STAGE / 2;
    var el   = document.createElement('style');
    el.textContent =
      '#intro-overlay{position:fixed;inset:0;background:#fff;z-index:9000;overflow:hidden;}' +
      '#fdry-stage{' +
        'position:fixed;' +
        'width:'  + STAGE + 'px;' +
        'height:' + STAGE + 'px;' +
        'top:calc(50vh - '  + half + 'px);' +
        'left:calc(50% - '  + half + 'px);' +
        'transform-origin:center center;}' +
      '.ipl{position:absolute;inset:0;pointer-events:none;}' +
      '.iem{position:absolute;top:0;left:0;' +
        'will-change:transform,opacity;' +
        'user-select:none;pointer-events:none;display:block;}' +
      '#fdry-plain{position:absolute;inset:0;width:100%;height:100%;' +
        'opacity:0;will-change:opacity;pointer-events:none;}';
    document.head.appendChild(el);
  }

  // ── DOM construction ─────────────────────────────────────────────

  function buildDOM() {
    overlay    = document.createElement('div');
    overlay.id = 'intro-overlay';

    stageEl    = document.createElement('div');
    stageEl.id = 'fdry-stage';

    for (var p = 0; p < 4; p++) {
      var layer = document.createElement('div');
      layer.className = 'ipl';
      layers.push(layer);
      stageEl.appendChild(layer);

      var sz    = PH[p].sz;
      var phase = cells[p];
      els[p]    = [];

      for (var ci = 0; ci < phase.length; ci++) {
        var cell = phase[ci];
        var img  = document.createElement('img');
        img.src  = rndSrc();
        img.className = 'iem';
        img.setAttribute('aria-hidden', 'true');
        img.style.width  = sz + 'px';
        img.style.height = sz + 'px';

        // Start at parent center, scale 0, invisible — transition moves to own position
        var ix = cell.px - sz / 2;
        var iy = cell.py - sz / 2;
        img.style.transform = 'translate(' + ix + 'px,' + iy + 'px) scale(0)';
        img.style.opacity   = '0';

        layer.appendChild(img);
        els[p].push(img);
      }
    }

    plainEl     = document.createElement('img');
    plainEl.id  = 'fdry-plain';
    plainEl.src = 'assets/fdrylogo.svg';
    plainEl.setAttribute('aria-hidden', 'true');
    stageEl.appendChild(plainEl);

    overlay.appendChild(stageEl);
    document.body.appendChild(overlay);
  }

  // ── Per-phase animation helpers ───────────────────────────────────

  // Phase 0 only: emblems appear one by one at a fixed sequential interval
  function showPhaseSequential(p, dur, interval) {
    if (done) return;
    var sz    = PH[p].sz;
    var phase = cells[p];
    var elp   = els[p];
    var opDur = Math.round(dur * 0.55);

    for (var i = 0; i < phase.length; i++) {
      var el    = elp[i];
      var cell  = phase[i];
      var delay = i * interval;
      var fx    = cell.x - sz / 2;
      var fy    = cell.y - sz / 2;

      el.style.transitionProperty       = 'transform, opacity';
      el.style.transitionDuration       = dur + 'ms, ' + opDur + 'ms';
      el.style.transitionTimingFunction = 'cubic-bezier(0.34,1.56,0.64,1), ease';
      el.style.transitionDelay          = delay + 'ms, ' + delay + 'ms';
      el.style.transform = 'translate(' + fx + 'px,' + fy + 'px) scale(1)';
      el.style.opacity   = '1';
    }
  }

  // Phases 1–3: random stagger (burst feel — all emanate from parents simultaneously)
  function showPhase(p, dur, maxStagger) {
    if (done) return;
    var sz    = PH[p].sz;
    var phase = cells[p];
    var elp   = els[p];
    var opDur = Math.round(dur * 0.55);

    for (var i = 0; i < phase.length; i++) {
      var el    = elp[i];
      var cell  = phase[i];
      var delay = Math.random() * maxStagger;
      var fx    = cell.x - sz / 2;
      var fy    = cell.y - sz / 2;

      el.style.transitionProperty       = 'transform, opacity';
      el.style.transitionDuration       = dur + 'ms, ' + opDur + 'ms';
      el.style.transitionTimingFunction = 'cubic-bezier(0.34,1.56,0.64,1), ease';
      el.style.transitionDelay          = delay + 'ms, ' + delay + 'ms';
      el.style.transform = 'translate(' + fx + 'px,' + fy + 'px) scale(1)';
      el.style.opacity   = '1';
    }
  }

  function hidePhase(p, dur) {
    if (done) return;
    var elp = els[p];
    for (var i = 0; i < elp.length; i++) {
      var el = elp[i];
      el.style.transitionProperty       = 'opacity';
      el.style.transitionDuration       = dur + 'ms';
      el.style.transitionTimingFunction = 'ease';
      el.style.transitionDelay          = '0ms';
      el.style.opacity = '0';
    }
  }

  // ── Main sequence ─────────────────────────────────────────────────

  function runSequence() {
    document.addEventListener('keydown', abort, true);
    document.addEventListener('click',   abort, true);

    // Phase 0 — emblems appear one by one (t = 300ms)
    sched(function () {
      showPhaseSequential(0, 380, SEQ_INTERVAL);
    }, T.ph1);

    // Phase 1 — smaller emblems fill in around phase 0 (t = 2200ms)
    sched(function () {
      showPhase(1, 700, 300);
    }, T.ph2);

    // Phase 2 — denser fill, all previous layers stay (t = 3200ms)
    sched(function () {
      showPhase(2, 750, 320);
    }, T.ph3);

    // Phase 3 — halftone density, all layers accumulate (t = 4200ms)
    sched(function () {
      showPhase(3, 600, 180);
    }, T.ph4);

    // Resolve — all emblems out, plain FDRY logo fades in (t = 5200ms)
    sched(function () {
      if (done) return;
      [0, 1, 2, 3].forEach(function (p) { hidePhase(p, 480); });
      plainEl.style.transition = 'opacity 480ms ease';
      plainEl.style.opacity    = '1';
    }, T.resolve);

    // Plain logo fades out (t = 5900ms)
    sched(function () {
      if (done) return;
      plainEl.style.transition = 'opacity 600ms ease';
      plainEl.style.opacity    = '0';
    }, T.fadeOut);

    // Done — remove overlay, fire intro-complete (t = 6700ms)
    sched(function () {
      if (done) return;
      done = true;
      document.removeEventListener('keydown', abort, true);
      document.removeEventListener('click',   abort, true);
      overlay.remove();
      fireComplete();
    }, T.done);
  }

  // ── Entry ────────────────────────────────────────────────────────

  function run() {
    buildMask(function () {
      if (done) return;
      generateCells();
      injectStyles();
      buildDOM();
      // Double-RAF ensures browser commits initial element state before
      // transitions start — avoids the "jumps to end" problem
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          if (!done) runSequence();
        });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (shouldPlay()) {
      run();
    } else {
      fireComplete();
    }
  });

}());
