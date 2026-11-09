document.documentElement.classList.add('js');

/* =========================================================
   ЗАПИСЬ ЧЕРЕЗ DIKIDI (на самом сайте форм записи нет)
   Все кнопки «Записаться» открывают онлайн-запись салона в DIKIDI
   в новой вкладке:
   • обычные кнопки — экран «Выбрать услуги / Выбрать специалиста»;
   • «Записаться» у мастера — запись к этому мастеру;
   • кнопка с одной услугой («Хочу так же», квиз, консультация) —
     запись сразу на эту услугу;
   • кнопка с несколькими услугами (калькулятор) — шаг выбора услуг:
     DIKIDI не умеет отмечать несколько услуг по ссылке,
     поэтому клиент отмечает их сам.
   enabled: false — временно выключить все кнопки записи.
   ========================================================= */
const DIKIDI = { enabled: true, company: '1600464' };

// Мастер на сайте → id мастера в DIKIDI (сверено с dikidi.net/mibeauty 09.11.2026)
const DIKIDI_MASTERS = {
  'Елена': 3697480, 'Алла': 3730114, 'Виктория': 4003723,
  'Маргарита': 4186361, 'Саша': 4187010, 'Ирина': 4386037,
};

// id услуги на сайте → id услуги в DIKIDI (взяты из DIKIDI 08.11.2026)
const DIKIDI_IDS = {
  m1: 17191271, m2: 17191291, m3: 22899220, m4: 17191247, m5: 18110878, m6: 18110891, m7: 17191309, m8: 17191337,
  m9: 20050695, m10: 20044210, m11: 17191281, m12: 22899239, m13: 22899248, m14: 17191377, m15: 17191361, m16: 20055512,
  p1: 20044257, p2: 17203675, p3: 17203663, p4: 17191431, p5: 17203687, p6: 17833478, p7: 17833493, p8: 22899290, p9: 17833457,
  b1: 17203551, b2: 17203533, b3: 17203561, b4: 17203513, b5: 17203605, b6: 17203487, b7: 17203501, b8: 17203523,
  b9: 17190783, b10: 21857514, b11: 21857543, b12: 21857548,
  k1: 17232579, k2: 17232588, k3: 18481483, k4: 17232614, k5: 18481476, k6: 20055541,
  u0: 22108847, u1: 22108747, u2: 22108766, u3: 22108776, u4: 22108738, u5: 22108727, u6: 22108698, u7: 22108803,
  u8: 22108782, u9: 22108841, u10: 22108831, u11: 22108859, u12: 22108865, u13: 22108871, u14: 22108875,
};

// Ссылка на запись DIKIDI
function dikidiLink({ services = [], master = '' } = {}) {
  const base = `https://dikidi.net/ru/record/${DIKIDI.company}`;
  const masterId = DIKIDI_MASTERS[master];
  if (masterId) return `${base}?st_m=1&sm_m=${masterId}`;      // запись к мастеру
  const ids = services.map((id) => DIKIDI_IDS[id]).filter(Boolean);
  if (ids.length === 1) return `${base}?st_m=2&ss_s=${ids[0]}`; // одна услуга уже выбрана
  if (ids.length > 1) return `${base}?p=2.pi-po-ss&o=2`;        // шаг выбора услуг
  return `${base}?p=1.pi-po`;                                    // «Выбрать услуги / специалиста»
}

/* ---------- Данные: прайс (из DIKIDI) ---------- */
const CATEGORIES = [
  { id: 'manicure', name: 'Маникюр' },
  { id: 'pedicure', name: 'Педикюр' },
  { id: 'brows',    name: 'Брови и ресницы' },
  { id: 'makeup',   name: 'Макияж и укладки' },
  { id: 'pmu',      name: 'Перманент' },
];

