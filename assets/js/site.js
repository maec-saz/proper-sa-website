/* PROPER Developments — site behaviour (no dependencies) */
(function () {
  'use strict';
  var doc = document.documentElement;
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
      v.src = src;
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
          b.setAttribute('aria-label', 'Image ' + (k + 1) + ' of ' + p.i.length);
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
      if (e.key === 'ArrowRight') show(cur + 1);
      if (e.key === 'ArrowLeft') show(cur - 1);
    });
    var tx = null;
    viewer.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    viewer.addEventListener('touchend', function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 50) { var p = DATA.items[list[cur]]; if (p.i.length > 1) showImg(curImg + (dx < 0 ? 1 : -1)); else show(cur + (dx < 0 ? 1 : -1)); }
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
      var body = ['Name: ' + d.get('name'), 'Organisation: ' + d.get('company'), 'Email: ' + d.get('email'), 'Phone: ' + d.get('phone'),
        'Area of interest: ' + d.get('interest'), '', d.get('message')].join('\n');
      window.location.href = 'mailto:sales@properholding.com?subject=' + encodeURIComponent('Website enquiry — ' + d.get('interest')) + '&body=' + encodeURIComponent(body);
    });
  }

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
