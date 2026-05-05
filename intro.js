/* ================================================================
   THE FOUNDRY(TM) — intro.js
   Minimal registry preloader for login.html.
   ================================================================ */

(function () {
  'use strict';

  var overlay = null;
  var timers = [];
  var intervals = [];
  var done = false;

  var ROWS = [
    ['0', '2', '4', '7', '9'],
    ['0', '3', '5', '6', '9'],
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
    intervals.forEach(clearInterval);
    document.removeEventListener('keydown', finish, true);
    document.removeEventListener('click', finish, true);
    if (overlay) overlay.remove();
    fireComplete();
  }

  function injectStyles() {
    var style = document.createElement('style');
    style.textContent =
      '#intro-overlay{position:fixed;inset:0;z-index:9000;background:#fff;color:#000;overflow:hidden;' +
        'font-family:monospace;letter-spacing:.16em;text-transform:uppercase;}' +
      '#intro-overlay::before{content:"";position:absolute;left:0;right:0;top:0;border-top:6px solid #351c22;}' +
      '#intro-overlay::after{content:"";position:absolute;inset:0;background:#000;transform:translateY(100%);' +
        'transition:transform 760ms cubic-bezier(.76,0,.24,1);}' +
      '#intro-overlay.intro-wipe::after{transform:translateY(0);}' +
      '#intro-overlay.intro-clear{background:#000;transition:opacity 520ms ease;opacity:0;}' +
      '.intro-top{position:absolute;top:13vh;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;' +
        'gap:9px;font-size:15px;color:#9a9a9a;}' +
      '.intro-number-row{display:grid;grid-template-columns:repeat(5,24px);gap:22px;justify-content:center;}' +
      '.intro-number-row span{display:block;text-align:center;transition:color 160ms ease,transform 160ms ease;}' +
      '.intro-number-row span.is-hot{color:#000;transform:translateY(-2px);}' +
      '.intro-lockup{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;' +
        'flex-direction:column;align-items:center;gap:18px;text-align:center;}' +
      '.intro-logo{width:70px;height:70px;opacity:0;transform:scale(.92);transition:opacity 620ms ease,transform 620ms ease;}' +
      '.intro-title{font-family:var(--font-licensed);font-size:clamp(42px,7vw,108px);line-height:.9;letter-spacing:0;' +
        'font-variation-settings:"wght" 60,"wdth" 80;clip-path:inset(0 100% 0 0);transition:clip-path 900ms cubic-bezier(.76,0,.24,1);}' +
      '.intro-subtitle{font-size:10px;line-height:1.8;color:#777;opacity:0;transform:translateY(6px);' +
        'transition:opacity 520ms ease,transform 520ms ease;}' +
      '.intro-footer{position:absolute;left:32px;right:32px;bottom:30px;display:flex;justify-content:space-between;' +
        'font-size:9px;color:#8a8a8a;}' +
      '#intro-overlay.intro-mark .intro-logo{opacity:1;transform:scale(1);}' +
      '#intro-overlay.intro-title-on .intro-title{clip-path:inset(0 0 0 0);}' +
      '#intro-overlay.intro-title-on .intro-subtitle{opacity:1;transform:translateY(0);}' +
      '@media (max-width:600px){.intro-top{top:11vh}.intro-number-row{gap:12px}.intro-footer{left:16px;right:16px;' +
        'bottom:18px;display:block;line-height:1.8}.intro-logo{width:58px;height:58px}}';
    document.head.appendChild(style);
  }

  function numberRows() {
    return ROWS.map(function (row, rowIndex) {
      return '<div class="intro-number-row" data-row="' + rowIndex + '">' +
        row.map(function (digit) { return '<span>' + digit + '</span>'; }).join('') +
      '</div>';
    }).join('');
  }

  function buildDOM() {
    overlay = document.createElement('div');
    overlay.id = 'intro-overlay';
    overlay.innerHTML =
      '<div class="intro-top" aria-hidden="true">' + numberRows() + '</div>' +
      '<div class="intro-lockup">' +
        '<img class="intro-logo" src="assets/fdrylogo.svg" alt="">' +
        '<div class="intro-title">FDRY</div>' +
        '<div class="intro-subtitle">Member access registry / Licensed grotesque</div>' +
      '</div>' +
      '<div class="intro-footer" aria-hidden="true">' +
        '<span>Registry boot sequence</span>' +
        '<span>Identity verification pending</span>' +
      '</div>';
    document.body.appendChild(overlay);
  }

  function runNumbers() {
    var cells = Array.from(overlay.querySelectorAll('.intro-number-row span'));
    var tick = 0;
    intervals.push(setInterval(function () {
      tick++;
      cells.forEach(function (cell, i) {
        var n = (Number(cell.textContent) + 1 + ((i + tick) % 3)) % 10;
        cell.textContent = String(n);
        cell.classList.toggle('is-hot', (i + tick) % 4 === 0);
      });
    }, 90));
  }

  function run() {
    document.addEventListener('keydown', finish, true);
    document.addEventListener('click', finish, true);
    injectStyles();
    buildDOM();
    runNumbers();

    schedule(function () { overlay.classList.add('intro-mark'); }, 260);
    schedule(function () { overlay.classList.add('intro-title-on'); }, 740);
    schedule(function () { overlay.classList.add('intro-wipe'); }, 2100);
    schedule(function () { overlay.classList.add('intro-clear'); }, 2820);
    schedule(finish, 3360);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (shouldPlay()) run();
    else fireComplete();
  });
}());
