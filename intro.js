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

  var STAGE   = 700;   // px — square stage, centered in viewport
  var MASK_SZ = 800;   // px — offscreen canvas for FDRY shape sampling
  var GRID_SP = 100;   // sampling stride (8×8 = 64 grid points)
  var CAP     = 1500;  // hard cap on total emblems across all phases

  // Per-phase config: emblem display size, spread offset from parent center
  var PH = [
    { sz: 80, off: null },  // phase 0 (phase 1 in spec) — no parent
    { sz: 40, off: 30   },  // phase 1 → children at ±30px
    { sz: 18, off: 14   },  // phase 2 → children at ±14px
    { sz:  7, off:  6   },  // phase 3 → children at ±6px
  ];

  // Emblem SVG sources (mapped to existing asset filenames)
  var SRCS = [
    'assets/emblem-04.svg',  // red    — FOUNDRY
    'assets/emblem-12.svg',  // blue   — DOMINION
    'assets/emblem-13.svg',  // yellow — REGISTRY
    'assets/emblem-14.svg',  // purple — YIELD
  ];

  // Timeline milliseconds from sequence start
  var T = {
    ph1:      300,
    ph2:     1000,
    ph3:     2000,
    ph4:     3200,
    resolve: 4500,
    collapse: 5300,
    done:    6000,
  };

  // ── State ────────────────────────────────────────────────────────

  var maskPx  = null;              // Uint8ClampedArray pixel data from mask canvas
  var cells   = [[], [], [], []];  // cells[p] = [{x, y, px, py}] (px/py = parent center)
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

  // Returns average brightness at a MASK_SZ-space coordinate
  function maskBright(mx, my) {
    var x = Math.max(0, Math.min(MASK_SZ - 1, Math.round(mx)));
    var y = Math.max(0, Math.min(MASK_SZ - 1, Math.round(my)));
    var i = (y * MASK_SZ + x) * 4;
    return (maskPx[i] + maskPx[i + 1] + maskPx[i + 2]) / 3;
  }

  // Returns true if stage-space coordinate (sx, sy) falls on a dark mask pixel
  function isDark(sx, sy) {
    if (!maskPx) return true; // no mask → treat everywhere as valid
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
        maskPx = null; // security error (tainted canvas) — use fallback
      }
      cb();
    };
    img.onerror = function () { maskPx = null; cb(); };
    img.src = 'assets/fdrylogo.svg';
  }

  // Hardcoded fallback phase-1 positions (rough circular badge shape)
  function fallbackP1() {
    var pts = [
      [250,105],[360,105],[455,105],
      [155,195],[255,195],[355,195],[455,195],[550,195],
      [105,295],[205,295],[305,295],[405,295],[505,295],[595,295],
      [155,395],[255,395],[355,395],[455,395],[550,395],
      [245,495],[350,495],[455,495],
      [315,575],[400,575],
    ];
    return pts.map(function (p) {
      return { x: p[0], y: p[1], px: p[0], py: p[1] };
    });
  }

  // ── Cell generation ──────────────────────────────────────────────

  function generateCells() {
    // Phase 0: sample mask at coarse grid
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
    if (cells[0].length < 6) cells[0] = fallbackP1();

    // Phases 1–3: each parent spawns 4 children at ±offset diagonals
    var DIRS  = [[-1,-1],[1,-1],[-1,1],[1,1]];
    var total = cells[0].length;

    for (var p = 1; p <= 3; p++) {
      cells[p] = [];
      var off   = PH[p].off;
      var prev  = cells[p - 1];

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

    // One layer <div> per phase; emblem <img>s live inside
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

        // Initial state: at parent center, scale 0, invisible
        // When transition fires it will move to own position at scale 1
        var ix = cell.px - sz / 2;
        var iy = cell.py - sz / 2;
        img.style.transform = 'translate(' + ix + 'px,' + iy + 'px) scale(0)';
        img.style.opacity   = '0';

        layer.appendChild(img);
        els[p].push(img);
      }
    }

    plainEl    = document.createElement('img');
    plainEl.id = 'fdry-plain';
    plainEl.src = 'assets/fdrylogo.svg';
    plainEl.setAttribute('aria-hidden', 'true');
    stageEl.appendChild(plainEl);

    overlay.appendChild(stageEl);
    document.body.appendChild(overlay);
  }

  // ── Per-phase animation helpers ───────────────────────────────────

  // Transition phase p from start state → final positions (emanate from parent)
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

  // Fade out all elements of phase p; leaves transform frozen
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

    // Phase 1 — sparse emblems appear (t = 300ms)
    sched(function () {
      showPhase(0, 420, T.ph2 - T.ph1 - 80);
    }, T.ph1);

    // Phase 2 — first division (t = 1000ms)
    sched(function () {
      hidePhase(0, 300);
      showPhase(1, 800, 350);
    }, T.ph2);

    // Phase 3 — second division (t = 2000ms)
    sched(function () {
      hidePhase(1, 300);
      showPhase(2, 850, 380);
    }, T.ph3);

    // Phase 4 — third division / halftone density (t = 3200ms)
    sched(function () {
      hidePhase(2, 300);
      showPhase(3, 620, 200);
    }, T.ph4);

    // Phase 5 — resolve: all emblems out, plain FDRY in (t = 4500ms)
    sched(function () {
      if (done) return;
      [0, 1, 2, 3].forEach(function (p) { hidePhase(p, 480); });
      plainEl.style.transition = 'opacity 480ms ease';
      plainEl.style.opacity    = '1';
    }, T.resolve);

    // Phase 6 — collapse to login logo position (t = 5300ms)
    sched(function () {
      if (done) return;
      var scl    = 120 / STAGE;
      // Target center: 25vh + 60px (top of 120px-tall logo at 25vh)
      var deltaY = (window.innerHeight * 0.25 + 60) - window.innerHeight * 0.5;
      stageEl.style.transition = 'transform 0.65s ease-in-out';
      stageEl.style.transform  =
        'translateY(' + deltaY + 'px) scale(' + scl + ')';
    }, T.collapse);

    // Done (t = 6000ms)
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