// t — минуты; old — цена до скидки (акция ноября); from — «от»; tag — метка
const SERVICES = [
  { id: 'm1',  cat: 'manicure', name: 'Женский комбинированный маникюр без покрытия', price: 55, t: 60 },
  { id: 'm2',  cat: 'manicure', name: 'Мужской комбинированный маникюр', price: 60, t: 60 },
  { id: 'm3',  cat: 'manicure', name: 'Японский маникюр', price: 75, t: 75 },
  { id: 'm4',  cat: 'manicure', name: 'Маникюр + укрепление гелем + покрытие гель-лаком', note: 'снятие включено', price: 90, t: 120, tag: 'хит' },
  { id: 'm5',  cat: 'manicure', name: 'Маникюр + восстановление архитектуры + гель-лак', note: 'снятие включено', price: 100, t: 150 },
  { id: 'm6',  cat: 'manicure', name: 'Маникюр + покрытие гель-лаком + френч', note: 'снятие включено', price: 100, t: 120 },
  { id: 'm7',  cat: 'manicure', name: 'Наращивание ногтей', price: 120, t: 150 },
  { id: 'm8',  cat: 'manicure', name: 'Коррекция наращенных ногтей', price: 120, t: 150 },
  { id: 'm9',  cat: 'manicure', name: 'КОМПЛЕКС: маникюр + SMART-педикюр с покрытием гель-лаком', price: 165, t: 240, tag: 'выгодно' },
  { id: 'm10', cat: 'manicure', name: 'Покрытие цветным лаком', price: 15, t: 20 },
  { id: 'm11', cat: 'manicure', name: 'Снятие покрытия', price: 15, t: 20 },
  { id: 'm12', cat: 'manicure', name: 'Втирка', price: 10, t: 15 },
  { id: 'm13', cat: 'manicure', name: 'Градиент', price: 10, t: 20 },
  { id: 'm14', cat: 'manicure', name: 'Дизайн 1 ногтя', price: 1, t: 5, from: true },
  { id: 'm15', cat: 'manicure', name: 'Ремонт 1 ногтя', price: 5, t: 15 },
  { id: 'm16', cat: 'manicure', name: 'Наращивание 1 ногтя (не в комплексе)', price: 12, t: 15 },

  { id: 'p1', cat: 'pedicure', name: 'Комбинированный педикюр (только пальцы) без покрытия', price: 65, t: 60 },
  { id: 'p2', cat: 'pedicure', name: 'SMART-педикюр (стопы и пальцы) без покрытия', price: 75, t: 60 },
  { id: 'p3', cat: 'pedicure', name: 'Комбинированный педикюр (только пальцы) с гель-лаком', price: 85, t: 90 },
  { id: 'p4', cat: 'pedicure', name: 'SMART-педикюр (стопы и пальцы) с покрытием гель-лаком', price: 95, t: 120, tag: 'хит' },
  { id: 'p5', cat: 'pedicure', name: 'SMART-педикюр мужской (пальцы и стопы)', price: 100, t: 60 },
  { id: 'p6', cat: 'pedicure', name: 'КОМПЛЕКС: маникюр + SMART-педикюр без покрытия', price: 110, t: 120, tag: 'выгодно' },
  { id: 'p7', cat: 'pedicure', name: 'КОМПЛЕКС мужской: маникюр + SMART-педикюр', price: 140, t: 120 },
  { id: 'p8', cat: 'pedicure', name: 'Обработка стоп', price: 30, t: 20 },
  { id: 'p9', cat: 'pedicure', name: 'Уход: SMART-свеча + массаж', price: 20, t: 20 },

  { id: 'b1',  cat: 'brows', name: 'Женская коррекция бровей', price: 25, t: 30 },
  { id: 'b2',  cat: 'brows', name: 'Окрашивание бровей (краска)', price: 30, t: 30 },
  { id: 'b3',  cat: 'brows', name: 'Окрашивание ресниц', price: 30, t: 20 },
  { id: 'b4',  cat: 'brows', name: 'Коррекция и окрашивание бровей', price: 50, t: 30 },
  { id: 'b5',  cat: 'brows', name: 'Мужская коррекция бровей', price: 50, t: 20 },
  { id: 'b6',  cat: 'brows', name: 'Долговременная укладка бровей', price: 50, t: 30, from: true },
  { id: 'b7',  cat: 'brows', name: 'Долговременная укладка + коррекция', price: 55, t: 60 },
  { id: 'b8',  cat: 'brows', name: 'Долговременная укладка + окрашивание', price: 60, t: 60, from: true },
  { id: 'b9',  cat: 'brows', name: 'Долговременная укладка бровей (коррекция + окрашивание)', price: 70, t: 60, from: true, tag: 'хит' },
  { id: 'b10', cat: 'brows', name: 'Ламинирование ресниц с окрашиванием', price: 90, t: 60, tag: 'хит' },
  { id: 'b11', cat: 'brows', name: 'Ламинирование ресниц + коррекция и окрашивание бровей', price: 125, t: 90, tag: 'выгодно' },
  { id: 'b12', cat: 'brows', name: 'Ламинирование ресниц + ламинирование, коррекция, окрашивание бровей', price: 145, t: 120 },

  { id: 'k1', cat: 'makeup', name: 'Макияж нюдовый', price: 90, t: 60 },
  { id: 'k2', cat: 'makeup', name: 'Дневной макияж', price: 120, t: 60 },
  { id: 'k3', cat: 'makeup', name: 'Укладка', price: 120, t: 60 },
  { id: 'k4', cat: 'makeup', name: 'Вечерний макияж', price: 160, t: 60 },
  { id: 'k5', cat: 'makeup', name: 'Свадебный макияж', price: 200, t: 90 },
  { id: 'k6', cat: 'makeup', name: 'Полный образ (макияж + укладка)', price: 300, t: 150, tag: 'хит' },

  { id: 'u0',  cat: 'pmu', name: 'Консультация с отрисовкой эскиза', note: 'ответим на все вопросы', price: 0, t: 15, tag: 'бесплатно', tagStone: true },
  { id: 'u1',  cat: 'pmu', name: 'Межресничка без растушёвки', price: 250, old: 350, t: 60 },
  { id: 'u2',  cat: 'pmu', name: 'Межресничка с растушёвкой', price: 250, old: 350, t: 60 },
  { id: 'u3',  cat: 'pmu', name: 'Стрелки (с растушёвкой и без)', price: 290, old: 405, t: 60 },
  { id: 'u4',  cat: 'pmu', name: 'Губы (все техники)', price: 290, old: 405, t: 60, tag: 'хит' },
  { id: 'u5',  cat: 'pmu', name: 'Брови (все техники, кроме волосковой)', price: 290, old: 405, t: 70 },
  { id: 'u6',  cat: 'pmu', name: 'Брови (волосковая техника)', price: 340, old: 465, t: 70 },
  { id: 'u7',  cat: 'pmu', name: 'КОМБО #2: брови или губы + межресничка без растушёвки', price: 479, old: 695, t: 120 },
  { id: 'u8',  cat: 'pmu', name: 'КОМБО #1: брови и губы в любых техниках', price: 529, old: 750, t: 130, tag: 'выгодно' },
  { id: 'u9',  cat: 'pmu', name: 'КОМБО #4: брови, губы + межресничка без растушёвки', price: 769, old: 1099, t: 180 },
  { id: 'u10', cat: 'pmu', name: 'КОМБО #3: брови, губы + стрелки или межресничка с растушёвкой', price: 790, old: 1155, t: 180 },
  { id: 'u11', cat: 'pmu', name: 'Процедура коррекции (1 зона)', price: 150, t: 40 },
  { id: 'u12', cat: 'pmu', name: 'Процедура коррекции (2 зоны)', price: 300, t: 90 },
  { id: 'u13', cat: 'pmu', name: 'Процедура коррекции (3 зоны)', price: 450, t: 120 },
  { id: 'u14', cat: 'pmu', name: 'Ремувер (осветление старого PMU)', price: 150, t: 60 },
];

