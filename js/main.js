// Digital Garden — Main JavaScript

// ============================================================================
// Article Data Management
// ============================================================================

let allArticles = [];
let filteredArticles = [];
let selectedCategories = [];
let searchQuery = '';
let currentSort = 'date-desc';

// Parse frontmatter from article files
async function loadArticles() {
  try {
    // For now, articles will be loaded from a JSON file or defined here
    // In production, you might fetch from a data endpoint
    allArticles = await fetchArticlesList();
    return allArticles;
  } catch (error) {
    console.error('Error loading articles:', error);
    return [];
  }
}

// Fetch articles list (this would be from a JSON or API)
//
// Each article carries a `ru` and `en` block with the language-specific
// title/description/categories/tags/url. When only one language version of
// an article exists, point both blocks at the same url — the card will just
// show translated metadata around an article that opens in its one language.
async function fetchArticlesList() {
  return [
    {
      id: 'visual-literacy-methodology',
      date: '2026-08-10',
      updated: null,
      status: 'Published',
      heroImage: null,
      readTime: 22,
      ru: {
        title: 'Методология визуальной грамотности: от гештальта до дизайн-систем',
        description: 'Академический справочник: канонические источники, матрица Knowledge→Skill→Exercise→Assessment, 8-ступенчатый цикл Visual Literacy, разбор кейсов Pentagram и Мюллер-Брокманна, курированная библиотека и глоссарий.',
        categories: ['Дизайн', 'Образование'],
        tags: ['визуальная-грамотность', 'типографика', 'гештальт', 'дизайн-системы', 'методология'],
        url: 'articles/visual-literacy-methodology.html'
      }
    },
    {
      id: 'agentic-ai-prepress',
      date: '2024-01-25',
      updated: null,
      status: 'Published',
      heroImage: null,
      readTime: 18,
      ru: {
        title: 'Автономные Agentic AI системы и алгоритмическая автоматизация в препресс',
        description: 'Глобальный рынок агентных систем ИИ, техническая архитектура допечатной автоматизации и прогнозы ROI для цифровой печати (2024–2034)',
        categories: ['IT и технологии', 'Бизнес'],
        tags: ['agentic-ai', 'машинное-обучение', 'автоматизация', 'цифровая-печать', 'анализ-рынка'],
        url: 'articles/agentic-ai-prepress.html'
      },
      en: {
        title: 'Autonomous Agentic AI and Algorithmic Automation in Prepress',
        description: 'Market dynamics, technical architecture, and ROI projections for AI-driven digital printing automation (2024–2034)',
        categories: ['IT & Technology', 'Business'],
        tags: ['agentic-ai', 'machine-learning', 'automation', 'digital-printing', 'market-analysis'],
        url: 'articles/agentic-ai-prepress.en.html'
      }
    },
    {
      id: 'example-1',
      date: '2024-01-20',
      updated: null,
      status: 'Published',
      heroImage: null,
      readTime: 8,
      ru: {
        title: 'Начало работы с Digital Garden',
        description: 'Как настроить свой архив исследований и опубликовать первую статью.',
        categories: ['Гайд', 'Исследования'],
        tags: ['сад', 'знания', 'система', 'как-сделать'],
        url: 'articles/example-getting-started.html'
      },
      en: {
        title: 'Getting Started with Digital Garden',
        description: 'Learn how to set up your own research archive and publish your first article.',
        categories: ['Guide', 'Research'],
        tags: ['garden', 'knowledge', 'system', 'how-to'],
        url: 'articles/example-getting-started.html'
      }
    }
  ];
}

// Returns the language-specific block for an article, falling back to the
// other language if a translation hasn't been written yet.
function localize(article) {
  const lang = getCurrentLanguage();
  return article[lang] || article.ru || article.en;
}

// ============================================================================
// Theme Management
// ============================================================================

function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const htmlElement = document.documentElement;

  // Update button icon based on current theme
  const updateButton = () => {
    const isDark = htmlElement.classList.contains('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
  };

  updateButton();

  // Toggle theme on button click
  themeToggle.addEventListener('click', () => {
    console.log('[Theme] Toggle button clicked');
    htmlElement.classList.toggle('dark');
    const isDark = htmlElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateButton();
    console.log('[Theme] Changed to:', isDark ? 'dark' : 'light');
  });
}

// ============================================================================
// Search & Filter
// ============================================================================

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');

  // Ctrl+K to focus search
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
  });

  // Search input
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    searchClear.style.display = searchQuery ? 'block' : 'none';
    applyFilters();
  });

  // Clear search
  searchClear?.addEventListener('click', () => {
    searchInput.value = '';
    searchQuery = '';
    searchClear.style.display = 'none';
    applyFilters();
  });

  // ESC to clear search
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchInput.value = '';
      searchQuery = '';
      searchClear.style.display = 'none';
      applyFilters();
    }
  });
}

