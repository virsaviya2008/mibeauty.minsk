document.documentElement.classList.add('js');

(() => {
  const header = document.querySelector('.header');
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const mobileBar = document.querySelector('.mobile-bar');
  const hero = document.querySelector('.hero');

  /* ---------- Header shadow + mobile bar ---------- */
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
    mobileBar.classList.toggle('is-visible', window.scrollY > hero.offsetHeight * 0.6);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Burger menu ---------- */
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Active nav link ---------- */
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        links.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + en.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealer = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); revealer.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    el.style.transitionDelay = Math.min(siblings.indexOf(el), 5) * 70 + 'ms';
    revealer.observe(el);
  });

  /* ---------- Price tabs ---------- */
  const tabs = [...document.querySelectorAll('.tab')];
  const activateTab = (name, focus = false) => {
    tabs.forEach((t) => {
      const on = t.dataset.tab === name;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
      const panel = document.getElementById('tab-' + t.dataset.tab);
      panel.hidden = !on;
      panel.classList.toggle('is-active', on);
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activateTab(t.dataset.tab));
    t.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      activateTab(next.dataset.tab, true);
    });
  });
  // Links "Цены" in service cards open the matching tab
  document.querySelectorAll('a[data-tab]').forEach((a) => {
    a.addEventListener('click', () => activateTab(a.dataset.tab));
  });

  /* ---------- Gallery lightbox ---------- */
  const lb = document.getElementById('lightbox');
  const lbImg = lb.querySelector('img');
  let lastFocus = null;
  const closeLb = () => { lb.hidden = true; document.body.style.overflow = ''; lastFocus && lastFocus.focus(); };
  document.querySelectorAll('.gallery__item').forEach((item) => {
    item.addEventListener('click', () => {
      lastFocus = item;
      lbImg.src = item.dataset.full;
      lbImg.alt = item.querySelector('img').alt;
      lb.hidden = false;
      document.body.style.overflow = 'hidden';
      lb.querySelector('.lightbox__close').focus();
    });
  });
  lb.addEventListener('click', (e) => { if (e.target !== lbImg) closeLb(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

  /* ---------- Booking buttons (подключим позже) ---------- */
  const toast = document.getElementById('toast');
  let toastTimer;
  document.querySelectorAll('.js-book').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toast.textContent = 'Онлайн-запись скоро заработает. А пока звоните: +375 (29) 618-19-19';
      toast.classList.add('is-visible');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
    });
  });
})();
