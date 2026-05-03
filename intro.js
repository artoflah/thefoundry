/* ================================================================
   THE LICENSED FOUNDRY™ — intro.js
   One-time intro splash for login.html.
   Plays once per session. ?intro=true force-plays regardless.
   Any keydown or click skips immediately.
   Fires CustomEvent 'intro-complete' on finish or skip.
   ================================================================ */

(function () {
  'use strict';

  /* ── Emblem data ──────────────────────────────────────────────── */

  var EMBLEMS = [
    {
      src: 'assets/emblem-04.svg',
      head: 'F \u2014 FOUNDRY (n.)',
      body: 'a workshop or factory for casting metal; an institution for the production of typeface'
    },
    {
      src: 'assets/emblem-12.svg',
      head: 'D \u2014 DOMINION (n.)',
      body: 'the power or right of governing and controlling; sovereignty'
    },
    {
      src: 'assets/emblem-13.svg',
      head: 'R \u2014 REGISTRY (n.)',
      body: 'an official list or record; a place where records are kept'
    },
    {
      src: 'assets/emblem-14.svg',
      head: 'Y \u2014 YIELD (v.)',
      body: 'to surrender or relinquish, especially in deference to another'
    }
  ];

  /* ── Helpers ──────────────────────────────────────────────────── */

  function shouldPlay() {
    if (new URLSearchParams(window.location.search).get('intro') === 'true') return true;
    return !sessionStorage.getItem('intro_played');
  }

  function fireComplete() {
    sessionStorage.setItem('intro_played', 'true');
    document.dispatchEvent(new CustomEvent('intro-complete'));
  }

  /* ── Sequence ─────────────────────────────────────────────────── */

  function run() {

    /* Preload emblem images so there's no flash on first stamp */
    EMBLEMS.forEach(function (e) {
      var img = new Image();
      img.src = e.src;
    });

    /* Build overlay DOM ------------------------------------------ */
    var overlay = document.createElement('div');
    overlay.id = 'intro-overlay';

    var stage = document.createElement('div');
    stage.id = 'logo-stage';

    var fdryImg = document.createElement('img');
    fdryImg.id = 'intro-fdry';
    fdryImg.src = 'assets/fdrylogo.svg';
    fdryImg.alt = '';

    var emblemImg = document.createElement('img');
    emblemImg.id = 'intro-emblem';
    emblemImg.alt = '';

    stage.appendChild(fdryImg);
    stage.appendChild(emblemImg);

    var defDiv = document.createElement('div');
    defDiv.id = 'intro-def';

    overlay.appendChild(stage);
    overlay.appendChild(defDiv);
    document.body.appendChild(overlay);

    /* State ------------------------------------------------------ */
    var done = false;
    var timers = [];

    function sched(fn, ms) {
      timers.push(setTimeout(fn, ms));
    }

    function abort() {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      document.removeEventListener('keydown', abort, true);
      document.removeEventListener('click',   abort, true);
      overlay.remove();
      fireComplete();
    }

    /* Capture phase so we intercept before anything else */
    document.addEventListener('keydown', abort, true);
    document.addEventListener('click',   abort, true);

    /* Stamp emblem i and update definition text */
    function stamp(i) {
      if (done) return;
      var e = EMBLEMS[i];

      /* Set src, then reset visual state without transition */
      emblemImg.src = e.src;
      emblemImg.style.transition = 'none';
      emblemImg.style.transform  = 'scale(1.1)';
      emblemImg.style.opacity    = '0';

      /* Force reflow so the reset state is painted */
      void emblemImg.offsetWidth;

      /* Animate stamp: scale 1.1 → 1.0, opacity 0 → 1 */
      emblemImg.style.transition = 'transform 200ms ease-out, opacity 200ms ease-out';
      emblemImg.style.transform  = 'scale(1.0)';
      emblemImg.style.opacity    = '1';

      /* Update definition — reset opacity before writing */
      defDiv.style.transition = 'none';
      defDiv.style.opacity    = '1';
      defDiv.innerHTML =
        '<p class="idef-head">' + e.head + '</p>' +
        '<p class="idef-body">' + e.body + '</p>';
    }

    /* Timeline --------------------------------------------------- */

    /* t=0:    FDRY at 120px, top-center (CSS default) — hold 0.5s  */

    /* t=500:  expand to 700px centered — 600ms ease-out motion      */
    sched(function () { if (!done) stage.classList.add('expanded'); }, 500);

    /* t=1500: FOUNDRY stamp + definition — hold to t=2700           */
    sched(function () { stamp(0); }, 1500);

    /* t=2700: DOMINION swap — hold to t=3700                        */
    sched(function () { stamp(1); }, 2700);

    /* t=3700: REGISTRY swap — hold to t=4700                        */
    sched(function () { stamp(2); }, 3700);

    /* t=4700: YIELD swap — hold to t=6100 (longest, the punchline)  */
    sched(function () { stamp(3); }, 4700);

    /* t=6100: fade emblem + text out (150ms)                        */
    sched(function () {
      if (done) return;
      emblemImg.style.transition = 'opacity 150ms ease-out';
      emblemImg.style.opacity    = '0';
      defDiv.style.transition    = 'opacity 150ms ease-out';
      defDiv.style.opacity       = '0';
    }, 6100);

    /* t=6400: contract logo back to 120px / top-center (600ms)      */
    sched(function () { if (!done) stage.classList.remove('expanded'); }, 6400);

    /* t=6800: begin overlay fade (200ms) to smooth handoff          */
    sched(function () {
      if (done) return;
      overlay.style.transition = 'opacity 200ms ease-out';
      overlay.style.opacity    = '0';
    }, 6800);

    /* t=7000: done — fire event, remove overlay                     */
    sched(function () {
      if (done) return;
      done = true;
      document.removeEventListener('keydown', abort, true);
      document.removeEventListener('click',   abort, true);
      overlay.remove();
      fireComplete();
    }, 7000);
  }

  /* ── Entry point ──────────────────────────────────────────────── */

  document.addEventListener('DOMContentLoaded', function () {
    if (shouldPlay()) {
      run();
    } else {
      /* Already played this session — fire event immediately       */
      fireComplete();
    }
  });

}());