function initFilters() {
  const filterContainer = document.getElementById('filterContainer');
  filterContainer.querySelectorAll('.filter-pill, .btn-clear-filters').forEach(el => el.remove());

  // Get unique categories from articles, in the current language
  const categories = [...new Set(allArticles.flatMap(a => localize(a).categories))].sort();

  // Create category filters
  categories.forEach(category => {
    const label = document.createElement('label');
    label.className = 'filter-pill';
    if (selectedCategories.includes(category)) label.classList.add('active');
    label.innerHTML = `
      <input type="checkbox" value="${category}" class="category-checkbox" aria-label="Filter by ${category}" ${selectedCategories.includes(category) ? 'checked' : ''}>
      <span>${category}</span>
    `;

    label.querySelector('input').addEventListener('change', (e) => {
      if (e.target.checked) {
        selectedCategories.push(category);
        label.classList.add('active');
      } else {
        selectedCategories = selectedCategories.filter(c => c !== category);
        label.classList.remove('active');
      }
      applyFilters();
    });

    filterContainer.appendChild(label);
  });

  // Clear all filters button
  const clearBtn = document.createElement('button');
  clearBtn.className = 'btn-clear-filters';
  clearBtn.textContent = t('clear_filters');
  clearBtn.style.marginLeft = '1rem';
  clearBtn.addEventListener('click', () => {
    document.querySelectorAll('.category-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
    selectedCategories = [];
    applyFilters();
  });
  filterContainer.appendChild(clearBtn);
}

function applyFilters() {
  filteredArticles = allArticles.filter(article => {
    const loc = localize(article);

    // Category filter
    if (selectedCategories.length > 0) {
      const hasCategory = loc.categories.some(cat => selectedCategories.includes(cat));
      if (!hasCategory) return false;
    }

    // Search filter
    if (searchQuery) {
      const searchText = `${loc.title} ${loc.description} ${loc.tags?.join(' ')}`.toLowerCase();
      if (!searchText.includes(searchQuery)) return false;
    }

    // Status filter (show only published if not in draft view)
    if (article.status === 'Draft') return false;

    return true;
  });

  // Apply sorting
  applySorting();
  renderArticles();
}

function applySorting() {
  switch (currentSort) {
    case 'date-desc':
      filteredArticles.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'date-asc':
      filteredArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'title':
      filteredArticles.sort((a, b) => localize(a).title.localeCompare(localize(b).title, getLocale()));
      break;
    case 'read-time':
      filteredArticles.sort((a, b) => b.readTime - a.readTime);
      break;
  }
}

// ============================================================================
// Render Articles
// ============================================================================

function renderArticles() {
  const grid = document.getElementById('articlesGrid');
  const noResults = document.getElementById('noResults');
  const resultsCount = document.getElementById('resultsCount');

  grid.innerHTML = '';

  if (filteredArticles.length === 0) {
    grid.style.display = 'none';
    noResults.style.display = 'block';
    resultsCount.textContent = t('results_count') + ' 0';
    return;
  }

  grid.style.display = 'grid';
  noResults.style.display = 'none';
  resultsCount.textContent = `${t('results_count')} ${filteredArticles.length}`;

  filteredArticles.forEach(article => {
    const card = createArticleCard(article);
    grid.appendChild(card);
  });
}

function createArticleCard(article) {
  const loc = localize(article);
  const card = document.createElement('div');
  card.className = 'article-card';

  // Hero image
  let imageHTML = '';
  if (article.heroImage) {
    imageHTML = `<img src="${article.heroImage}" alt="${loc.title}" class="article-card-image">`;
  }

  // Status badge
  let statusHTML = '';
  if (article.status === 'In Progress') {
    statusHTML = `<span class="status-badge status-in-progress">${t('in_progress')}</span>`;
  }

  const categoriesHTML = loc.categories
    ?.map(cat => `<span class="tag">${escapeHtml(cat)}</span>`)
    .join('') || '';

  // Date formatting, locale-aware
  const formattedDate = formatDate(article.date, { year: 'numeric', month: 'short', day: 'numeric' });

  card.innerHTML = `
    ${imageHTML}
    <div class="article-card-content">
      <h3 class="article-card-title">${escapeHtml(loc.title)}</h3>
      <p class="article-card-description">${escapeHtml(loc.description)}</p>
      
      <div class="article-card-meta">
        <span>🕐 ${article.readTime} ${t('read_time')}</span>
        <span>📅 ${formattedDate}</span>
        ${statusHTML}
      </div>

      <div class="article-card-tags">
        ${categoriesHTML}
      </div>

      <div class="article-card-footer">
        <a href="${loc.url}" class="btn-read">${t('read_button')}</a>
      </div>
    </div>
  `;

  return card;
}

// ============================================================================
// Utility Functions
// ============================================================================

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function calculateReadTime(text) {
  const wordsPerMinute = 200;
  const words = text.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// ============================================================================
// Initialization
// ============================================================================

async function init() {
  // Initialize theme
  initTheme();

  // Load articles
  await loadArticles();

  // Initialize filters
  initFilters();

  // Initialize search
  initSearch();

  // Initial render
  filteredArticles = allArticles.filter(a => a.status !== 'Draft');
  applySorting();
  renderArticles();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
