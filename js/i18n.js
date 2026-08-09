// Digital Garden — Internationalization (i18n)
// Language: Russian / English

const i18n = {
  ru: {
    // Navigation & Header
    'logo': '🌱 Цифровой сад',
    'subtitle': 'Архив моих исследований',
    'tagline': 'От технологий и дизайна до философии и личных размышлений',
    
    // Search & Filters
    'search_placeholder': 'Поиск статей (Ctrl+K)...',
    'filter_label': 'Фильтр по категориям:',
    'clear_all': 'Очистить',
    'results_count': 'Найдено статей:',
    'no_results': 'Статей не найдено. Попробуй изменить поиск или фильтры.',
    
    // Article Card
    'read_time': 'мин чтения',
    'read_button': 'Читать',
    'published': 'Опубликовано',
    'draft': 'Черновик',
    'in_progress': 'В процессе',
    
    // Footer
    'footer_email': '📧 Email',
    'footer_linkedin': '🔗 LinkedIn',
    'footer_github': '💼 GitHub',
    'footer_copyright': 'Цифровой сад. Все права защищены.',
    
    // Article Page
    'back_to_garden': '← Вернуться в сад',
    'table_of_contents': 'Оглавление',
    'last_updated': 'Последнее обновление:',
    'read_time_label': 'мин чтения',
    'categories': 'Категории:',
    'clear_filters': 'Сбросить',
    'view_original': 'Читать на английском',
    'view_translation': 'Читать на русском',
    
    // Language Toggle
    'language': 'Язык',
  },
  
  en: {
    // Navigation & Header
    'logo': '🌱 Digital Garden',
    'subtitle': 'Archive of My Research',
    'tagline': 'From technology and design to philosophy and personal reflections',
    
    // Search & Filters
    'search_placeholder': 'Search articles (Ctrl+K)...',
    'filter_label': 'Filter by category:',
    'clear_all': 'Clear All',
    'results_count': 'Articles found:',
    'no_results': 'No articles found. Try adjusting your search or filters.',
    
    // Article Card
    'read_time': 'min read',
    'read_button': 'Read Article',
    'published': 'Published',
    'draft': 'Draft',
    'in_progress': 'In Progress',
    
    // Footer
    'footer_email': '📧 Email',
    'footer_linkedin': '🔗 LinkedIn',
    'footer_github': '💼 GitHub',
    'footer_copyright': 'Digital Garden. All rights reserved.',
    
    // Article Page
    'back_to_garden': '← Back to Garden',
    'table_of_contents': 'Contents',
    'last_updated': 'Last updated:',
    'read_time_label': 'min read',
    'categories': 'Categories:',
    'clear_filters': 'Clear All',
    'view_original': 'Read in English',
    'view_translation': 'Read in Russian',
    
    // Language Toggle
    'language': 'Language',
  }
};

// Get current language (default: Russian)
function getCurrentLanguage() {
  return localStorage.getItem('language') || 'ru';
}

// Set language
function setLanguage(lang) {
  if (lang === 'ru' || lang === 'en') {
    localStorage.setItem('language', lang);
    window.location.reload();
  }
}

// Get translation
function t(key) {
  const lang = getCurrentLanguage();
  return i18n[lang][key] || i18n['ru'][key] || key;
}

// Translate element by data attribute
function translatePage() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Copyright year is injected dynamically so it never goes stale
  const copyrightEl = document.querySelector('[data-i18n="footer_copyright"]');
  if (copyrightEl) {
    copyrightEl.textContent = `© ${new Date().getFullYear()} ${t('footer_copyright')}`;
  }
}

// Returns the correct Intl locale string for the current language
function getLocale() {
  return getCurrentLanguage() === 'ru' ? 'ru-RU' : 'en-US';
}

// Format a date string according to the current language
function formatDate(dateStr, options = { year: 'numeric', month: 'long', day: 'numeric' }) {
  return new Date(dateStr).toLocaleDateString(getLocale(), options);
}

// Initialize translations on page load
document.addEventListener('DOMContentLoaded', translatePage);
