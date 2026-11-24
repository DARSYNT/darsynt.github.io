// Словари локализации и переключение языка (RU / EN)
(function () {
  'use strict';

  var STORAGE_KEY = 'darsynt-lang';
  var SUPPORTED = ['ru', 'en'];

  var dict = {
    en: {
      'meta.title': 'DARSYNT — Software • Games • Apps',
      'meta.desc': 'DARSYNT is an independent developer brand building software, games and apps. Kazakhstan.',
      'skip': 'Skip to content',
      'nav.home': 'Home', 'nav.projects': 'Projects', 'nav.about': 'About', 'nav.contact': 'Contact',
      'hero.eyebrow': 'Independent developer brand',
      'hero.lead': 'We build tools, games and applications — from technical utilities for professionals to interactive simulators.',
      'hero.cta': 'View projects',
      'hero.scroll': 'Scroll to projects',
      'projects.title': 'Projects',
      'projects.sub': 'Current work. Everything here is under active development.',
      'status.dev': 'In development',
      'p1.desc': 'A program for calculating and designing LED screens: power, signal routing and layout.',
      'p1.tag': 'Software',
      'p2.desc': 'A tool for diagnosing network video signals.',
      'p2.tag': 'Developer tool',
      'p3.desc': 'A simulator of a concert technical production company.',
      'p3.tag': 'Game',
      'about.title': 'About',
      'about.lead': 'DARSYNT is an independent software, games and apps developer based in Kazakhstan.',
      'about.text': 'We focus on practical products with clean interfaces and solid engineering — and on the tools that make building them faster.',
      'about.software': 'Desktop programs for real professional tasks.',
      'about.games': 'Simulators and interactive experiences.',
      'about.apps': 'Applications for everyday and specialised use.',
      'about.tools': 'Utilities for diagnostics and development workflows.',
      'contact.title': 'Contact',
      'contact.sub': 'Find DARSYNT here.',
      'footer.rights': 'All rights reserved.'
    },
    ru: {
      'meta.title': 'DARSYNT — Software • Games • Apps',
      'meta.desc': 'DARSYNT — независимый бренд разработчика программного обеспечения, игр и приложений. Казахстан.',
      'skip': 'Перейти к содержимому',
      'nav.home': 'Главная', 'nav.projects': 'Проекты', 'nav.about': 'О нас', 'nav.contact': 'Контакты',
      'hero.eyebrow': 'Независимый разработчик',
      'hero.lead': 'Мы создаём инструменты, игры и приложения — от технических утилит для профессионалов до интерактивных симуляторов.',
      'hero.cta': 'Смотреть проекты',
      'hero.scroll': 'Перейти к проектам',
      'projects.title': 'Проекты',
      'projects.sub': 'Текущие работы. Все проекты находятся в активной разработке.',
      'status.dev': 'В разработке',
      'p1.desc': 'Программа расчёта и проектирования LED-экранов: питание, маршрутизация сигнала и раскладка.',
      'p1.tag': 'Программа',
      'p2.desc': 'Инструмент диагностики сетевых видеосигналов.',
      'p2.tag': 'Инструмент разработчика',
      'p3.desc': 'Симулятор концертно-технической компании.',
      'p3.tag': 'Игра',
      'about.title': 'О нас',
      'about.lead': 'DARSYNT — независимый разработчик программного обеспечения, игр и приложений из Казахстана.',
      'about.text': 'Мы делаем практичные продукты с чистым интерфейсом и надёжной инженерной основой — и инструменты, которые ускоряют их создание.',
      'about.software': 'Программы для реальных профессиональных задач.',
      'about.games': 'Симуляторы и интерактивные проекты.',
      'about.apps': 'Приложения для повседневных и специальных задач.',
      'about.tools': 'Утилиты для диагностики и процессов разработки.',
      'contact.title': 'Контакты',
      'contact.sub': 'DARSYNT в сети.',
      'footer.rights': 'Все права защищены.'
    }
  };

  function detect() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* хранилище недоступно */ }
    if (SUPPORTED.indexOf(saved) !== -1) return saved;
    var nav = (navigator.language || 'en').toLowerCase();
    return /^(ru|kk|be|uk)/.test(nav) ? 'ru' : 'en';
  }

  function apply(lang) {
    var d = dict[lang];
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = d[el.getAttribute('data-i18n')];
      if (v !== undefined) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var v = d[el.getAttribute('data-i18n-aria')];
      if (v !== undefined) el.setAttribute('aria-label', v);
    });
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-set-lang') === lang));
    });

    document.title = d['meta.title'];
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', d['meta.desc']);
    var ogd = document.querySelector('meta[property="og:description"]');
    if (ogd) ogd.setAttribute('content', d['meta.desc']);
    var twd = document.querySelector('meta[name="twitter:description"]');
    if (twd) twd.setAttribute('content', d['meta.desc']);
    var ogl = document.querySelector('meta[property="og:locale"]');
    if (ogl) ogl.setAttribute('content', lang === 'ru' ? 'ru_RU' : 'en_US');
  }

  function set(lang) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* игнорируем */ }
    apply(lang);
  }

  document.addEventListener('DOMContentLoaded', function () {
    apply(detect());
    document.querySelectorAll('[data-set-lang]').forEach(function (b) {
      b.addEventListener('click', function () { set(b.getAttribute('data-set-lang')); });
    });
  });
})();
