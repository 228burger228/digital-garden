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
async function fetchArticlesList() {
  // This is a placeholder. In real implementation, you'd either:
  // 1. Fetch from articles.json
  // 2. Parse from HTML comments in article files
  // 3. Load from an API

  return [
    // Example article structure:
    {
      id: 'agentic-ai-prepress',
      title: 'Autonomous Agentic AI and Algorithmic Automation in Prepress',
      description: 'Market dynamics, technical architecture, and ROI projections for AI-driven digital printing automation (2024–2034)',
      url: 'articles/agentic-ai-prepress.html',
      date: '2024-01-25',
      updated: null,
      categories: ['IT & Technology', 'Business'],
      tags: ['agentic-ai', 'machine-learning', 'automation', 'digital-printing', 'market-analysis'],
      status: 'Published',
      heroImage: null,
      readTime: 18,
      content: ''
    },
    {
      id: 'example-1',
      title: 'Getting Started with Digital Garden',
      description: 'Learn how to set up your own research archive and publish your first article.',
      url: 'articles/example-getting-started.html',
      date: '2024-01-20',
      updated: null,
      categories: ['Guide', 'Research'],
      tags: ['garden', 'knowledge', 'system', 'how-to'],
      status: 'Published',
      heroImage: null,
      readTime: 8,
      content: ''
    }
  ];
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
  
  // Get unique categories from articles
  const categories = [...new Set(allArticles.flatMap(a => a.categories))].sort();
  
  // Create category filters
  categories.forEach(category => {
    const label = document.createElement('label');
    label.className = 'filter-pill';
    label.innerHTML = `
      <input type="checkbox" value="${category}" class="category-checkbox" aria-label="Filter by ${category}">
      <span>${category}</span>
    `;
    
    label.querySelector('input').addEventListener('change', (e) => {
      if (e.target.checked) {
        selectedCategories.push(category);
      } else {
        selectedCategories = selectedCategories.filter(c => c !== category);
      }
      applyFilters();
    });
    
    filterContainer.appendChild(label);
  });

  // Clear all filters button
  const clearBtn = document.createElement('button');
  clearBtn.className = 'btn-clear-filters';
  clearBtn.textContent = 'Clear All';
  clearBtn.style.marginLeft = '1rem';
  clearBtn.addEventListener('click', () => {
    document.querySelectorAll('.category-checkbox').forEach(cb => cb.checked = false);
    selectedCategories = [];
    applyFilters();
  });
  filterContainer.appendChild(clearBtn);
}

function applyFilters() {
  filteredArticles = allArticles.filter(article => {
    // Category filter
    if (selectedCategories.length > 0) {
      const hasCategory = article.categories.some(cat => selectedCategories.includes(cat));
      if (!hasCategory) return false;
    }

    // Search filter
    if (searchQuery) {
      const searchText = `${article.title} ${article.description} ${article.tags?.join(' ')}`.toLowerCase();
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
      filteredArticles.sort((a, b) => a.title.localeCompare(b.title));
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
    resultsCount.textContent = 'No articles found';
    return;
  }

  grid.style.display = 'grid';
  noResults.style.display = 'none';
  resultsCount.textContent = `Found ${filteredArticles.length} article${filteredArticles.length !== 1 ? 's' : ''}`;

  filteredArticles.forEach(article => {
    const card = createArticleCard(article);
    grid.appendChild(card);
  });
}

function createArticleCard(article) {
  const card = document.createElement('div');
  card.className = 'article-card';

  // Hero image
  let imageHTML = '';
  if (article.heroImage) {
    imageHTML = `<img src="${article.heroImage}" alt="${article.title}" class="article-card-image">`;
  }

  // Status badge
  let statusHTML = '';
  if (article.status === 'In Progress') {
    statusHTML = `<span class="status-badge status-in-progress">${article.status}</span>`;
  }

  // Tags
  const tagsHTML = article.tags
    ?.map(tag => `<span class="tag">${tag}</span>`)
    .join('') || '';

  const categoriesHTML = article.categories
    ?.map(cat => `<span class="tag">${cat}</span>`)
    .join('') || '';

  // Date formatting
  const dateObj = new Date(article.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  card.innerHTML = `
    ${imageHTML}
    <div class="article-card-content">
      <h3 class="article-card-title">${escapeHtml(article.title)}</h3>
      <p class="article-card-description">${escapeHtml(article.description)}</p>
      
      <div class="article-card-meta">
        <span>🕐 ${article.readTime} min read</span>
        <span>📅 ${formattedDate}</span>
        ${statusHTML}
      </div>

      <div class="article-card-tags">
        ${categoriesHTML}
      </div>

      <div class="article-card-footer">
        <a href="${article.url}" class="btn-read">Read Article</a>
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