/* ---------- Данные: отзывы (DIKIDI) ---------- */
const REVIEWS = [
  { name: 'Sasha', date: '13 октября 2026', cat: 'nails', master: 'Саша', service: 'Маникюр + укрепление + гель-лак', text: 'Осталась в полном восторге от маникюра и посещения салона! Я обладательница экстремально длинных ногтей, поэтому для меня особенно важны правильная архитектура, идеальная форма и качество покрытия. Мастер Александра учла абсолютно все мои пожелания.' },
  { name: 'Aleksandra', date: '18 сентября 2026', cat: 'pmu', master: 'Ирина', service: 'Перманент губ', text: 'Мастер подобрала оттенок идеально под мой естественный тон кожи и повседневный образ, после процедуры восстановление прошло хорошо. Я абсолютно в восторге от результата!! 🥰 Спасибо большое, Ирина! ❤️' },
  { name: 'София', date: '13 сентября 2026', cat: 'brows', master: 'Виктория', service: 'Коррекция, окрашивание бровей', text: 'Мастер, который услышит ваш запрос и сделает с заботой. Брови для меня идеальные, как из моей головы) Благодарю, посещение подарило хорошее настроение и радость, когда смотрю в зеркало!' },
  { name: 'Анастасия', date: '16 сентября 2026', cat: 'nails', master: 'Алла', service: 'Маникюр + укрепление + гель-лак', text: 'Ходить к Алле — одно удовольствие)) Она всегда помнит все мои пожелания и особенности ногтей, понимает с полуслова. Маникюр всегда отличный. Огромное спасибо за чуткое отношение)' },
  { name: 'Анастасия', date: '17 мая 2026', cat: 'brows', master: 'Виктория', service: 'Ламинирование ресниц + брови', text: 'Шикарный специалист. Это был мой первый раз в ресницах и бровях. Виктория отнеслась с заботой и эмпатией. Всё было уютно и комфортно. Результатом очень довольна. Жду уже следующую встречу ❤️' },
  { name: 'Елена', date: '1 июня 2026', cat: 'nails', master: 'Елена', service: 'Маникюр + восстановление архитектуры', text: 'Была первый раз у мастера Елены, прекрасный мастер. Очень долго она исправляла ошибки моих неудачных походов к другим мастерам. Спасибо за терпение и классный маникюр, который оценила не только я, но и моё окружение 🌸 Любуюсь каждый день 🫶' },
  { name: 'Веснушка', date: '27 августа 2026', cat: 'makeup', master: 'Виктория', service: 'Полный образ (макияж + укладка)', text: 'Это великолепно 🤩' },
  { name: 'Елена', date: '23 октября 2026', cat: 'nails', master: 'Алла', service: 'Маникюр + укрепление + гель-лак', text: 'Как всегда — лучше всех! ❤️' },
  { name: 'Seraphima Rovdo', date: '23 сентября 2026', cat: 'nails', master: 'Маргарита', service: 'SMART-педикюр с покрытием', text: 'Очень понравился маникюр! Прекрасный мастер! Благодарю!)' },
  { name: 'Наталья', date: '13 мая 2026', cat: 'nails', master: 'Алла', service: 'Маникюр + укрепление + гель-лак', text: 'Быстрая и качественная работа! Очень внимательный мастер 😍 P.S. Отдельное спасибо всему персоналу за умение входить в положение 🙏🏼' },
  { name: 'Lisa', date: '20 января 2026', cat: 'nails', master: 'Елена', service: 'Комплекс маникюр + SMART-педикюр', text: 'Великолепно как всегда — и маникюр, и педикюр, огромное спасибо за массаж в педикюре, Елена. Порхаю как бабочка 🦋' },
  { name: 'Елена', date: '27 августа 2026', cat: 'nails', master: 'Алла', service: 'SMART-педикюр с покрытием', text: 'Профессионал своего дела!!! Великолепный маникюр, безупречный педикюр — всегда!!! 🫶🌺' },
  { name: 'Lisa', date: '20 апреля 2026', cat: 'nails', master: 'Маргарита', service: 'Маникюр + гель-лак + френч', text: 'Восхитительный френч 🥰 Благодарю, Маргарита' },
  { name: 'Lisa', date: '30 мая 2026', cat: 'nails', master: 'Саша', service: 'Маникюр + гель-лак + френч', text: 'Всё отлично 👍🏻 Форма просто вау 🤩' },
  { name: 'Анонимный отзыв', date: '9 декабря 2025', cat: 'brows', master: 'MIBEAUTY', service: 'Долговременная укладка бровей', text: 'Лучшие брови в моей жизни!' },
  { name: 'Алеся', date: '3 мая 2026', cat: 'nails', master: 'Маргарита', service: 'Маникюр + укрепление + гель-лак', text: 'Спасибо за самый качественный маникюр 💅' },
  { name: 'Елена', date: '12 октября 2026', cat: 'nails', master: 'Алла', service: 'SMART-педикюр с покрытием', text: 'Лучше не бывает!!! Как всегда! 🫶🔥' },
  { name: 'Веснушка', date: '21 февраля 2026', cat: 'nails', master: 'Саша', service: 'SMART-педикюр без покрытия', text: 'Не могу налюбоваться ♥️' },
  { name: 'Karzhetskaya Aleksandra', date: '13 января 2026', cat: 'nails', master: 'Маргарита', service: 'Коррекция наращенных ногтей', text: 'Самый лучший маникюр!' },
  { name: 'Анонимный отзыв', date: '12 октября 2026', cat: 'nails', master: 'Саша', service: 'Маникюр + укрепление + гель-лак', text: 'Как всегда великолепно 🥰😍' },
];

