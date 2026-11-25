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

  /* ---------- Spotlight cards: a soft light follows the cursor (21st.dev "Spotlight Card") ---------- */
  if (window.matchMedia('(hover: hover)').matches) {
    $$('.svccard, .partner, .proj, .grp__specs a').forEach(function (el) {
      el.setAttribute('data-spot', '');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
      el.addEventListener('pointerenter', function () { el.classList.add('is-lit'); });
      el.addEventListener('pointerleave', function () { el.classList.remove('is-lit'); });
    });
  }

  /* ---------- Count-up figures when scrolled into view (21st.dev "Count Up") ---------- */
  var countups = $$('.projects__facts dt, .cap-over__count b');
  if (countups.length && !reduce && 'IntersectionObserver' in window) {
    countups.forEach(function (el) {
      var m = el.textContent.match(/^(\D*)([\d.,]+)(.*)$/);
      if (!m) return;
      var target = parseFloat(m[2].replace(/,/g, '')), dec = (m[2].split('.')[1] || '').length, pad = /^0\d/.test(m[2]) ? m[2].length : 0;
      el.setAttribute('data-countup', '');
      el.textContent = m[1] + (pad ? '0'.repeat(pad) : '0') + m[3];
      var io = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting) return; io.disconnect();
        var t0 = performance.now(), D = 1400;
        (function tick(now) {
          var k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3), v = target * e;
          var s = dec ? v.toFixed(dec) : String(Math.round(v));
          if (pad) s = ('0'.repeat(pad) + s).slice(-pad);
          el.textContent = m[1] + s + m[3];
          if (k < 1) requestAnimationFrame(tick);
        })(t0);
      }, { threshold: .6 });
      io.observe(el);
    });
  }

  /* ---------- Overview text lights up word by word as it scrolls (21st.dev "Reading Text Reveal") ---------- */
  var reveals = $$('.cap-over .cap-intro');
  if (reveals.length && !reduce) {
    reveals.forEach(function (el) {
      el.classList.add('wreveal');
      el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    });
    var paint = function () {
      var vh = window.innerHeight;
      reveals.forEach(function (el) {
        var r = el.getBoundingClientRect(), words = el.querySelectorAll('.w');
        var p = Math.max(0, Math.min(1, (vh * .9 - r.top) / (vh * .55 + r.height * .5)));
        var n = Math.round(p * words.length);
        for (var i = 0; i < words.length; i++) words[i].classList.toggle('is-on', i < n);
      });
    };
    window.addEventListener('scroll', paint, { passive: true });
    window.addEventListener('resize', paint);
    paint();
  }

  /* ---------- Company profiles: ask for name, email and company before opening ----------
     Details are kept in this browser so a returning visitor isn't asked again. If GATE_ENDPOINT is set
     (FormSubmit, forwarding to sales@properholding.com), each request is emailed to the team. */
  var GATE_ENDPOINT = 'https://formsubmit.co/ajax/sales@properholding.com';
  var gate = $('#docGate');
  if (gate && typeof gate.showModal === 'function') {
    var gForm = $('.gate__form', gate), gErr = $('.gate__err', gate), gDoc = $('[data-gate-doc]', gate), pending = null;
    var known = function () { try { return JSON.parse(localStorage.getItem('properDocGate') || 'null'); } catch (e) { return null; } };
    var openDoc = function (a) { window.open(a.href, '_blank', 'noopener'); };
    var send = function (who, doc) {
      if (!GATE_ENDPOINT) return;
      try { fetch(GATE_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ _subject: 'Company profile request: ' + (doc || ''), _template: 'table', _captcha: 'false', name: who.name, email: who.email, company: who.company, document: doc, page: location.href }) }); } catch (e) {}
    };
    $$('a[data-gated]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var who = known();
        if (who) { send(who, a.getAttribute('data-doc')); return; }     // already registered: open normally
        e.preventDefault(); pending = a;
        gDoc.textContent = a.getAttribute('data-doc'); gErr.hidden = true; gate.showModal();
        var first = $('input', gate); if (first) first.focus();
      });
    });
    $$('[data-gate-close]', gate).forEach(function (b) { b.addEventListener('click', function () { gate.close(); }); });
    gate.addEventListener('click', function (e) { if (e.target === gate) gate.close(); });
    gForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = gForm.elements, who = { name: f.namedItem('name').value.trim(), email: f.namedItem('email').value.trim(), company: f.namedItem('company').value.trim() };
      if (!who.name || !who.company || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(who.email)) { gErr.hidden = false; return; }
      try { localStorage.setItem('properDocGate', JSON.stringify(who)); } catch (err) {}
      send(who, pending && pending.getAttribute('data-doc'));
      gate.close();
      if (pending) openDoc(pending);
    });
  }

  /* ---------- Technology: scale the live dashboard to its gallery tile ---------- */
  var owFit = $('[data-ow-fit]');
  if (owFit) {
    var owWall = $('.opswall', owFit);
    var fitWall = function () {
      var sx = owFit.clientWidth / 1280, sy = owFit.clientHeight / owWall.offsetHeight;
      owFit.style.setProperty('--ow-s', Math.min(sx, sy).toFixed(4));
    };
    fitWall(); window.addEventListener('resize', fitWall);
    if ('ResizeObserver' in window) new ResizeObserver(fitWall).observe(owFit);
  }

  /* ---------- Home hero on phones: swipe slides with dots ---------- */
  var mxTrack = $('.mx__track');
  if (mxTrack) {
    var mxDots = $$('.mx__dots button');
    var mxIndex = function () { return Math.round(Math.abs(mxTrack.scrollLeft) / mxTrack.clientWidth); };
    mxTrack.addEventListener('scroll', function () {
      var i = mxIndex(); mxDots.forEach(function (b, k) { b.classList.toggle('is-on', k === i); b.setAttribute('aria-current', k === i ? 'true' : 'false'); });
    }, { passive: true });
    mxDots.forEach(function (b, k) {
      b.addEventListener('click', function () {
        var dir = getComputedStyle(mxTrack).direction === 'rtl' ? -1 : 1;
        mxTrack.scrollTo({ left: dir * k * mxTrack.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
  }

  /* ---------- Muted clips: play only while on screen (and never with reduced motion) ---------- */
  var clips = $$('video[data-autoplay]').filter(function (v) { return !v.closest('.pv'); });
  if (clips.length && !reduce && 'IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: .35 });
    clips.forEach(function (v) { vio.observe(v); });
  }

  /* ---------- Home hero: one image, six disciplines ----------
     At rest the hero shows one continuous photograph split into six strips, one per discipline.
     Nothing changes on its own or on hover: clicking (tapping) a strip opens that discipline full
     screen; clicking it again, the 'All disciplines' button or Escape returns to the six strips. The
     arrows step through the disciplines, and the caption links to the open discipline's page. */
  var pv = $('[data-pano]');
  if (pv) {
    var stage = $('.pv', pv), strips = $$('.pv__s', pv), caps = $$('.hp__cap', pv), countEl = $('.pv__count b', pv);
    var cur = -1, lastClick = 0;
    var show = function (i) {
      if (i === cur) return;
      cur = i;
      stage.classList.toggle('is-focus', i >= 0);
      strips.forEach(function (s, k) {
        s.classList.toggle('is-on', k === i);
        if (k === i) $$('img[data-src]', s).forEach(function (im) {   // load this mosaic on first open
          im.srcset = im.getAttribute('data-srcset'); im.src = im.getAttribute('data-src'); im.removeAttribute('data-src');
        });
        $$('video', s).forEach(function (v) {
          if (k === i && !reduce) { v.preload = 'auto'; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
          else v.pause();
        });
      });
      caps.forEach(function (c, k) { var on = k === i; c.classList.toggle('is-on', on); c.tabIndex = on ? 0 : -1; });
      if (countEl) countEl.textContent = i < 0 ? '00' : ('0' + (i + 1)).slice(-2);
      pv.classList.toggle('is-open', i >= 0);
    };
    strips.forEach(function (s, k) {
      // While a discipline is open, any click on the images returns to the six strips (even one that lands
      // on a neighbouring strip mid-animation); clicks within 350 ms are ignored so a double-click can't
      // open and immediately close.
      s.addEventListener('click', function (e) {
        e.preventDefault();
        var now = Date.now();
        if (now - lastClick < 350) return;
        lastClick = now;
        show(cur >= 0 ? -1 : k);
      });
    });
    $$('.pv__arrow', pv).forEach(function (b) {
      b.addEventListener('click', function () {
        var d = +b.getAttribute('data-step'), n = strips.length;
        show(cur < 0 ? (d > 0 ? 0 : n - 1) : (cur + d + n) % n);
      });
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && cur >= 0) show(-1); });
    var back = $('.pv__back', pv);
    if (back) back.addEventListener('click', function () { show(-1); });
    // Load every mosaic's photos once the page has settled (skipped with Data Saver), so opening a
    // discipline shows all six images straight away; opening one before then still loads it at once.
    var hydrate = function (im) { im.srcset = im.getAttribute('data-srcset'); im.src = im.getAttribute('data-src'); im.removeAttribute('data-src'); };
    var warm = function () {
      if (navigator.connection && navigator.connection.saveData) return;
      $$('.pv img[data-src]', pv).forEach(hydrate);
    };
    var warmLater = function () { setTimeout(function () { ('requestIdleCallback' in window) ? requestIdleCallback(warm, { timeout: 2500 }) : warm(); }, 1500); };
    if (document.readyState === 'complete') warmLater(); else window.addEventListener('load', warmLater);
    show(-1);
  }




  /* ---------- Home: capabilities accordion ----------
     Tapping a row opens its list of services (one open at a time) and shows its image;
     the arrow beside each row goes to that discipline's page. */
  var capItems = $$('.capx__item');
  if (capItems.length) {
    var figs = $$('.capx__fig');
    var setCap = function (i) {
      capItems.forEach(function (it, k) {
        var on = k === i;
        it.classList.toggle('is-active', on);
        $('.capx__toggle', it).setAttribute('aria-expanded', String(on));
      });
      if (i >= 0) figs.forEach(function (f, k) { f.classList.toggle('is-active', k === i); });
    };
    capItems.forEach(function (it, i) {
      $('.capx__toggle', it).addEventListener('click', function () {
        setCap(it.classList.contains('is-active') ? -1 : i);
      });
    });
  }


  /* ---------- Parallax: page-header photos and image bands drift slower than the page ---------- */
  var plx = $$('[data-parallax], .phero__media');
  if (plx.length && !reduce) {
    var ticking = false;
    var doPlx = function () {
      ticking = false;
      var vh = window.innerHeight;
      plx.forEach(function (el) {
        var r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var k = el.classList.contains('phero__media') ? 0.18 : 0.12;
        var y = (r.top + r.height / 2 - vh / 2) * -k;
        el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
      });
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(doPlx); } }, { passive: true });
    window.addEventListener('resize', doPlx);
    doPlx();
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
