/* ================================================================
   THE FOUNDRY(TM) — intro.js v4
   Canvas pattern-mask intro for login.html.

   Emulates the Tooooools.app "patterns" effect by sampling fdrylogo.svg
   as a mask, then re-rendering the same regular pattern grid while
   animating grid density upward. As density rises, cells get smaller
   and more emblems appear.

   Plays once per session (sessionStorage 'intro_played').
   ?intro=true force-plays. Any keydown/click skips immediately.
   Fires CustomEvent 'intro-complete' on finish or skip.
   ================================================================ */

(function () {
  'use strict';

  var STAGE = 440;
  var MASK_SZ = 900;
  var DPR = Math.min(window.devicePixelRatio || 1, 2);

  var SRCS = [
    'assets/emblem-04.svg',
    'assets/emblem-12.svg',
    'assets/emblem-13.svg',
    'assets/emblem-14.svg',
  ];

  var THRESHOLD = 178;
  var DENSITY_START = 7;
  var DENSITY_END = 78;
  var DENSITY_DURATION = 4550;
  var T = {
    resolve: 4700,
    fadeOut: 5600,
    done: 6350,
  };

  var maskPx = null;
  var emblems = [];
  var overlay = null;
  var stageEl = null;
  var canvas = null;
  var ctx = null;
  var plainEl = null;
  var raf = 0;
  var timers = [];
  var startedAt = 0;
  var done = false;

  function shouldPlay() {
    if (new URLSearchParams(window.location.search).get('intro') === 'true') return true;
    return !sessionStorage.getItem('intro_played');
  }

  function fireComplete() {
    sessionStorage.setItem('intro_played', 'true');
    document.dispatchEvent(new CustomEvent('intro-complete'));
  }

  function sched(fn, ms) {
    timers.push(setTimeout(fn, ms));
  }

  function abort() {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    cancelAnimationFrame(raf);
    document.removeEventListener('keydown', abort, true);
    document.removeEventListener('click', abort, true);
    if (overlay) overlay.remove();
    fireComplete();
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }

  function hash01(n) {
    var x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }

  function maskBright(mx, my) {
    var x = clamp(Math.round(mx), 0, MASK_SZ - 1);
    var y = clamp(Math.round(my), 0, MASK_SZ - 1);
    var i = (y * MASK_SZ + x) * 4;
    return (maskPx[i] + maskPx[i + 1] + maskPx[i + 2]) / 3;
  }

  function loadImage(src) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { resolve(null); };
      img.src = src;
    });
  }

  function buildMask() {
    return new Promise(function (resolve) {
      var c = document.createElement('canvas');
      c.width = MASK_SZ;
      c.height = MASK_SZ;
      var cctx = c.getContext('2d');
      var img = new Image();

      img.onload = function () {
        cctx.fillStyle = '#fff';
        cctx.fillRect(0, 0, MASK_SZ, MASK_SZ);
        cctx.drawImage(img, 0, 0, MASK_SZ, MASK_SZ);
        try {
          maskPx = cctx.getImageData(0, 0, MASK_SZ, MASK_SZ).data;
        } catch (e) {
          maskPx = null;
        }
        resolve();
      };

      img.onerror = function () {
        maskPx = null;
        resolve();
      };

      img.src = 'assets/fdrylogo.svg';
    });
  }

  function injectStyles() {
    var half = STAGE / 2;
    var el = document.createElement('style');
    el.textContent =
      '#intro-overlay{position:fixed;inset:0;background:#fff;z-index:9000;overflow:hidden;}' +
      '#fdry-stage{position:fixed;width:' + STAGE + 'px;height:' + STAGE + 'px;' +
        'top:calc(50vh - ' + half + 'px);left:calc(50% - ' + half + 'px);}' +
      '#fdry-pattern{position:absolute;inset:0;width:100%;height:100%;opacity:1;' +
        'transition:opacity 700ms ease;}' +
      '#fdry-plain{position:absolute;inset:0;width:100%;height:100%;opacity:0;' +
        'will-change:opacity;pointer-events:none;transition:opacity 700ms ease;}';
    document.head.appendChild(el);
  }

  function buildDOM() {
    overlay = document.createElement('div');
    overlay.id = 'intro-overlay';

    stageEl = document.createElement('div');
    stageEl.id = 'fdry-stage';

    canvas = document.createElement('canvas');
    canvas.id = 'fdry-pattern';
    canvas.width = Math.round(STAGE * DPR);
    canvas.height = Math.round(STAGE * DPR);
    ctx = canvas.getContext('2d');
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    plainEl = document.createElement('img');
    plainEl.id = 'fdry-plain';
    plainEl.src = 'assets/fdrylogo.svg';
    plainEl.setAttribute('aria-hidden', 'true');

    stageEl.appendChild(canvas);
    stageEl.appendChild(plainEl);
    overlay.appendChild(stageEl);
    document.body.appendChild(overlay);
  }

  function drawCell(imgIndex, x, y, w, h, alpha) {
    var img = emblems[imgIndex % emblems.length];
    ctx.save();
    ctx.globalAlpha = alpha;

    if (img) {
      ctx.drawImage(img, x, y, w, h);
    } else {
      ctx.fillStyle = ['#b10a18', '#4e7c93', '#fbb03b', '#1b1464'][imgIndex % 4];
      ctx.fillRect(x, y, w, h);
    }

    ctx.restore();
  }

  function getDensity(t) {
    if (t < 120) return 0;
    var k = clamp((t - 120) / DENSITY_DURATION, 0, 1);
    return DENSITY_START + (DENSITY_END - DENSITY_START) * easeInOutCubic(k);
  }

  function drawPatternGrid(t) {
    if (!maskPx) return;

    var density = getDensity(t);
    if (density <= 0) return;

    var cellBase = STAGE / density;
    var cols = Math.ceil(STAGE / cellBase);
    var rows = Math.ceil(STAGE / cellBase);
    var cellW = STAGE / cols;
    var cellH = STAGE / rows;
    var fade = easeOutCubic(clamp((t - 120) / 520, 0, 1));

    for (var row = 0; row < rows; row++) {
      for (var col = 0; col < cols; col++) {
        var x = col * cellW;
        var y = row * cellH;
        var mx = Math.floor(x / STAGE * MASK_SZ);
        var my = Math.floor(y / STAGE * MASK_SZ);
        var b = maskBright(mx, my);

        if (b >= THRESHOLD) continue;

        var seed = col * 17.17 + row * 31.31;
        var imgIndex = Math.floor(hash01(seed) * emblems.length);
        var alpha = fade * (0.72 + hash01(seed * 2.7) * 0.28);

        drawCell(imgIndex, x, y, cellW, cellH, alpha);
      }
    }
  }

  function render(now) {
    if (done) return;
    var t = now - startedAt;

    ctx.clearRect(0, 0, STAGE, STAGE);
    drawPatternGrid(t);

    raf = requestAnimationFrame(render);
  }

  function runSequence() {
    document.addEventListener('keydown', abort, true);
    document.addEventListener('click', abort, true);

    startedAt = performance.now();
    raf = requestAnimationFrame(render);

    sched(function () {
      if (done) return;
      plainEl.style.opacity = '0.92';
    }, T.resolve);

    sched(function () {
      if (done) return;
      canvas.style.opacity = '0';
      plainEl.style.opacity = '0';
    }, T.fadeOut);

    sched(function () {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', abort, true);
      document.removeEventListener('click', abort, true);
      overlay.remove();
      fireComplete();
    }, T.done);
  }

  function run() {
    Promise.all([buildMask(), Promise.all(SRCS.map(loadImage))]).then(function (results) {
      if (done) return;
      emblems = results[1].filter(Boolean);
      injectStyles();
      buildDOM();
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
