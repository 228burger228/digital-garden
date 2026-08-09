// Digital Garden — Floating Nav (hamburger + back-to-top + About modal)
//
// Include this on any page. Set `window.SITE_ROOT` BEFORE this script tag:
//   On the homepage:      <script>window.SITE_ROOT = '';</script>
//   On pages in articles/: <script>window.SITE_ROOT = '../';</script>
// If SITE_ROOT isn't set, it's assumed to be '' (homepage).

(function () {
  const ROOT = typeof window.SITE_ROOT === 'string' ? window.SITE_ROOT : '';
  const SCROLL_THRESHOLD = 260;

  const lang = (localStorage.getItem('language') || 'ru');
  const text = {
    ru: {
      menuLabel: 'Меню',
      home: '🏠 На главную',
      about: 'ℹ️ О сайте',
      topLabel: 'Наверх',
      aboutTitle: '🌱 О сайте',
      aboutBody: `
        <p><strong>Цифровой сад</strong> — это личный архив исследований: сюда попадают статьи,
        которые слишком длинные для соцсетей и слишком личные для рабочих отчётов.</p>
        <p>Здесь я собираю разборы технологий, дизайна и других тем, в которые погружаюсь —
        от рыночной аналитики до методологии обучения визуальному вкусу. Сайт растёт органически:
        без ленты и хронологии, просто заметки и статьи, которые можно найти через поиск или фильтр по категориям.</p>
        <p>Никакой рекламы и трекеров — просто место для мыслей, чтобы к ним можно было вернуться.</p>
      `
    },
    en: {
      menuLabel: 'Menu',
      home: '🏠 Home',
      about: 'ℹ️ About',
      topLabel: 'Back to top',
      aboutTitle: '🌱 About this site',
      aboutBody: `
        <p><strong>Digital Garden</strong> is a personal research archive: articles that are too long
        for social media and too personal for work reports end up here.</p>
        <p>It collects deep dives into technology, design, and whatever else I'm exploring —
        from market analysis to visual-literacy teaching methodology. The site grows organically,
        no feed or chronology — just notes and articles you can find through search or category filters.</p>
        <p>No ads, no trackers — just a place for ideas worth coming back to.</p>
      `
    }
  }[lang] || text_fallback();

  function text_fallback() {
    return {
      menuLabel: 'Меню', home: '🏠 На главную', about: 'ℹ️ О сайте', topLabel: 'Наверх',
      aboutTitle: '🌱 О сайте', aboutBody: '<p>Личный архив исследований и статей.</p>'
    };
  }

  function injectMarkup() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div id="floatingNav" class="floating-nav">
        <div id="floatingNavMenu" class="floating-nav-menu">
          <a href="${ROOT}index.html" class="floating-nav-item">${text.home}</a>
          <button id="aboutSiteBtn" class="floating-nav-item" type="button">${text.about}</button>
        </div>
        <button id="floatingNavToggle" class="floating-nav-btn" aria-label="${text.menuLabel}" type="button">☰</button>
      </div>
      <button id="backToTopBtn" class="back-to-top-btn" aria-label="${text.topLabel}" type="button">↑</button>

      <div id="aboutModal" class="site-modal">
        <div class="site-modal-overlay"></div>
        <div class="site-modal-content">
          <button class="site-modal-close" aria-label="Close">&times;</button>
          <h2>${text.aboutTitle}</h2>
          ${text.aboutBody}
        </div>
      </div>
    `;
    while (wrapper.firstElementChild) {
      document.body.appendChild(wrapper.firstElementChild);
    }
  }

  function init() {
    injectMarkup();

    const floatingNav = document.getElementById('floatingNav');
    const navToggle = document.getElementById('floatingNavToggle');
    const navMenu = document.getElementById('floatingNavMenu');
    const backToTop = document.getElementById('backToTopBtn');
    const aboutBtn = document.getElementById('aboutSiteBtn');
    const aboutModal = document.getElementById('aboutModal');
    const aboutClose = aboutModal.querySelector('.site-modal-close');
    const aboutOverlay = aboutModal.querySelector('.site-modal-overlay');

    // Show/hide on scroll
    function onScroll() {
      const scrolled = window.scrollY > SCROLL_THRESHOLD;
      floatingNav.classList.toggle('visible', scrolled);
      backToTop.classList.toggle('visible', scrolled);
      if (!scrolled) navMenu.classList.remove('open');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Toggle hamburger menu
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!floatingNav.contains(e.target)) navMenu.classList.remove('open');
    });

    // Back to top
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // About modal
    function openAbout() {
      aboutModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      navMenu.classList.remove('open');
    }
    function closeAbout() {
      aboutModal.classList.remove('active');
      document.body.style.overflow = '';
    }
    aboutBtn.addEventListener('click', openAbout);
    aboutClose.addEventListener('click', closeAbout);
    aboutOverlay.addEventListener('click', closeAbout);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && aboutModal.classList.contains('active')) closeAbout();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
