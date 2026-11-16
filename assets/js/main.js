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

  /* ---------- Modal ---------- */
  var modal = document.getElementById('modal');
  function openModal(p) {
    var L = p[lang];
    document.getElementById('modalImg').src = 'assets/img/projects/' + p.img;
    document.getElementById('modalImg').alt = L.t;
    document.getElementById('modalCat').textContent = L.c;
    document.getElementById('modalTitle').textContent = L.t;
    document.getElementById('modalDesc').textContent = L.d;
    if (modal.showModal) modal.showModal(); else modal.setAttribute('open', '');
  }
  /* Shared API for the 3D layer (assets/js/immersive.js) */
  window.PROPER = {
    projects: PROJECTS,
    openProject: function (id) {
      var p = PROJECTS.filter(function (x) { return x.id === id; })[0];
      if (p) openModal(p);
    }
  };

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
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    document.dispatchEvent(new CustomEvent('proper:lang', { detail: next }));
    try { localStorage.setItem('proper-lang', next); } catch (e) { /* storage unavailable */ }
  }
  document.getElementById('langToggle').addEventListener('click', function () { setLang(lang === 'en' ? 'ar' : 'en'); });

  /* ---------- 3D tilt on cards (mouse / pen only) ---------- */
  var finePointer = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && !reduce) {
    document.querySelectorAll('.card, .ai-card, .pillar, .value, .ind').forEach(function (el) {
      el.classList.add('tilt');
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
        el.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
        el.style.setProperty('--mx', ((x + 0.5) * 100).toFixed(1) + '%');
        el.style.setProperty('--my', ((y + 0.5) * 100).toFixed(1) + '%');
        el.classList.add('is-tilting');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
        el.classList.remove('is-tilting');
      });
    });
  }

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

  /* ---------- Init ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();
  var saved = null;
  try { saved = localStorage.getItem('proper-lang'); } catch (e) { /* ignore */ }
  var qs = new URLSearchParams(location.search).get('lang');
  if (qs === 'ar' || qs === 'en') saved = qs;
  if (saved === 'ar') setLang('ar'); else renderProjects();
  observeReveals();
})();