/* ---------- Данные: квиз ---------- */
const QUIZ = {
  nails: [
    { label: 'Аккуратный маникюр без покрытия', ids: ['m1'] },
    { label: 'Маникюр со стойким покрытием', ids: ['m4'] },
    { label: 'Маникюр и педикюр за один визит', ids: ['m9'] },
    { label: 'Длина — наращивание ногтей', ids: ['m7'] },
  ],
  brows: [
    { label: 'Аккуратная форма и цвет бровей', ids: ['b4'] },
    { label: 'Брови, которые держат форму', ids: ['b9'] },
    { label: 'Выразительные ресницы', ids: ['b10'] },
    { label: 'Брови + ресницы за один визит', ids: ['b12'] },
  ],
  makeup: [
    { label: 'Лёгкий макияж на каждый день', ids: ['k1'] },
    { label: 'Вечерний выход или фотосессия', ids: ['k4'] },
    { label: 'Свадебный образ', ids: ['k5'] },
    { label: 'Полный образ: макияж + укладка', ids: ['k6'] },
  ],
  pmu: [
    // book — что открывать в DIKIDI: перед перманентом записываем на бесплатную консультацию
    { label: 'Перманент бровей', ids: ['u0', 'u5'], book: ['u0'] },
    { label: 'Перманент губ', ids: ['u0', 'u4'], book: ['u0'] },
    { label: 'Межресничка или стрелки', ids: ['u0', 'u1'], book: ['u0'] },
    { label: 'Пока сомневаюсь — нужна консультация', ids: ['u0'] },
  ],
};

