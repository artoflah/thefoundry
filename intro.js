/* ================================================================
   THE FOUNDRY™ — intro.js v3
   Halftone buildup intro for login.html.

   4 independent grid densities sample fdrylogo.svg mask.
   Each phase scales emblems up at their own position (no drift).
   All phases accumulate simultaneously — coarse → dense fill.

   Plays once per session (sessionStorage 'intro_played').
   ?intro=true force-plays. Any keydown/click skips immediately.
   Fires CustomEvent 'intro-complete' on finish or skip.
   ================================================================ */

(function () {
  'use strict';

  // ── Config ───────────────────────────────────────────────────────

  var STAGE   = 420;   // px — square stage, centered in viewport
  var MASK_SZ = 800;   // px — offscreen canvas for shape sampling
  var CAP     = 1500;  // hard cap on total emblems across all phases

  // Per-phase: emblem display size + mask grid stride & start offset
  // Each phase independently samples the logo mask at its own density
  var PH = [
    { sz: 50, stride: 100, start: 50 },  // phase 0 — coarse, large
    { sz: 24, stride:  50, start: 25 },  // phase 1 — medium
    { sz: 12, stride:  25, start: 12 },  // phase 2 — fine
    { sz:  6, stride:  12, start:  6 },  // phase 3 — very fine, tiny
  ];

  // Emblem SVG sources
  var SRCS = [
    'assets/emblem-04.svg',  // red    — FOUNDRY
    'assets/emblem-12.svg',  // blue   — DOMINION
    'assets/emblem-13.svg',  // yellow — REGISTRY
    'assets/emblem-14.svg',  // purple — YIELD
  ];

  // Interval between each phase-0 emblem appearing (ms) — sequential one-by-one
  var SEQ_INTERVAL = 70;

  // Timeline milliseconds from sequence start
  var T = {
    ph1:      200,   // first emblem appears (phase 0, sequential)
    ph2:     2100,   // phase 1 burst begins
    ph3:     2900,   // phase 2 burst begins
    ph4:     3600,   // phase 3 burst begins
    resolve: 4400,   // all emblems out, plain FDRY logo fades in
    fadeOut: 5100,   // plain logo fades out
    done:    5900,   // overlay removed, intro-complete fires
  };

  // ── State ────────────────────────────────────────────────────────

  var maskPx  = null;
  var cells   = [[], [], [], []];  // cells[p] = [{x, y}]
  var els     = [[], [], [], []];  // els[p]   = [<img>]
  var layers  = [];
  var plainEl = null;
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
        maskPx = null;
      }
      cb();
    };
    img.onerror = function () { maskPx = null; cb(); };
    img.src = 'assets/fdrylogo.svg';
  }

  // Fallback phase-0 positions if mask fails (circular badge outline, STAGE=420)
  function fallbackP0() {
    var pts = [
      [150,63],[216,63],[273,63],
      [93,117],[153,117],[213,117],[273,117],[330,117],
      [63,177],[123,177],[183,177],[243,177],[303,177],[357,177],
      [93,237],[153,237],[213,237],[273,237],[330,237],
      [147,297],[210,297],[273,297],
      [189,345],[240,345],
    ];
    return pts.map(function (p) { return { x: p[0], y: p[1] }; });
  }

  // ── Cell generation ──────────────────────────────────────────────
  // Each phase independently samples the logo mask at its own grid density.
  // Emblems appear at their own position — no parent/child relationship.

  function generateCells() {
    var total = 0;

    for (var p = 0; p < 4; p++) {
      cells[p] = [];
      if (total >= CAP) break;

      var ph  = PH[p];
      var s   = ph.start;
      var str = ph.stride;

      if (maskPx) {
        for (var gy = s; gy < MASK_SZ; gy += str) {
          for (var gx = s; gx < MASK_SZ; gx += str) {
            if (total >= CAP) break;
            if (maskBright(gx, gy) < 128) {
              cells[p].push({
                x: gx / MASK_SZ * STAGE,
                y: gy / MASK_SZ * STAGE,
              });
              total++;
            }
          }
          if (total >= CAP) break;
        }
      }

      if (p === 0 && cells[0].length < 6) {
        cells[0] = fallbackP0();
        total    = cells[0].length;
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

        // Start at own position, scale 0 — transition only animates scale, not position
        var ix = cell.x - sz / 2;
        var iy = cell.y - sz / 2;
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

  // Phase 0: emblems pop in one by one at fixed interval (scale only, no drift)
  function showPhaseSequential(p, dur, interval) {
    if (done) return;
    var sz    = PH[p].sz;
    var phase = cells[p];
    var elp   = els[p];
    var opDur = Math.round(dur * 0.6);

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
      // Position is already correct — only scale animates 0 → 1
      el.style.transform = 'translate(' + fx + 'px,' + fy + 'px) scale(1)';
      el.style.opacity   = '1';
    }
  }

  // Phases 1–3: all emblems burst in with random stagger (scale only, no drift)
  function showPhase(p, dur, maxStagger) {
    if (done) return;
    var sz    = PH[p].sz;
    var phase = cells[p];
    var elp   = els[p];
    var opDur = Math.round(dur * 0.6);

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
      // Position is already correct — only scale animates 0 → 1
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

    // Phase 0 — large emblems appear one by one (t = 200ms)
    sched(function () {
      showPhaseSequential(0, 350, SEQ_INTERVAL);
    }, T.ph1);

    // Phase 1 — medium emblems fill in, phase 0 stays (t = 2100ms)
    sched(function () {
      showPhase(1, 650, 280);
    }, T.ph2);

    // Phase 2 — fine emblems accumulate (t = 2900ms)
    sched(function () {
      showPhase(2, 600, 250);
    }, T.ph3);

    // Phase 3 — tiny emblems pack in densely (t = 3600ms)
    sched(function () {
      showPhase(3, 500, 200);
    }, T.ph4);

    // Resolve — all emblems out, plain FDRY logo fades in (t = 4400ms)
    sched(function () {
      if (done) return;
      [0, 1, 2, 3].forEach(function (p) { hidePhase(p, 450); });
      plainEl.style.transition = 'opacity 450ms ease';
      plainEl.style.opacity    = '1';
    }, T.resolve);

    // Plain logo fades out (t = 5100ms)
    sched(function () {
      if (done) return;
      plainEl.style.transition = 'opacity 580ms ease';
      plainEl.style.opacity    = '0';
    }, T.fadeOut);

    // Done — remove overlay, fire intro-complete (t = 5900ms)
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
      // Double-RAF ensures browser commits initial scale(0) state before
      // transitions fire — prevents "jumps to end" problem
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
