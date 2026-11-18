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
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); } });
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

  /* ---------- Projects: filter ---------- */
  $$('.chip[data-filter]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.getAttribute('data-filter');
      $$('.chip[data-filter]').forEach(function (c) { c.classList.toggle('is-active', c === chip); });
      $$('#pgrid .pcard').forEach(function (card) {
        var show = f === '*' || card.getAttribute('data-cats').split('|').indexOf(f) > -1;
        card.classList.toggle('is-hidden', !show);
        if (show) card.classList.add('is-in');
      });
    });
  });

  /* ---------- Project viewer ---------- */
  var dataEl = $('#projectData'), viewer = $('#viewer');
  if (dataEl && viewer) {
    var DATA = JSON.parse(dataEl.textContent);
    var order = DATA.order, cur = 0, curImg = 0;
    var visibleOrder = function () {
      var ids = $$('.pcard:not(.is-hidden)').map(function (c) { return c.getAttribute('data-project'); });
      var uniq = ids.filter(function (id, i) { return ids.indexOf(id) === i; });
      return uniq.length ? uniq : order;
    };
    var list = order;
    var showImg = function (i) {
      var p = DATA.items[list[cur]];
      curImg = (i + p.i.length) % p.i.length;
      var im = $('#viewerImg');
      im.style.animation = 'none'; void im.offsetWidth; im.style.animation = '';
      im.src = DATA.base + p.i[curImg];
      im.alt = p.t;
      $$('#viewerThumbs button').forEach(function (b, k) { b.classList.toggle('is-active', k === curImg); });
    };
    var show = function (idx) {
      cur = (idx + list.length) % list.length;
      var p = DATA.items[list[cur]];
      $('#viewerCat').textContent = p.c;
      $('#viewerTitle').textContent = p.t;
      $('#viewerLoc').textContent = p.l;
      $('#viewerDesc').textContent = p.d;
      $('#viewerCount').textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(list.length).padStart(2, '0');
      var th = $('#viewerThumbs');
      th.innerHTML = '';
      if (p.i.length > 1) {
        p.i.forEach(function (src, k) {
          var b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('aria-label', AR ? 'الصورة ' + (k + 1) + ' من ' + p.i.length : 'Image ' + (k + 1) + ' of ' + p.i.length);
          b.innerHTML = '<img alt="" src="' + DATA.base + src + '">';
          b.addEventListener('click', function () { showImg(k); });
          th.appendChild(b);
        });
      }
      showImg(0);
    };
    $$('.pcard[data-project]').forEach(function (card) {
      card.addEventListener('click', function () {
        list = visibleOrder();
        show(list.indexOf(card.getAttribute('data-project')));
        if (!viewer.open) viewer.showModal();
      });
    });
    $('#viewerPrev').addEventListener('click', function () { show(cur - 1); });
    $('#viewerNext').addEventListener('click', function () { show(cur + 1); });
    $('#viewerClose').addEventListener('click', function () { viewer.close(); });
    viewer.addEventListener('click', function (e) { if (e.target === viewer) viewer.close(); });
    viewer.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') show(cur + (RTL ? -1 : 1));
      if (e.key === 'ArrowLeft') show(cur + (RTL ? 1 : -1));
    });
    var tx = null;
    viewer.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    viewer.addEventListener('touchend', function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) { var step = (RTL ? dx > 0 : dx < 0) ? 1 : -1, p = DATA.items[list[cur]]; if (p.i.length > 1) showImg(curImg + step); else show(cur + step); }
      tx = null;
    });
  }

  /* ---------- Contact form (opens the visitor's email app) ---------- */
  var form = $('#contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      $$('[required]', form).forEach(function (f) {
        var bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
        f.classList.toggle('is-invalid', bad);
        f.setAttribute('aria-invalid', String(bad));
        if (bad) ok = false;
      });
      if (!ok) { $('.is-invalid', form).focus(); return; }
      var d = new FormData(form);
      var L = AR ? ['الاسم: ', 'الجهة: ', 'البريد الإلكتروني: ', 'الهاتف: ', 'مجال الاهتمام: ', 'استفسار من الموقع — ']
                 : ['Name: ', 'Organisation: ', 'Email: ', 'Phone: ', 'Area of interest: ', 'Website enquiry — '];
      var body = [L[0] + d.get('name'), L[1] + d.get('company'), L[2] + d.get('email'), L[3] + d.get('phone'),
        L[4] + d.get('interest'), '', d.get('message')].join('\n');
      window.location.href = 'mailto:sales@properholding.com?subject=' + encodeURIComponent(L[5] + d.get('interest')) + '&body=' + encodeURIComponent(body);
    });
  }

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