/* ---------- Helpers ---------- */
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const byId = Object.fromEntries(SERVICES.map((s) => [s.id, s]));
const fmtTime = (m) => {
  if (!m) return '—';
  const h = Math.floor(m / 60), mm = m % 60;
  return [h ? h + ' ч' : '', mm ? mm + ' мин' : ''].filter(Boolean).join(' ');
};
const fmtPrice = (s) => (s.price === 0 ? 'Бесплатно' : (s.from ? 'от ' : '') + s.price + ' BYN');
const esc = (str) => str.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* =========================================================
   Header, меню, мобильная панель
   ========================================================= */
(() => {
  const header = $('.header');
  const burger = $('#burger');
  const nav = $('#nav');
  const bar = $('.mobile-bar');
  const hero = $('.hero');

  const onScroll = () => {
    header.classList.toggle('is-scrolled', scrollY > 20);
    bar.classList.toggle('is-visible', scrollY > hero.offsetHeight * 0.7);
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.classList.toggle('is-locked', open);
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) setMenu(false); });

  // активный пункт меню
  const links = $$('a[href^="#"]', nav);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle('is-active', a.hash === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  links.forEach((a) => { const s = $(a.hash); s && spy.observe(s); });
})();

/* ---------- Появление при скролле ---------- */
const revealer = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); revealer.unobserve(en.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
function observeReveal(root = document) {
  $$('.reveal:not(.is-in)', root).forEach((el) => {
    const sib = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    el.style.transitionDelay = Math.min(sib.indexOf(el), 5) * 70 + 'ms';
    revealer.observe(el);
  });
}
observeReveal();

/* =========================================================
   Модальные окна
   ========================================================= */
const Modal = (() => {
  let lastFocus = null;
  let current = null;

  function open(id, opts = {}) {
    const m = document.getElementById(id);
    if (!m) return;
    if (current) close(false);
    lastFocus = document.activeElement;
    current = m;
    m.hidden = false;
    document.body.classList.add('is-locked');
    m.dispatchEvent(new CustomEvent('modal:open', { detail: opts }));
    const first = $('input:not([type=hidden]):not([type=radio]), select, button.modal__close', m);
    setTimeout(() => first && first.focus(), 50);
  }
  function close(restore = true) {
    if (!current) return;
    current.hidden = true;
    current.dispatchEvent(new CustomEvent('modal:close'));
    current = null;
    document.body.classList.remove('is-locked');
    if (restore && lastFocus) lastFocus.focus();
  }

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) {
      e.preventDefault();
      $('#fabMenu').hidden = true; $('#fabBtn').setAttribute('aria-expanded', 'false');
      open('modal-' + opener.dataset.open);
      return;
    }
    if (e.target.closest('[data-close]') || e.target.classList.contains('modal') || e.target.classList.contains('lightbox')) close();
  });
  addEventListener('keydown', (e) => {
    if (!current) return;
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') { // удерживаем фокус внутри окна
      const f = $$('button, a[href], input:not([type=hidden]), select', current).filter((el) => el.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  return { open, close };
})();

/* ---------- Лайтбокс ---------- */
document.addEventListener('click', (e) => {
  const z = e.target.closest('[data-zoom]');
  if (!z) return;
  const lb = $('#lightbox');
  $('img', lb).src = z.dataset.zoom;
  $('img', lb).alt = z.closest('.work')?.querySelector('h3')?.textContent || '';
  Modal.open('lightbox');
});

/* ---------- Кнопки записи (DIKIDI) ---------- */
function bookingServices(btn) {
  if (btn.id === 'calcBook') return Calc.selectedIds();
  return (btn.dataset.services || '').split(',').map((x) => x.trim()).filter(Boolean);
}
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-book]');
  if (!btn) return;
  e.preventDefault();
  $('#fabMenu').hidden = true; $('#fabBtn').setAttribute('aria-expanded', 'false');
  if (!DIKIDI.enabled) return; // запись выключена
  const url = dikidiLink({ services: bookingServices(btn), master: btn.dataset.master });
  const win = window.open(url, '_blank');
  if (win) win.opener = null;
  else location.href = url; // если браузер заблокировал новую вкладку — открываем в этой
});

