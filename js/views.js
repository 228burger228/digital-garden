// Digital Garden — View Counter (localStorage-based)

class ViewCounter {
  constructor() {
    this.storageKey = 'dg_views';
  }

  // Get all views
  getAll() {
    return JSON.parse(localStorage.getItem(this.storageKey)) || {};
  }

  // Get views for specific article
  get(articleId) {
    const views = this.getAll();
    return views[articleId] || 0;
  }

  // Increment views for article
  increment(articleId) {
    const views = this.getAll();
    views[articleId] = (views[articleId] || 0) + 1;
    localStorage.setItem(this.storageKey, JSON.stringify(views));
    return views[articleId];
  }

  // Format view count
  format(count) {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  }

  // Get view count element (for cards)
  getViewCountElement(articleId) {
    const count = this.get(articleId);
    const formatted = this.format(count);
    return `<span class="view-count" title="${count} просмотров">👁 ${formatted}</span>`;
  }
}

// Create global instance
window.viewCounter = new ViewCounter();

// Track current article view on article pages
function trackArticleView() {
  // Get article ID from URL or data attribute
  const articleElement = document.querySelector('[data-article-id]');
  if (!articleElement) return;

  const articleId = articleElement.getAttribute('data-article-id');
  if (!articleId) return;

  // Increment view count
  const newCount = window.viewCounter.increment(articleId);
  
  // Update display if exists
  const viewDisplay = document.querySelector('[data-view-count]');
  if (viewDisplay) {
    viewDisplay.textContent = `👁 ${window.viewCounter.format(newCount)}`;
    viewDisplay.title = `${newCount} просмотров`;
  }

  console.log(`[Views] Article "${articleId}" viewed. Total: ${newCount}`);
}

// Initialize on article pages
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', trackArticleView);
} else {
  trackArticleView();
}
