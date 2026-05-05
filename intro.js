/* ================================================================
   THE FOUNDRY(TM) — intro.js
   White emblem preloader for login.html.
   ================================================================ */

(function () {
  'use strict';

  var overlay = null;
  var timers = [];
  var done = false;

  var EMBLEMS = [
    { src: 'assets/emblem-04.svg', cls: 'intro-mark--a' },
    { src: 'assets/emblem-12.svg', cls: 'intro-mark--b' },
    { src: 'assets/emblem-13.svg', cls: 'intro-mark--c' },
    { src: 'assets/emblem-14.svg', cls: 'intro-mark--d' },
  ];

  var CENTER_BADGES = [
    'assets/logov-15.svg',
    'assets/logov-16.svg',
    'assets/logov-17.svg',
    'assets/logov-18.svg',
  ];

  var PHASES = [
    { letter: 'F', marks: [{ i: 0, pos: 'top-center', show: true }] },
    { letter: 'D', marks: [{ i: 0, pos: 'top-center', show: true }, { i: 1, pos: 'bottom-center', show: true }] },
    { letter: 'R', marks: [{ i: 0, pos: 'top-left', show: true }, { i: 1, pos: 'bottom-right', show: true }] },
    { letter: 'Y', marks: [{ i: 2, pos: 'left-center', show: true }, { i: 3, pos: 'right-center', show: true }] },
    { letter: 'FDRY', marks: [{ i: 0, pos: 'top-right', show: true }, { i: 1, pos: 'bottom-left', show: true }, { i: 2, pos: 'left-center', show: true }, { i: 3, pos: 'right-center', show: true }] },
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
      '#intro-overlay{position:fixed;inset:0;z-index:9000;background:transparent;color:#000;overflow:hidden;' +
        'font-family:monospace;letter-spacing:.16em;text-transform:uppercase;opacity:1;}' +
      '#intro-overlay::before{content:"";position:absolute;left:0;right:0;top:0;border-top:1px solid rgba(0,0,0,.28);}' +
      '#intro-overlay::after{content:"";position:absolute;left:0;right:0;bottom:0;border-bottom:1px solid rgba(0,0,0,.28);}' +
      '.intro-stage{position:absolute;inset:0;}' +
      '.intro-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:16px;}' +
      '.intro-badge{position:relative;width:76px;height:76px;border:6px solid #000;border-radius:50%;display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(.84);transition:opacity 500ms ease,transform 760ms cubic-bezier(.22,1,.36,1);overflow:hidden;}' +
      '.intro-badge.is-on{opacity:1;transform:scale(1);}' +
      '.intro-badge-icon{width:100%;height:100%;display:block;object-fit:contain;transform:scale(.72);}' +
      '.intro-subtitle{font-size:9px;line-height:1.8;color:#777;opacity:0;transform:translateY(6px);transition:opacity 400ms ease,transform 400ms ease;}' +
      '.intro-subtitle.is-on{opacity:1;transform:translateY(0);}' +
      '.intro-mark{position:absolute;width:44px;height:44px;opacity:0;transform:translate(-50%,-50%) scale(.35);transition:opacity 320ms ease,transform 780ms cubic-bezier(.22,1,.36,1),left 780ms cubic-bezier(.22,1,.36,1),top 780ms cubic-bezier(.22,1,.36,1),right 780ms cubic-bezier(.22,1,.36,1),bottom 780ms cubic-bezier(.22,1,.36,1);will-change:transform,opacity,left,top,right,bottom;}' +
      '.intro-mark.is-on{opacity:1;transform:translate(-50%,-50%) scale(1);}' +
      '.intro-mark img{width:100%;height:100%;display:block;object-fit:contain;}' +
      '.intro-mark--a,.intro-mark--b,.intro-mark--c,.intro-mark--d{left:50%;top:50%;}' +
      '#intro-overlay.phase-hold .intro-mark,' +
      '#intro-overlay.phase-hold .intro-badge{transition:none;}' +
      '@media (max-width:600px){.intro-mark{width:36px;height:36px}.intro-badge{width:64px;height:64px;border-width:5px}.intro-badge-icon{transform:scale(.7)}.intro-subtitle{max-width:220px;text-align:center}}';
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

  function buildDOM(images, centerImages) {
    overlay = document.createElement('div');
    overlay.id = 'intro-overlay';

    var stage = document.createElement('div');
    stage.className = 'intro-stage';

    EMBLEMS.forEach(function (item, index) {
      var mark = document.createElement('div');
      mark.className = 'intro-mark ' + item.cls;
      if (images[index]) mark.appendChild(images[index]);
      stage.appendChild(mark);
    });

    var center = document.createElement('div');
    center.className = 'intro-center';
    center.innerHTML =
      '<div class="intro-badge" id="intro-badge">' +
        '<img class="intro-badge-icon" id="intro-badge-icon" src="assets/logov-15.svg" alt="">' +
      '</div>' +
      '<div class="intro-subtitle" id="intro-subtitle">Member access registry / Licensed grotesque</div>';

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
      'top-right': [w - pad, pad],
      'right-center': [w - pad, h * 0.5],
      'bottom-right': [w - pad, h - pad],
      'bottom-center': [w * 0.5, h - pad],
      'bottom-left': [pad, h - pad],
      'left-center': [pad, h * 0.5],
      'top-left': [pad, pad],
    };
    return map[name] || [w * 0.5, h * 0.5];
  }

  function setMark(mark, posName, visible) {
    var point = getPoint(posName);
    mark.style.left = point[0] + 'px';
    mark.style.top = point[1] + 'px';
    mark.classList.toggle('is-on', !!visible);
  }

  function setPhase(index, centerImages) {
    var phase = PHASES[index];
    var badge = overlay.querySelector('#intro-badge');
    var icon = overlay.querySelector('#intro-badge-icon');
    var subtitle = overlay.querySelector('#intro-subtitle');
    var marks = overlay.querySelectorAll('.intro-mark');

    if (!phase) return;

    if (badge) badge.classList.add('is-on');
    if (subtitle) subtitle.classList.toggle('is-on', index >= 4);
    if (icon && centerImages && centerImages[index]) {
      icon.src = centerImages[index].src;
    }

    Array.prototype.forEach.call(marks, function (mark, i) {
      var entry = phase.marks.filter(function (m) { return m.i === i; })[0];
      if (entry) setMark(mark, entry.pos, entry.show);
      else mark.classList.remove('is-on');
    });
  }

  function run() {
    injectStyles();
    Promise.all(
      EMBLEMS.map(function (item) { return loadImage(item.src); })
        .concat(CENTER_BADGES.map(function (src) { return loadImage(src); }))
    ).then(function (images) {
      if (done) return;
      var edgeImages = images.slice(0, EMBLEMS.length);
      var centerImages = images.slice(EMBLEMS.length);
      buildDOM(edgeImages, centerImages);
      document.addEventListener('keydown', finish, true);
      document.addEventListener('click', finish, true);

      schedule(function () { setPhase(0, centerImages); }, 160);
      schedule(function () { setPhase(1, centerImages); }, 760);
      schedule(function () { setPhase(2, centerImages); }, 1360);
      schedule(function () { setPhase(3, centerImages); }, 1960);
      schedule(function () { setPhase(4, centerImages); }, 2600);
      schedule(finish, 3220);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (shouldPlay()) run();
    else fireComplete();
  });
}());