/* =========================================================
   Калькулятор = прайс
   ========================================================= */
const Calc = (() => {
  const tabsEl = $('#calcTabs');
  const listEl = $('#calcList');
  const selected = new Set();
  let active = 'manicure';

  function renderTabs() {
    tabsEl.innerHTML = CATEGORIES.map((c) => {
      const n = SERVICES.filter((s) => s.cat === c.id && selected.has(s.id)).length;
      return `<button class="calc__tab${c.id === active ? ' is-active' : ''}" role="tab" aria-selected="${c.id === active}" data-cat="${c.id}">${c.name}${n ? `<span class="count">${n}</span>` : ''}</button>`;
    }).join('');
  }
  function renderList() {
    listEl.innerHTML = SERVICES.filter((s) => s.cat === active).map((s) => `
      <label class="calc-item">
        <input type="checkbox" value="${s.id}" ${selected.has(s.id) ? 'checked' : ''}>
        <span class="calc-item__box"><svg><use href="#i-check"/></svg></span>
        <span class="calc-item__name">${s.name}${s.tag ? `<span class="calc-item__tag${s.tagStone ? ' calc-item__tag--stone' : ''}">${s.tag}</span>` : ''}
          <small>${fmtTime(s.t)}${s.note ? ' · ' + s.note : ''}${s.old ? ' · акция ноября' : ''}</small></span>
        <span class="calc-item__price">${fmtPrice(s)}${s.old ? `<s>${s.old} BYN</s>` : ''}</span>
      </label>`).join('');
  }
  function renderSummary() {
    const items = [...selected].map((id) => byId[id]);
    const total = items.reduce((a, s) => a + s.price, 0);
    const time = items.reduce((a, s) => a + s.t, 0);
    const hasFrom = items.some((s) => s.from);
    $('#calcTotal').textContent = (hasFrom ? 'от ' : '') + total;
    $('#calcTime').textContent = fmtTime(time);
    $('#calcSelected').innerHTML = items.length
      ? items.map((s) => `<li><span>${s.name}</span><b>${fmtPrice(s)}</b></li>`).join('')
      : '<li class="is-empty">Пока ничего не выбрано</li>';

    // Подсказки о выгодных комплексах
    const hint = $('#calcHint');
    const has = (ids) => ids.some((id) => selected.has(id));
    let msg = '';
    if (has(['m4', 'm5', 'm6']) && selected.has('p4') && !selected.has('m9')) {
      const sum = Math.min(...['m4', 'm5', 'm6'].filter((id) => selected.has(id)).map((id) => byId[id].price)) + byId.p4.price;
      if (sum > 165) msg = `Выгоднее взять КОМПЛЕКС «маникюр + SMART-педикюр с покрытием» за 165 BYN — экономия ${sum - 165} BYN.`;
    } else if (selected.has('b10') && selected.has('b4') && !selected.has('b11')) {
      msg = 'Выгоднее взять комплекс «ламинирование ресниц + коррекция и окрашивание бровей» за 125 BYN — экономия 15 BYN.';
    } else if (items.some((s) => s.cat === 'pmu' && s.price > 0) && !selected.has('u0')) {
      msg = 'Перед перманентом рекомендуем бесплатную консультацию с отрисовкой эскиза.';
    }
    hint.hidden = !msg;
    hint.textContent = msg;

    // Что произойдёт по кнопке записи
    $('#calcDikidi').textContent = items.length === 0
      ? 'Отметьте процедуры — и запишитесь онлайн в DIKIDI.'
      : items.length === 1
        ? 'Откроется онлайн-запись DIKIDI с этой услугой — останется выбрать мастера и время.'
        : 'Откроется онлайн-запись DIKIDI: отметьте в ней эти же процедуры, затем выберите мастера и время.';
  }
  function render() { renderTabs(); renderList(); renderSummary(); }

  tabsEl.addEventListener('click', (e) => {
    const t = e.target.closest('.calc__tab');
    if (!t) return;
    active = t.dataset.cat;
    renderTabs(); renderList();
  });
  listEl.addEventListener('change', (e) => {
    const id = e.target.value;
    e.target.checked ? selected.add(id) : selected.delete(id);
    renderTabs(); renderSummary();
  });
  $('#calcReset').addEventListener('click', () => { selected.clear(); render(); });

  // Ссылки «Подробнее» / «Смотреть цены» открывают нужную вкладку
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-calc]');
    if (!a) return;
    active = a.dataset.calc === 'pedicure' ? 'pedicure' : a.dataset.calc;
    renderTabs(); renderList();
  });

  render();
  return { selectedIds: () => [...selected] };
})();

