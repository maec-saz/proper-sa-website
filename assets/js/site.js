/* PROPER Developments — site behaviour (no dependencies) */
(function () {
  'use strict';
  var doc = document.documentElement;
  var AR = doc.lang === 'ar', RTL = doc.dir === 'rtl';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Header: solid after scrolling ---------- */
  var header = $('#siteHeader');
  function onScroll() { header.classList.toggle('is-solid', window.scrollY > 60); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu + capabilities sub-menu ---------- */
  var menuBtn = $('#menuBtn'), nav = $('#siteNav');
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    header.classList.toggle('is-solid', open || window.scrollY > 60);
  }
  // Everything a keyboard user can reach while the full-screen menu is open (visible items only).
  function menuStops() {
    return $$('#siteNav a, #siteNav button, .site-header .lang-switch, #menuBtn').filter(function (el) {
      return el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
    });
  }
  menuBtn.addEventListener('click', function () {
    var open = !nav.classList.contains('is-open');
    setMenu(open);
    if (open) { var first = $('#siteNav a'); if (first) first.focus({ preventScroll: true }); }
  });
  document.addEventListener('keydown', function (e) {
    if (!nav.classList.contains('is-open')) return;
    if (e.key === 'Escape') { setMenu(false); menuBtn.focus(); return; }
    if (e.key !== 'Tab') return;
    // Keep focus inside the open menu: wrap from the last stop to the first and back.
    var stops = menuStops(), i = stops.indexOf(document.activeElement);
    if (!stops.length) return;
    var next = e.shiftKey ? (i <= 0 ? stops.length - 1 : i - 1) : (i === -1 || i === stops.length - 1 ? 0 : i + 1);
    e.preventDefault();
    stops[next].focus();
  });
  $$('.nav__toggle').forEach(function (t) {
    t.addEventListener('click', function () {
      var item = t.closest('.has-mega'), open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      t.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- Cinematic hero ---------- */
  var hero = $('[data-hero]');
  if (hero) {
    var INTRO_MS = 9300;
    var finishIntro = function () {
      doc.classList.remove('is-intro');
      try { sessionStorage.setItem('proper-intro', '1'); } catch (e) { /* storage unavailable */ }
    };
    if (doc.classList.contains('is-intro')) {
      var t = setTimeout(finishIntro, INTRO_MS);
      $('#heroSkip').addEventListener('click', function () { clearTimeout(t); finishIntro(); });
    }
    // Optional drone film: plays only when configured, motion is allowed and the visitor isn't saving data.
    var src = hero.getAttribute('data-video');
    var conn = navigator.connection || {};
    if (src && !reduce && !conn.saveData && window.innerWidth >= 760) {
      var v = $('.hero__video', hero);
      var t0 = performance.now(), intro = doc.classList.contains('is-intro');
      v.src = src;
      // Keep the film in step with the intro text; repeat visits open on the façade shot.
      v.addEventListener('loadedmetadata', function () {
        var at = intro ? (performance.now() - t0) / 1000 : 6.6;
        if (at > 0.3 && at < v.duration - 1) v.currentTime = at;
      }, { once: true });
      v.addEventListener('playing', function () { hero.classList.add('has-video'); }, { once: true });
      v.play().catch(function () { /* autoplay blocked — the photo sequence remains */ });
    }
    // Pause the background motion when the hero is off-screen
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        var on = es[0].isIntersecting;
        $$('.hero__img, .hero__grain', hero).forEach(function (el) { el.style.animationPlayState = on ? 'running' : 'paused'; });
        var vid = $('.hero__video', hero);
        if (hero.classList.contains('has-video')) { if (on) vid.play().catch(function () {}); else vid.pause(); }
      }).observe(hero);
    }
  }

  /* ---------- Home: interactive capabilities list ---------- */
  var capItems = $$('.capx__item');
  if (capItems.length) {
    var figs = $$('.capx__fig');
    var setCap = function (i) {
      capItems.forEach(function (it, k) { it.classList.toggle('is-active', k === i); });
      figs.forEach(function (f, k) { f.classList.toggle('is-active', k === i); });
    };
    capItems.forEach(function (it, i) {
      it.addEventListener('mouseenter', function () { setCap(i); });
      it.addEventListener('focusin', function () { setCap(i); });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var ro = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); ro.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }
  // Keyboard focus never lands on content that hasn't faded in yet: reveal it at once, without the fade.
  document.addEventListener('focusin', function (e) {
    var el = e.target.closest && e.target.closest('[data-reveal]:not(.is-in)');
    while (el) {
      el.classList.add('is-in', 'is-instant');
      el = el.parentElement && el.parentElement.closest('[data-reveal]:not(.is-in)');
    }
  });

  /* ---------- Animated counters ---------- */
  var fmt = function (n, el) {
    var dec = +(el.getAttribute('data-dec') || 0), pad = +(el.getAttribute('data-pad') || 0);
    var s = n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
    return pad && s.length < pad ? ('0000' + s).slice(-pad) : s;
  };
  var counters = $$('[data-count]');
  counters.forEach(function (el) {
    var since = el.getAttribute('data-since');   // keeps "years of delivery" current without a rebuild
    if (since) el.setAttribute('data-count', String(new Date().getFullYear() - (+since)));
  });
  var runCount = function (el) {
    var to = parseFloat(el.getAttribute('data-count')), t0 = null, D = 1800;
    var step = function (ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / D, 1), k = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(to * k, el);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window && !reduce) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { co.unobserve(e.target); runCount(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { el.textContent = fmt(0, el); co.observe(el); });
  } else {
    counters.forEach(function (el) { el.textContent = fmt(parseFloat(el.getAttribute('data-count')), el); });
  }

  /* ---------- Live operations wall (simulated data) ---------- */
  var wall = $('[data-opswall]');
  if (wall) {
    var clocks = $$('[data-ow-clock]', wall), bars = $$('[data-ow-bar]', wall), barv = $$('[data-ow-barv]', wall);
    var logEl = $('[data-ow-log]', wall), tput = $('[data-ow-tput]', wall);
    var line = $('[data-ow-line]', wall), line2 = $('[data-ow-line2]', wall), area = $('[data-ow-area]', wall);
    var N = 48, A = [], B = [], seed = 0.55, live = false, timer = null, tick = 0;
    for (var i = 0; i < N; i++) { seed = Math.min(.92, Math.max(.25, seed + (Math.random() - .5) * .12)); A.push(seed); B.push(.25 + Math.random() * .2); }
    var EVENTS = [['Access granted · Gate 3', ''], ['Video wall layout “Incident” recalled', ''], ['NOC: link Riyadh ⇄ Jeddah latency 18 ms', 'ok'],
      ['Camera 12 motion detected · perimeter', 'warn'], ['GPU job #4471 completed · inference', 'ok'], ['Visitor badge issued · Lobby', ''],
      ['SOC: anomalous login blocked', 'warn'], ['UPS-B battery test passed', 'ok'], ['HVAC data hall setpoint 22.0 °C', ''],
      ['Shift handover acknowledged', ''], ['Backup replication complete · DR site', 'ok'], ['Crowd density threshold · Plaza', 'warn'],
      ['Dispatch unit 07 en route', ''], ['Firmware update scheduled · 02:00', '']];
    if (AR) EVENTS = [['تم منح الدخول · البوابة 3', ''], ['استدعاء مخطط جدار الفيديو «حادثة»', ''], ['مركز الشبكات: زمن الاستجابة بين الرياض وجدة 18 مللي ثانية', 'ok'],
      ['رصد حركة · الكاميرا 12 · المحيط الخارجي', 'warn'], ['اكتمال مهمة GPU رقم 4471 · استدلال', 'ok'], ['إصدار بطاقة زائر · الردهة', ''],
      ['مركز العمليات الأمنية: حظر محاولة دخول مشبوهة', 'warn'], ['نجاح اختبار بطارية UPS-B', 'ok'], ['ضبط حرارة قاعة البيانات على 22.0 °م', ''],
      ['تأكيد تسليم المناوبة', ''], ['اكتمال النسخ الاحتياطي · موقع التعافي من الكوارث', 'ok'], ['تجاوز حد الكثافة البشرية · الساحة', 'warn'],
      ['وحدة الإرسال 07 في الطريق', ''], ['جدولة تحديث البرنامج الثابت · 02:00', '']];
    var now = function () { return new Date().toLocaleTimeString('en-GB', { hour12: false, timeZone: 'Asia/Riyadh' }); };
    var path = function (arr, close) {
      var d = arr.map(function (v, k) { return (k ? 'L' : 'M') + (k * 300 / (N - 1)).toFixed(1) + ',' + (110 - v * 100).toFixed(1); }).join(' ');
      return close ? d + ' L300,110 L0,110 Z' : d;
    };
    var addLog = function () {
      var ev = EVENTS[Math.floor(Math.random() * EVENTS.length)], li = document.createElement('li');
      if (ev[1]) li.className = 'is-' + ev[1];
      li.innerHTML = '<time>' + now() + '</time><span></span>';
      li.lastChild.textContent = ev[0];
      logEl.insertBefore(li, logEl.firstChild);
      while (logEl.children.length > 9) logEl.removeChild(logEl.lastChild);
    };
    var update = function () {
      tick++;
      var t = now();
      clocks.forEach(function (c) { c.textContent = t; });
      seed = Math.min(.92, Math.max(.25, seed + (Math.random() - .5) * .14));
      A.push(seed); A.shift(); B.push(.22 + Math.random() * .22); B.shift();
      line.setAttribute('d', path(A)); area.setAttribute('d', path(A, true)); line2.setAttribute('d', path(B));
      tput.textContent = (seed * 40).toFixed(1) + (AR ? ' جيجابت/ث' : ' Gbps');
      if (tick % 2 === 1) bars.forEach(function (b, k) {
        var v = Math.round(55 + Math.random() * 44);
        b.style.width = v + '%'; b.classList.toggle('is-hot', v > 90); barv[k].textContent = v + '%';
      });
      if (tick % 3 === 0) addLog();
      var ev = $('[data-ow-kpi="2"]', wall);   // events processed keeps climbing once its counter has run
      if (ev && tick > 3) { ev.setAttribute('data-count', String(+ev.getAttribute('data-count') + Math.floor(Math.random() * 7))); ev.textContent = fmt(+ev.getAttribute('data-count'), ev); }
    };
    for (var j = 0; j < 6; j++) addLog();
    update();
    if (!reduce && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        live = es[0].isIntersecting;
        wall.classList.toggle('is-paused', !live);
        if (live && !timer) timer = setInterval(update, 1000);
        if (!live && timer) { clearInterval(timer); timer = null; }
      }, { threshold: 0.05 }).observe(wall);
    }
  }

  /* ---------- Contact form (opens the visitor's email app) ---------- */
  var form = $('#contactForm');
  if (form) {
    var status = $('#formStatus', form);
    var isBad = function (f) {
      var v = f.value.trim();
      if (f.required && !v) return true;
      if (f.type === 'email' && v && !/^\S+@\S+\.\S+$/.test(v)) return true;
      // Phone is optional; when given it must be a plausible number: digits with spaces, dashes, dots or brackets, 7–15 digits.
      if (f.type === 'tel' && v && (!/^\+?[\d\s().-]+$/.test(v) || v.replace(/\D/g, '').length < 7 || v.replace(/\D/g, '').length > 15)) return true;
      return false;
    };
    // Show or clear one field's error: style, message, and aria-invalid together.
    var mark = function (f, bad) {
      f.classList.toggle('is-invalid', bad);
      f.setAttribute('aria-invalid', String(bad));
      var msg = f.getAttribute('aria-describedby') && document.getElementById(f.getAttribute('aria-describedby'));
      if (msg) msg.hidden = !bad;
    };
    // Once a field has been flagged, re-check it as the visitor types so the error clears the moment it's fixed.
    form.addEventListener('input', function (e) {
      if (e.target.classList.contains('is-invalid')) mark(e.target, isBad(e.target));
      if (status) status.hidden = true;
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('input, textarea, select', form).forEach(function (f) {
        var bad = isBad(f);
        mark(f, bad);
        if (bad) ok = false;
      });
      if (!ok) { if (status) status.hidden = true; $('.is-invalid', form).focus(); return; }
      var d = new FormData(form);
      var L = AR ? ['الاسم: ', 'الجهة: ', 'البريد الإلكتروني: ', 'الهاتف: ', 'مجال الاهتمام: ', 'استفسار من الموقع — ']
                 : ['Name: ', 'Organisation: ', 'Email: ', 'Phone: ', 'Area of interest: ', 'Website enquiry — '];
      var body = [L[0] + d.get('name'), L[1] + d.get('company'), L[2] + d.get('email'), L[3] + d.get('phone'),
        L[4] + d.get('interest'), '', d.get('message')].join('\n');
      window.location.href = 'mailto:sales@properholding.com?subject=' + encodeURIComponent(L[5] + d.get('interest')) + '&body=' + encodeURIComponent(body);
      // Confirm on the page too: if no email app is set up, the visitor still sees what happened and how else to reach us.
      if (status) { status.hidden = false; status.focus({ preventScroll: false }); }
    });
  }

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
