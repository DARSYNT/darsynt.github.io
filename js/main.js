// Поведение сайта: меню, подсветка разделов, появление блоков, фон hero
(function () {
  'use strict';

  document.documentElement.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.addEventListener('DOMContentLoaded', function () {
    var header = document.getElementById('header');
    var nav = document.getElementById('nav');
    var burger = document.getElementById('burger');
    document.getElementById('year').textContent = String(new Date().getFullYear());

    // Шапка получает фон после прокрутки
    function onScroll() { header.classList.toggle('is-stuck', window.scrollY > 24); }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Мобильное меню
    function closeMenu() { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

    // Активный пункт меню
    var links = Array.prototype.slice.call(nav.querySelectorAll('a'));
    var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); });
    if ('IntersectionObserver' in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id); });
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      secs.forEach(function (s) { if (s) spy.observe(s); });

      // Плавное появление блоков
      var rv = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); rv.unobserve(en.target); } });
      }, { threshold: 0.12 });
      // Задержка считается внутри группы соседних элементов, чтобы блоки появлялись каскадом
      document.querySelectorAll('.reveal').forEach(function (el) {
        var sibs = Array.prototype.filter.call(el.parentNode.children, function (n) { return n.classList.contains('reveal'); });
        el.style.setProperty('--d', Math.min(sibs.indexOf(el), 4) * 0.1 + 's');
        rv.observe(el);
      });
    } else {
      document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-in'); });
    }

    // Подсветка карточек под курсором
    document.querySelectorAll('.card').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    initBackground(document.getElementById('bg'));
  });

  // Фон: сеть светящихся узлов. Лёгкий canvas без библиотек.
  function initBackground(canvas) {
    var ctx = canvas.getContext('2d');
    if (!ctx) return;
    var hero = canvas.parentElement;
    var COLORS = ['0,212,255', '59,130,255', '155,92,255'];
    var nodes = [], pulses = [], w = 0, h = 0, dpr = 1, raf = 0, visible = true, mouse = { x: -999, y: -999 };

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.max(22, Math.min(70, Math.round(w * h / 22000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - .5) * .28, vy: (Math.random() - .5) * .28,
          r: Math.random() * 1.4 + .6, c: COLORS[i % 3]
        });
      }
      draw(false);
    }

    function draw(step) {
      ctx.clearRect(0, 0, w, h);
      var maxD = Math.min(150, Math.max(100, w / 9)), i, j, a, b, dx, dy, d, al;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        if (step) {
          a.x += a.vx; a.y += a.vy;
          if (a.x < 0 || a.x > w) a.vx *= -1;
          if (a.y < 0 || a.y > h) a.vy *= -1;
        }
        for (j = i + 1; j < nodes.length; j++) {
          b = nodes[j]; dx = a.x - b.x; dy = a.y - b.y; d = dx * dx + dy * dy;
          if (d < maxD * maxD) {
            al = (1 - Math.sqrt(d) / maxD) * .22;
            ctx.strokeStyle = 'rgba(' + a.c + ',' + al + ')';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        dx = a.x - mouse.x; dy = a.y - mouse.y; d = dx * dx + dy * dy;
        if (d < 180 * 180) {
          al = (1 - Math.sqrt(d) / 180) * .5;
          ctx.strokeStyle = 'rgba(0,212,255,' + al + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(' + a.c + ',.85)';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill();
      }

      // Световые импульсы, бегущие по связям между узлами
      if (step && pulses.length < 7 && Math.random() < 0.05) {
        a = nodes[(Math.random() * nodes.length) | 0];
        for (j = 0; j < nodes.length; j++) {
          b = nodes[j]; dx = a.x - b.x; dy = a.y - b.y;
          if (b !== a && dx * dx + dy * dy < maxD * maxD) { pulses.push({ a: a, b: b, t: 0 }); break; }
        }
      }
      for (i = pulses.length - 1; i >= 0; i--) {
        var p = pulses[i];
        if (step) p.t += 0.018;
        if (p.t >= 1) { pulses.splice(i, 1); continue; }
        var px = p.a.x + (p.b.x - p.a.x) * p.t, py = p.a.y + (p.b.y - p.a.y) * p.t;
        var g = ctx.createRadialGradient(px, py, 0, px, py, 9);
        g.addColorStop(0, 'rgba(' + p.a.c + ',.95)'); g.addColorStop(1, 'rgba(' + p.a.c + ',0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(px, py, 9, 0, 6.2832); ctx.fill();
      }
    }

    function loop() {
      if (!visible || document.hidden || reduce.matches) { raf = 0; return; }
      draw(true);
      raf = requestAnimationFrame(loop);
    }
    function start() { if (!raf && !reduce.matches) raf = requestAnimationFrame(loop); }

    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('pointerleave', function () { mouse.x = mouse.y = -999; });

    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(function () { resize(); start(); }, 150); });
    document.addEventListener('visibilitychange', start);
    reduce.addEventListener && reduce.addEventListener('change', function () { reduce.matches ? draw(false) : start(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible) start(); }).observe(hero);
    }
    resize();
    start();
  }
})();