/* =========================================================
   Квиз
   ========================================================= */
(() => {
  const modal = $('#modal-quiz');
  const steps = $$('.quiz__step', modal);
  const bar = $('#quizBar');
  const counter = $('#quizCounter');
  const back = $('#quizBack');
  let step = 1;
  const answers = {};

  function go(n) {
    step = n;
    steps.forEach((s) => s.classList.toggle('is-active', +s.dataset.step === n));
    bar.style.width = n * 25 + '%';
    counter.textContent = n < 4 ? `Вопрос ${n} из 3` : 'Готово!';
    back.style.visibility = n > 1 ? 'visible' : 'hidden';
    const first = $('.quiz__step.is-active input', modal);
    first && setTimeout(() => first.focus({ preventScroll: true }), 30);
  }

  function renderQ2() {
    $('#quizQ2').innerHTML = QUIZ[answers.q1].map((o, i) =>
      `<label class="option"><input type="radio" name="q2" value="${i}"><span>${o.label}</span></label>`).join('');
  }

  function renderResult() {
    const choice = QUIZ[answers.q1][answers.q2];
    const items = choice.ids.map((id) => byId[id]);
    const total = items.reduce((a, s) => a + s.price, 0);
    $('#quizResult').innerHTML =
      items.map((s) => `<div class="quiz__result-item"><span>${s.name} · ${fmtTime(s.t)}</span><b>${fmtPrice(s)}</b></div>`).join('') +
      (items.length > 1 ? `<div class="quiz__result-item"><span><b>Итого</b></span><b>${total} BYN</b></div>` : '') +
      `<p class="quiz__result-note">${choice.book ? 'Перед перманентом — бесплатная консультация с эскизом: по кнопке откроется запись на неё. ' : ''}Удобное время: ${answers.q3.toLowerCase()} — в DIKIDI можно сразу отфильтровать свободные окна по времени суток.</p>`;
    // какие услуги будут отмечены в DIKIDI
    $('#quizBook').dataset.services = (choice.book || choice.ids).join(',');
  }

  modal.addEventListener('change', (e) => {
    const { name, value } = e.target;
    if (!/^q[123]$/.test(name)) return;
    answers[name] = name === 'q2' ? +value : value;
    if (name === 'q1') renderQ2();
    setTimeout(() => {
      if (name === 'q1') go(2);
      else if (name === 'q2') go(3);
      else { renderResult(); go(4); }
    }, 220);
  });
  back.addEventListener('click', () => go(Math.max(1, step - 1)));

  modal.addEventListener('modal:open', () => {
    // если тест уже пройден — начинаем заново
    if (step === 4) $$('input[type=radio]', modal).forEach((r) => (r.checked = false));
    if (step === 1 || step === 4) go(1);
  });
})();

