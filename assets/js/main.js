/* Proper Developments — site interactions */
(function () {
  'use strict';

  /* ---------- Projects data (edit here to add / change projects) ---------- */
  var PROJECTS = [
    { id: 'lexus', img: 'lexus-showroom.jpg', cat: 'tech', wide: true,
      en: { t: 'Lexus Flagship Showroom', c: 'AV Solutions · Exhibitions', d: 'Flagship automotive showroom featuring integrated display walls and brand media, delivered as a turnkey AV and experiential fit-out.' },
      ar: { t: 'صالة عرض لكزس الرئيسية', c: 'حلول سمعية وبصرية · معارض', d: 'صالة عرض رئيسية للسيارات تضم جدران عرض متكاملة ووسائط للعلامة التجارية، نُفذت كحل متكامل للأنظمة السمعية والبصرية والتجربة التفاعلية.' } },
    { id: 'aramco', img: 'aramco-sail.jpg', cat: 'tech',
      en: { t: 'Aramco Sail', c: 'AV Solutions · Command & Control', d: 'Technology integration featuring large-format LED and immersive display environments.' },
      ar: { t: 'أرامكو سيل', c: 'حلول سمعية وبصرية · القيادة والتحكم', d: 'تكامل تقني يضم شاشات LED كبيرة الحجم وبيئات عرض غامرة.' } },
    { id: 'hospital', img: 'hospital-medical-college.jpg', cat: 'dev',
      en: { t: 'Private Hospital Extension & Medical College', c: 'Project Development', d: 'Healthcare and education development combining a hospital extension with a new medical college.' },
      ar: { t: 'توسعة مستشفى خاص وكلية طبية', c: 'تطوير المشاريع', d: 'مشروع صحي وتعليمي يجمع بين توسعة مستشفى وإنشاء كلية طبية جديدة.' } },
    { id: 'binsulaiman', img: 'bin-sulaiman.jpg', cat: 'con',
      en: { t: 'Bin Sulaiman Business Center', c: 'Construction', d: 'Multi-storey commercial business center with a distinctive façade.' },
      ar: { t: 'مركز بن سليمان للأعمال', c: 'الإنشاءات', d: 'مركز أعمال تجاري متعدد الطوابق بواجهة مميزة.' } },
    { id: 'hq', img: 'hq-business-park.jpg', cat: 'dev',
      en: { t: 'The Headquarters Business Park', c: 'Project Development', d: 'Landmark business park on Jeddah’s Corniche Road — and home to Proper Developments’ head office.' },
      ar: { t: 'مجمع ذا هيدكوارترز للأعمال', c: 'تطوير المشاريع', d: 'مجمع أعمال بارز على طريق الكورنيش في جدة، ويضم المقر الرئيسي لشركة بروبر للتطوير.' } },
    { id: 'salheah', img: 'al-salheah.jpg', cat: 'con',
      en: { t: 'Al-Salheah Building', c: 'Construction', d: 'Contemporary building with a terracotta-toned screened façade.' },
      ar: { t: 'مبنى الصالحية', c: 'الإنشاءات', d: 'مبنى معاصر بواجهة ذات ستائر معمارية بلون التيراكوتا.' } },
    { id: 'highmark', img: 'high-mark.jpg', cat: 'dev',
      en: { t: 'High Mark', c: 'Project Development', d: 'Retail-led interior development with a mezzanine and open display floor.' },
      ar: { t: 'هاي مارك', c: 'تطوير المشاريع', d: 'مشروع داخلي تجاري يضم طابقاً علوياً (ميزانين) ومساحة عرض مفتوحة.' } },
    { id: 'madinah', img: 'madinah-office.jpg', cat: 'dev',
      en: { t: 'Madinah Office Building', c: 'Project Development', d: 'Boutique office building with landscaped terraces.' },
      ar: { t: 'مبنى مكاتب المدينة', c: 'تطوير المشاريع', d: 'مبنى مكاتب مميز بشرفات مزروعة.' } },
    { id: 'tewergi', img: 'tewergi.jpg', cat: 'con',
      en: { t: 'Tewergi Mixed-Use Building', c: 'Construction', d: 'Mixed-use building with a media-ready glazed façade.' },
      ar: { t: 'مبنى التويرجي متعدد الاستخدامات', c: 'الإنشاءات', d: 'مبنى متعدد الاستخدامات بواجهة زجاجية مهيأة للوسائط الرقمية.' } },
    { id: 'juwan', img: 'al-juwan.jpg', cat: 'dev',
      en: { t: 'Al Juwan Residential Community', c: 'Project Development', d: 'Master-planned residential community.' },
      ar: { t: 'مجمع الجوان السكني', c: 'تطوير المشاريع', d: 'مجمع سكني وفق مخطط عام متكامل.' } },
    { id: 'suhail', img: 'suhail-al-riyadh.jpg', cat: 'dev',
      en: { t: 'Suhail Al Riyadh Community', c: 'Project Development', d: 'Residential community development in Riyadh.' },
      ar: { t: 'مجمع سهيل الرياض', c: 'تطوير المشاريع', d: 'مشروع مجمع سكني في الرياض.' } },
    { id: 'kec', img: 'kec-dar-al-jewar.jpg', cat: 'con',
      en: { t: 'KEC – Dar Al Jewar', c: 'Construction', d: 'Heritage-inspired arcaded interior with traditional architectural detailing.' },
      ar: { t: 'KEC – دار الجوار', c: 'الإنشاءات', d: 'مساحة داخلية بأقواس مستوحاة من التراث وتفاصيل معمارية تقليدية.' } }
  ];

  var html = document.documentElement;
  var lang = 'en';
  var AR = window.PROPER_AR || {};
  var originals = new Map();
  var langHooks = []; // functions re-run after a language switch
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Projects grid ---------- */
  var grid = document.getElementById('pgrid');
  function renderProjects() {
    grid.innerHTML = '';
    PROJECTS.forEach(function (p) {
      var L = p[lang];
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'proj reveal' + (p.wide ? ' proj--wide' : '');
      b.dataset.cat = p.cat;
      b.dataset.id = p.id;
      b.innerHTML = '<img src="assets/img/projects/' + p.img + '" alt="" loading="lazy">' +
        '<span class="proj__info"><span class="proj__cat"></span><span class="proj__title"></span></span>';
      b.querySelector('.proj__cat').textContent = L.c;
      b.querySelector('.proj__title').textContent = L.t;
      b.setAttribute('aria-label', L.t);
      b.addEventListener('click', function () { openModal(p); });
      grid.appendChild(b);
    });
    applyFilter(currentFilter);
    observeReveals();
  }

  var currentFilter = 'all';
  function applyFilter(f) {
    currentFilter = f;
    grid.querySelectorAll('.proj').forEach(function (el) {
      el.classList.toggle('is-hidden', f !== 'all' && el.dataset.cat !== f);
      el.classList.toggle('proj--wide', f === 'all' && el.dataset.id === 'lexus');
    });
  }
  document.querySelectorAll('.filter').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter').forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      applyFilter(btn.dataset.filter);
    });
  });

  /* ---------- Immersive project viewer ---------- */
  var modal = document.getElementById('modal');
  var current = 0;
  function showProject(i) {
    current = (i + PROJECTS.length) % PROJECTS.length;
    var p = PROJECTS[current], L = p[lang];
    var img = document.getElementById('modalImg');
    img.style.animation = 'none'; void img.offsetWidth; img.style.animation = '';
    img.src = 'assets/img/projects/' + p.img;
    img.alt = L.t;
    document.getElementById('modalCat').textContent = L.c;
    document.getElementById('modalTitle').textContent = L.t;
    document.getElementById('modalDesc').textContent = L.d;
    document.getElementById('modalCount').textContent = String(current + 1).padStart(2, '0') + ' / ' + PROJECTS.length;
  }
  function openModal(p) {
    showProject(PROJECTS.indexOf(p));
    if (modal.showModal) { if (!modal.open) modal.showModal(); } else modal.setAttribute('open', '');
  }
  document.getElementById('modalPrev').addEventListener('click', function () { showProject(current - 1); });
  document.getElementById('modalNext').addEventListener('click', function () { showProject(current + 1); });
  modal.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') showProject(current - 1);
    if (e.key === 'ArrowRight') showProject(current + 1);
  });
  var touchX = null;
  modal.addEventListener('touchstart', function (e) { touchX = e.touches[0].clientX; }, { passive: true });
  modal.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) showProject(current + (dx < 0 ? 1 : -1));
    touchX = null;
  });
  document.getElementById('modalClose').addEventListener('click', function () { modal.close(); });
  modal.addEventListener('click', function (e) { if (e.target === modal) modal.close(); });

  /* ---------- Solution tabs ---------- */
  document.querySelectorAll('.tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-active'); tab.setAttribute('aria-selected', 'true');
      document.querySelectorAll('[data-panel]').forEach(function (p) { p.hidden = p.dataset.panel !== tab.dataset.tab; });
    });
  });

  /* ---------- Mobile nav ---------- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); });
  });

  /* ---------- Header shadow + active nav ---------- */
  var header = document.getElementById('header');
  window.addEventListener('scroll', function () { header.classList.toggle('is-scrolled', window.scrollY > 10); }, { passive: true });
  if ('IntersectionObserver' in window) {
    var links = {};
    nav.querySelectorAll('a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && links[e.target.id]) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove('is-active'); });
          links[e.target.id].classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) navObs.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealObs = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.12 }) : null;
  function observeReveals() {
    document.querySelectorAll('.reveal:not(.is-in)').forEach(function (el) {
      if (revealObs) revealObs.observe(el); else el.classList.add('is-in');
    });
  }
  document.querySelectorAll('.section__head, .card, .pillar, .ai-card, .step, .ind, .value, .about__media, .about__text, .spotlight__media, .exh__media, .form, .stat')
    .forEach(function (el) { el.classList.add('reveal'); });

  /* ---------- Counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.dataset.count, 10);
    var start = el.hasAttribute('data-plain') ? target - 19 : 0;
    var t0 = null, dur = 1400;
    function step(ts) {
      if (!t0) t0 = ts;
      var k = Math.min((ts - t0) / dur, 1);
      el.textContent = Math.round(start + (target - start) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (!reduce && 'IntersectionObserver' in window) {
    var cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { animateCount(e.target); cObs.unobserve(e.target); } });
    }, { threshold: 0.6 });
    document.querySelectorAll('[data-count]').forEach(function (el) { cObs.observe(el); });
  }

  /* ---------- Language (EN / AR) ---------- */
  function setLang(next) {
    lang = next;
    html.lang = next;
    html.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (!originals.has(el)) originals.set(el, el.innerHTML);
      var key = el.dataset.i18n;
      el.innerHTML = next === 'ar' && AR[key] ? AR[key] : originals.get(el);
    });
    document.title = next === 'ar' && AR['meta.title'] ? AR['meta.title'] : 'Proper Developments | Control Rooms, AI Enablement, AV, ICT & Exhibitions | Saudi Arabia';
    renderProjects();
    langHooks.forEach(function (fn) { fn(); });
    try { localStorage.setItem('proper-lang', next); } catch (e) { /* storage unavailable */ }
  }
  document.getElementById('langToggle').addEventListener('click', function () { setLang(lang === 'en' ? 'ar' : 'en'); });

  /* ---------- Contact form (mailto) ---------- */
  var form = document.getElementById('contactForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (f) {
      var bad = !f.value.trim() || (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) return;
    var d = new FormData(form);
    var subject = 'Website enquiry – ' + d.get('interest');
    var body = 'Name: ' + d.get('name') + '\nCompany: ' + d.get('company') + '\nEmail: ' + d.get('email') +
      '\nPhone: ' + d.get('phone') + '\nInterest: ' + d.get('interest') + '\n\n' + d.get('message');
    window.location.href = 'mailto:sales@properholding.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });

  /* =========================================================
     Interactive & immersive experience
     ========================================================= */
  var fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  function onVisible(el, cb, opts) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    new IntersectionObserver(function (es) { es.forEach(function (e) { cb(e.isIntersecting); }); }, opts || { threshold: 0.15 }).observe(el);
  }

  /* Scroll progress bar */
  var bar = document.getElementById('progress');
  function updateProgress() {
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty('--p', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* Hero: word-by-word title reveal */
  function splitWords(el) {
    if (reduce || !el) return;
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var w = document.createElement('span');
            w.className = 'w'; w.style.setProperty('--i', i++); w.textContent = part;
            frag.appendChild(w);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1) walk(n);
      });
    })(el);
  }
  var heroTitle = document.querySelector('.hero__title');
  originals.set(heroTitle, heroTitle.innerHTML); // keep the unsplit English title for language switching
  splitWords(heroTitle);
  langHooks.push(function () { splitWords(heroTitle); });

  /* Hero: selectable "worlds" with auto-play, parallax and cursor spotlight */
  var hero = document.querySelector('.hero');
  var slides = hero.querySelectorAll('.hero__slide');
  var worlds = hero.querySelectorAll('.world');
  var activeWorld = 0, worldTimer = null, WORLD_MS = 7000;
  hero.style.setProperty('--dur', WORLD_MS + 'ms');
  function setWorld(i) {
    activeWorld = (i + worlds.length) % worlds.length;
    slides.forEach(function (sl, k) { sl.classList.toggle('is-active', k === activeWorld); });
    worlds.forEach(function (w, k) {
      var on = k === activeWorld;
      w.classList.remove('is-active'); void w.offsetWidth; // restart progress bar
      w.classList.toggle('is-active', on);
      w.setAttribute('aria-selected', String(on));
    });
    schedule();
  }
  function schedule() {
    clearTimeout(worldTimer);
    if (reduce || hero.classList.contains('is-paused')) return;
    worldTimer = setTimeout(function () { setWorld(activeWorld + 1); }, WORLD_MS);
  }
  worlds.forEach(function (w, k) {
    w.addEventListener('click', function () {
      if (k === activeWorld) { var t = document.querySelector(w.dataset.href); if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
      else setWorld(k);
    });
  });
  hero.querySelector('.worlds').addEventListener('mouseenter', function () { hero.classList.add('is-paused'); clearTimeout(worldTimer); });
  hero.querySelector('.worlds').addEventListener('mouseleave', function () { hero.classList.remove('is-paused'); setWorld(activeWorld); });
  onVisible(hero, function (v) { if (v) schedule(); else clearTimeout(worldTimer); }, { threshold: 0 });
  if (fine && !reduce) {
    var raf = 0, mx = 0, my = 0;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      mx = e.clientX - r.left; my = e.clientY - r.top;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        hero.style.setProperty('--sx', mx + 'px');
        hero.style.setProperty('--sy', my + 'px');
        hero.style.setProperty('--px', ((mx / r.width) - 0.5).toFixed(3));
        hero.style.setProperty('--py', ((my / r.height) - 0.5).toFixed(3));
      });
    });
  }

  /* Cursor glow on dark sections */
  if (fine) {
    document.querySelectorAll('.dark').forEach(function (sec) {
      sec.addEventListener('pointermove', function (e) {
        var r = sec.getBoundingClientRect();
        sec.style.setProperty('--cx', (e.clientX - r.left) + 'px');
        sec.style.setProperty('--cy', (e.clientY - r.top) + 'px');
      });
      sec.addEventListener('pointerleave', function () { sec.style.setProperty('--cx', '-999px'); });
    });
  }

  /* Live operations wall (illustrative data) */
  var ops = document.getElementById('opswall');
  if (ops) {
    var FEED = {
      en: [['Camera 12 — crowd density normal', 0], ['Gate 3 — access granted', 0], ['Link Jeddah ⇄ Riyadh — 100% healthy', 0],
           ['Video wall switched to Incident layout', 1], ['Patrol unit 7 dispatched — Zone B', 1], ['Weather alert cleared — Dammam', 0],
           ['AI analytics — unattended object resolved', 1], ['Backup power test passed', 0], ['NOC — latency within SLA', 0]],
      ar: [['الكاميرا 12 — كثافة الحشود طبيعية', 0], ['البوابة 3 — تم منح الدخول', 0], ['الربط جدة ⇄ الرياض — سليم 100%', 0],
           ['تحويل جدار العرض إلى وضع الحوادث', 1], ['إرسال دورية 7 — المنطقة ب', 1], ['إلغاء تنبيه الطقس — الدمام', 0],
           ['تحليلات الذكاء الاصطناعي — معالجة جسم متروك', 1], ['نجاح اختبار الطاقة الاحتياطية', 0], ['مركز الشبكات — زمن الاستجابة ضمن الاتفاقية', 0]]
    };
    var feedEl = document.getElementById('owFeed'), feedI = 0;
    var canvas = document.getElementById('owCanvas'), ctx = canvas.getContext('2d');
    var series = []; for (var k = 0; k < 40; k++) series.push(6 + Math.sin(k / 4) * 1.5 + Math.random());
    var opsTimer = null, tickN = 0;
    var pad = function (n) { return String(n).padStart(2, '0'); };
    function now() { var d = new Date(); return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()); }
    function pushFeed() {
      var list = FEED[lang] || FEED.en, item = list[feedI++ % list.length];
      var li = document.createElement('li');
      li.innerHTML = '<span class="sev' + (item[1] ? ' sev--warn' : '') + '"></span><time dir="ltr"></time><span></span>';
      li.querySelector('time').textContent = now().slice(0, 5);
      li.lastChild.textContent = item[0];
      feedEl.insertBefore(li, feedEl.firstChild);
      while (feedEl.children.length > 4) feedEl.removeChild(feedEl.lastChild);
    }
    function drawChart() {
      var w = canvas.clientWidth, h = canvas.clientHeight, dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (canvas.width !== w * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      var max = 11, min = 3, step = w / (series.length - 1);
      ctx.beginPath();
      series.forEach(function (v, i) { var x = i * step, y = h - ((v - min) / (max - min)) * h; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
      ctx.strokeStyle = '#3fd0c9'; ctx.lineWidth = 2; ctx.stroke();
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
      var g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(63,208,201,.35)'); g.addColorStop(1, 'rgba(63,208,201,0)');
      ctx.fillStyle = g; ctx.fill();
    }
    function tick() {
      tickN++;
      document.getElementById('owClock').textContent = now();
      var last = series[series.length - 1];
      series.push(Math.max(4, Math.min(10.5, last + (Math.random() - 0.5) * 1.4)));
      series.shift();
      document.getElementById('owGbps').textContent = series[series.length - 1].toFixed(1);
      drawChart();
      if (tickN % 3 === 0) pushFeed();
      if (tickN % 4 === 0) { var c = document.getElementById('owCams'); c.textContent = (1240 + Math.floor(Math.random() * 12)).toLocaleString('en-US'); }
      if (tickN % 9 === 0) { var inc = document.getElementById('owInc'); inc.textContent = String(parseInt(inc.textContent, 10) + 1); }
    }
    pushFeed(); pushFeed(); pushFeed(); drawChart();
    onVisible(ops, function (v) {
      clearInterval(opsTimer);
      if (v) { tick(); opsTimer = setInterval(tick, 1000); }
    });
    langHooks.push(function () { feedEl.innerHTML = ''; pushFeed(); pushFeed(); pushFeed(); });
    ops.querySelectorAll('button.ow-tile').forEach(function (t) {
      t.addEventListener('click', function () {
        var on = !t.classList.contains('is-focus');
        ops.querySelectorAll('.ow-tile').forEach(function (o) { o.classList.remove('is-focus'); });
        t.classList.toggle('is-focus', on);
        t.setAttribute('aria-pressed', String(on));
        setTimeout(drawChart, 260);
      });
    });
  }

  /* AI vision: before / after slider */
  var aiv = document.querySelector('.aivision');
  if (aiv) {
    var stage = document.getElementById('aivStage'), handle = document.getElementById('aivHandle');
    var touched = false, split = 50;
    function setSplit(v) {
      split = Math.max(0, Math.min(100, v));
      stage.style.setProperty('--split', split + '%');
      handle.setAttribute('aria-valuenow', Math.round(split));
    }
    function fromEvent(e) { var r = stage.getBoundingClientRect(); setSplit(((e.clientX - r.left) / r.width) * 100); }
    var dragging = false;
    stage.addEventListener('pointerdown', function (e) { dragging = true; touched = true; stage.setPointerCapture(e.pointerId); fromEvent(e); });
    stage.addEventListener('pointermove', function (e) { if (dragging) fromEvent(e); });
    stage.addEventListener('pointerup', function () { dragging = false; });
    stage.addEventListener('pointercancel', function () { dragging = false; });
    handle.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { setSplit(split - 5); touched = true; e.preventDefault(); }
      if (e.key === 'ArrowRight') { setSplit(split + 5); touched = true; e.preventDefault(); }
    });
    aiv.querySelectorAll('.aiv-mode').forEach(function (b) {
      b.addEventListener('click', function () {
        aiv.querySelectorAll('.aiv-mode').forEach(function (o) { o.classList.toggle('is-active', o === b); });
        aiv.classList.toggle('mode-heat', b.dataset.mode === 'heat');
      });
    });
    var demoed = false;
    onVisible(aiv, function (v) {
      if (!v) return;
      aiv.classList.add('is-live');
      if (demoed || reduce) return;
      demoed = true;
      // short guided sweep so visitors discover the slider
      var t0 = null, keys = [[0, 50], [900, 12], [1900, 72], [2700, 45]];
      (function anim(ts) {
        if (touched) return;
        if (!t0) t0 = ts;
        var t = ts - t0, i = 1;
        while (i < keys.length && keys[i][0] < t) i++;
        if (i >= keys.length) { setSplit(45); return; }
        var a = keys[i - 1], b2 = keys[i], k2 = (t - a[0]) / (b2[0] - a[0]);
        k2 = k2 < 0.5 ? 2 * k2 * k2 : 1 - Math.pow(-2 * k2 + 2, 2) / 2;
        setSplit(a[1] + (b2[1] - a[1]) * k2);
        requestAnimationFrame(anim);
      })(performance.now());
    }, { threshold: 0.45 });
  }

  /* Project tour: vertical scroll drives a horizontal journey */
  var tour = document.getElementById('tour');
  var track = document.getElementById('tourTrack');
  var tourMax = 0;
  function buildTour() {
    var AR_ = lang === 'ar';
    track.innerHTML = '';
    PROJECTS.forEach(function (p, i) {
      var L = p[lang];
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'tour-card';
      b.innerHTML = '<img src="assets/img/projects/' + p.img + '" alt="" loading="lazy"><span class="tour-card__info">' +
        '<span class="tour-card__n"></span><span class="tour-card__t"></span><span class="tour-card__d"></span><span class="tour-card__go"></span></span>';
      b.querySelector('.tour-card__n').textContent = String(i + 1).padStart(2, '0') + ' · ' + L.c;
      b.querySelector('.tour-card__t').textContent = L.t;
      b.querySelector('.tour-card__d').textContent = L.d;
      b.querySelector('.tour-card__go').textContent = AR_ ? 'عرض المشروع' : 'View project';
      b.addEventListener('click', function () { openModal(p); });
      track.appendChild(b);
    });
    var end = document.createElement('div');
    end.className = 'tour-card tour-card--end';
    end.innerHTML = '<div><h3></h3><a class="btn btn--accent" href="#contact"></a></div>';
    end.querySelector('h3').textContent = AR_ ? 'مشروعك القادم يبدأ هنا' : 'Your next project starts here';
    end.querySelector('a').textContent = AR_ ? 'تحدث مع فريقنا' : 'Talk to our team';
    track.appendChild(end);
    document.getElementById('tourTotal').textContent = PROJECTS.length;
    layoutTour();
  }
  function pinnable() { return window.innerWidth >= 900 && !reduce; }
  function layoutTour() {
    var native = !pinnable();
    tour.classList.toggle('is-native', native);
    track.style.transform = '';
    if (native) { tour.style.height = ''; return; }
    tourMax = Math.max(0, track.scrollWidth - window.innerWidth);
    tour.style.height = (tourMax + window.innerHeight) + 'px';
    updateTour();
  }
  var cards = function () { return track.querySelectorAll('.tour-card'); };
  function setTourProgress(p) {
    document.getElementById('tourBar').style.setProperty('--t', p.toFixed(4));
    var n = Math.min(PROJECTS.length, Math.max(1, Math.round(p * (PROJECTS.length - 1)) + 1));
    document.getElementById('tourNow').textContent = String(n).padStart(2, '0');
  }
  function updateTour() {
    if (tour.classList.contains('is-native')) return;
    var r = tour.getBoundingClientRect();
    var total = tour.offsetHeight - window.innerHeight;
    var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    var x = p * tourMax * (lang === 'ar' ? 1 : -1);
    track.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
    var vw = window.innerWidth;
    cards().forEach(function (c) {
      var cr = c.getBoundingClientRect();
      var off = ((cr.left + cr.width / 2) / vw - 0.5); // -0.5..0.5 across the screen
      var img = c.querySelector('img');
      if (img) img.style.setProperty('--shift', (off * -60).toFixed(1) + 'px');
    });
    setTourProgress(p);
  }
  document.getElementById('tourViewport').addEventListener('scroll', function () {
    if (!tour.classList.contains('is-native')) return;
    var v = this, max = v.scrollWidth - v.clientWidth;
    setTourProgress(max > 0 ? Math.abs(v.scrollLeft) / max : 0);
  }, { passive: true });
  window.addEventListener('scroll', function () { requestAnimationFrame(updateTour); }, { passive: true });
  window.addEventListener('resize', layoutTour);
  window.addEventListener('load', layoutTour);
  langHooks.push(buildTour);
  buildTour();

  /* Process timeline fills as you scroll */
  var steps = document.querySelector('.steps');
  if (steps) {
    var stepEls = steps.querySelectorAll('.step');
    var updateSteps = function () {
      var r = steps.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (window.innerHeight * 0.8 - r.top) / (r.height + window.innerHeight * 0.3)));
      steps.style.setProperty('--fill', p.toFixed(3));
      stepEls.forEach(function (s2, i) { s2.classList.toggle('is-lit', p >= i / (stepEls.length - 1) - 0.001 && p > 0.02); });
    };
    window.addEventListener('scroll', function () { requestAnimationFrame(updateSteps); }, { passive: true });
    updateSteps();
  }

  /* ---------- Init ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
  var saved = null;
  try { saved = localStorage.getItem('proper-lang'); } catch (e) { /* ignore */ }
  var qs = new URLSearchParams(location.search).get('lang');
  if (qs === 'ar' || qs === 'en') saved = qs;
  if (saved === 'ar') setLang('ar'); else renderProjects();
  observeReveals();
  updateProgress();
})();
