/* ================================================================
   THE FOUNDRY(TM) — intro.js
   White emblem preloader for login.html.
   ================================================================ */

(function () {
  'use strict';

  var overlay = null;
  var timers = [];
  var done = false;

  var CENTER_BADGES = [
    'assets/logov-14.svg',
    'assets/logov-15.svg',
    'assets/logov-16.svg',
    'assets/logov-17.svg',
    'assets/logov-18.svg',
  ];

  var EDGE_EMBLEMS = {
    a: 'assets/emblem-04.svg',
    b: 'assets/emblem-12.svg',
  };

  var PHASES = [
    {
      badge: 0,
      marks: [],
    },
    {
      badge: 1,
      marks: [
        { slot: 'top', src: EDGE_EMBLEMS.a, pos: 'top-center', mode: 'fade' },
        { slot: 'bottom', src: EDGE_EMBLEMS.a, pos: 'bottom-center', mode: 'fade' },
      ],
    },
    {
      badge: 2,
      marks: [
        { slot: 'top-left', src: EDGE_EMBLEMS.b, pos: 'top-left', mode: 'slide' },
        { slot: 'bottom-right', src: EDGE_EMBLEMS.b, pos: 'bottom-right', mode: 'slide' },
      ],
    },
    {
      badge: 3,
      marks: [
        { slot: 'left-center', src: EDGE_EMBLEMS.a, pos: 'left-center', mode: 'fade' },
        { slot: 'right-center', src: EDGE_EMBLEMS.a, pos: 'right-center', mode: 'fade' },
      ],
    },
    {
      badge: 4,
      marks: [],
    },
  ];

  function shouldPlay() {
    if (new URLSearchParams(window.location.search).get('intro') === 'true') return true;
    return !sessionStorage.getItem('intro_played');
  }

  function fireComplete() {
    sessionStorage.setItem('intro_played', 'true');
    document.dispatchEvent(new CustomEvent('intro-complete'));
  }

  function schedule(fn, ms) {
    timers.push(setTimeout(fn, ms));
  }

  function finish() {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    document.removeEventListener('keydown', finish, true);
    document.removeEventListener('click', finish, true);
    if (overlay) overlay.classList.add('phase-hold');
    fireComplete();
  }

  function injectStyles() {
    var style = document.createElement('style');
    style.textContent =
      '#intro-overlay{position:fixed;inset:0;z-index:9000;background:#fff;color:#000;overflow:hidden;opacity:1;}' +
      '.intro-stage{position:absolute;inset:0;}' +
      '.intro-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;align-items:center;justify-content:center;}' +
      '.intro-badge{position:relative;width:78px;height:78px;border:5px solid #000;border-radius:50%;display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(.84);transition:opacity 420ms ease,transform 680ms cubic-bezier(.22,1,.36,1);overflow:hidden;}' +
      '.intro-badge.is-on{opacity:1;transform:scale(1);}' +
      '.intro-badge-icon{width:100%;height:100%;display:block;object-fit:contain;transform:scale(.7);}' +
      '.intro-mark{position:absolute;width:34px;height:34px;opacity:0;transform:translate(-50%,-50%) scale(.4);transition:opacity 360ms ease,transform 760ms cubic-bezier(.22,1,.36,1),left 760ms cubic-bezier(.22,1,.36,1),top 760ms cubic-bezier(.22,1,.36,1),right 760ms cubic-bezier(.22,1,.36,1),bottom 760ms cubic-bezier(.22,1,.36,1);will-change:transform,opacity,left,top,right,bottom;}' +
      '.intro-mark img{width:100%;height:100%;display:block;object-fit:contain;}' +
      '.intro-mark.is-on{opacity:1;transform:translate(-50%,-50%) scale(1);}' +
      '.intro-mark.is-slide.is-on{transform:translate(-50%,-50%) scale(1);}' +
      '.intro-mark--top,.intro-mark--bottom{left:50%;top:50%;}' +
      '.intro-mark--top{margin-top:-2px;}' +
      '.intro-mark--bottom{margin-top:2px;}' +
      '#intro-overlay.phase-hold .intro-mark,#intro-overlay.phase-hold .intro-badge{transition:none;}' +
      '@media (max-width:600px){.intro-badge{width:64px;height:64px;border-width:4px}.intro-mark{width:28px;height:28px}}';
    document.head.appendChild(style);
  }

  function loadImage(src) {
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { resolve(null); };
      img.src = src;
    });
  }

  function buildDOM(centerImages) {
    overlay = document.createElement('div');
    overlay.id = 'intro-overlay';

    var stage = document.createElement('div');
    stage.className = 'intro-stage';

    PHASES[1].marks.concat(PHASES[2].marks, PHASES[3].marks).forEach(function (markDef) {
      var mark = document.createElement('div');
      mark.className = 'intro-mark intro-mark--' + markDef.slot;
      if (markDef.mode === 'slide') mark.classList.add('is-slide');
      var img = document.createElement('img');
      img.alt = '';
      img.src = markDef.src;
      mark.appendChild(img);
      stage.appendChild(mark);
    });

    var center = document.createElement('div');
    center.className = 'intro-center';
    center.innerHTML =
      '<div class="intro-badge" id="intro-badge">' +
        '<img class="intro-badge-icon" id="intro-badge-icon" src="' + centerImages[0].src + '" alt="">' +
      '</div>';

    stage.appendChild(center);
    overlay.appendChild(stage);
    document.body.appendChild(overlay);
  }

  function getPoint(name) {
    var pad = Math.max(18, Math.round(Math.min(window.innerWidth, window.innerHeight) * 0.06));
    var w = window.innerWidth;
    var h = window.innerHeight;
    var map = {
      'top-center': [w * 0.5, pad],
      'top-left': [pad, pad],
      'bottom-center': [w * 0.5, h - pad],
      'bottom-right': [w - pad, h - pad],
      'left-center': [pad, h * 0.5],
      'right-center': [w - pad, h * 0.5],
    };
    return map[name] || [w * 0.5, h * 0.5];
  }

  function setMark(mark, posName, visible, phaseMode) {
    var point = getPoint(posName);
    mark.style.left = point[0] + 'px';
    mark.style.top = point[1] + 'px';
    mark.classList.toggle('is-on', !!visible);
    mark.classList.toggle('is-slide', phaseMode === 'slide');
  }

  function setPhase(index, centerImages) {
    var phase = PHASES[index];
    var badge = overlay.querySelector('#intro-badge');
    var icon = overlay.querySelector('#intro-badge-icon');
    var marks = overlay.querySelectorAll('.intro-mark');

    if (!phase) return;

    if (badge) badge.classList.add('is-on');
    if (icon && centerImages[index]) icon.src = centerImages[index].src;

    Array.prototype.forEach.call(marks, function (mark) {
      mark.classList.remove('is-on');
    });

    phase.marks.forEach(function (entry) {
      var idx = -1;
      if (entry.slot === 'top') idx = 0;
      else if (entry.slot === 'bottom') idx = 1;
      else if (entry.slot === 'top-left') idx = 2;
      else if (entry.slot === 'bottom-right') idx = 3;
      else if (entry.slot === 'left-center') idx = 4;
      else if (entry.slot === 'right-center') idx = 5;

      var mark = marks[idx];
      if (mark) setMark(mark, entry.pos, entry.show, entry.mode);
    });
  }

  function run() {
    injectStyles();
    Promise.all(CENTER_BADGES.map(function (src) { return loadImage(src); })).then(function (centerImages) {
      if (done) return;
      buildDOM(centerImages);
      document.addEventListener('keydown', finish, true);
      document.addEventListener('click', finish, true);

      schedule(function () { setPhase(0, centerImages); }, 160);
      schedule(function () { setPhase(1, centerImages); }, 760);
      schedule(function () { setPhase(2, centerImages); }, 1380);
      schedule(function () { setPhase(3, centerImages); }, 1960);
      schedule(function () { setPhase(4, centerImages); }, 2580);
      schedule(finish, 3300);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (shouldPlay()) run();
    else fireComplete();
  });
}());