/* =========================================================
   Отзывы: фильтр + «Показать ещё»
   ========================================================= */
(() => {
  const list = $('#reviewsList');
  const more = $('#reviewsMore');
  const PAGE = 6;
  let filter = 'all';
  let shown = PAGE;

  const star = '<svg><use href="#i-star"/></svg>';
  function render() {
    const items = REVIEWS.filter((r) => filter === 'all' || r.cat === filter);
    list.innerHTML = items.slice(0, shown).map((r) => `
      <figure class="review">
        <div class="review__head"><span class="review__avatar">${esc(r.name[0])}</span><div><b>${esc(r.name)}</b><time>${r.date}</time></div></div>
        <span class="stars" aria-label="5 из 5">${star.repeat(5)}</span>
        <p>${esc(r.text)}</p>
        <div class="review__service">${esc(r.service)} · мастер <b>${esc(r.master)}</b></div>
      </figure>`).join('');
    more.hidden = shown >= items.length;
  }
  $('#reviewFilters').addEventListener('click', (e) => {
    const b = e.target.closest('.filter');
    if (!b) return;
    filter = b.dataset.filter;
    shown = PAGE;
    $$('.filter').forEach((f) => { f.classList.toggle('is-active', f === b); f.setAttribute('aria-selected', String(f === b)); });
    render();
  });
  more.addEventListener('click', () => { shown += PAGE; render(); });
  render();
})();

/* ---------- Слайдер работ ---------- */
(() => {
  const track = $('#worksTrack');
  $$('[data-slide]').forEach((b) => b.addEventListener('click', () => {
    const card = $('.work', track);
    track.scrollBy({ left: (card.offsetWidth + 24) * +b.dataset.slide, behavior: 'smooth' });
  }));
})();

/* ---------- Плавающая кнопка связи ---------- */
(() => {
  const btn = $('#fabBtn'), menu = $('#fabMenu');
  btn.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open;
    btn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#fab')) { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
  });
})();

/* ---------- Cookie ---------- */
(() => {
  const c = $('#cookie');
  let accepted = false;
  try { accepted = localStorage.getItem('mb-cookie') === '1'; } catch (_) {}
  if (!accepted) setTimeout(() => (c.hidden = false), 1500);
  $('#cookieOk').addEventListener('click', () => {
    c.hidden = true;
    try { localStorage.setItem('mb-cookie', '1'); } catch (_) {}
  });
})();
