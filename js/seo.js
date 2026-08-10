// SEO Enhancement: JSON-LD, Reading Progress Bar, Related Articles, Prism Highlight

(function() {
  // =========================================================================
  // 1. Add JSON-LD Person Schema to Homepage
  // =========================================================================
  
  function addPersonSchema() {
    // Only add to homepage (when main has articles)
    if (!document.getElementById('articlesGrid')) return;

    const personSchema = {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "AI MOVL",
      "description": "Researcher, developer, and digital gardener exploring technologies, design, philosophy, and life.",
      "url": "https://digitalgardenai.com",
      "image": "https://digitalgardenai.com/images/fonart.jpg",
      "email": "ai.movl@gmail.com",
      "sameAs": [
        "https://github.com/228burger228",
        "https://t.me/aimovl"
      ],
      "jobTitle": "Senior Developer & Researcher"
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(personSchema);
    document.head.appendChild(script);
  }

  // =========================================================================
  // 2. Add Article Schema to Article Pages
  // =========================================================================
  
  function addArticleSchema() {
    // Only add to article pages (when #articleContent exists)
    if (!document.getElementById('articleContent')) return;

    const title = document.querySelector('h1')?.textContent || 'Article';
    const description = document.querySelector('meta[name="description"]')?.content || '';
    const datePublished = document.getElementById('pubDate')?.textContent || new Date().toISOString();
    const categories = Array.from(document.querySelectorAll('.article-category-tag'))
      .map(el => el.textContent);

    const articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "image": document.querySelector('.article-hero')?.src || "https://digitalgardenai.com/images/fonart.jpg",
      "datePublished": datePublished,
      "dateModified": new Date().toISOString(),
      "author": {
        "@type": "Person",
        "name": "AI MOVL",
        "url": "https://digitalgardenai.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Digital Garden",
        "url": "https://digitalgardenai.com"
      },
      "url": window.location.href,
      "keywords": categories.join(", ")
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(articleSchema);
    document.head.appendChild(script);
  }

  // =========================================================================
  // 3. Reading Progress Bar
  // =========================================================================
  
  function initProgressBar() {
    // Only add to article pages
    if (!document.getElementById('articleContent')) return;

    const progressBar = document.createElement('div');
    progressBar.id = 'readingProgressBar';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(90deg, #2563EB, #7c3aed);
      width: 0%;
      z-index: 9999;
      transition: width 0.1s ease;
    `;
    document.body.insertBefore(progressBar, document.body.firstChild);

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = scrollPercent + '%';
    });
  }

  // =========================================================================
  // 4. Syntax Highlighting with Prism.js
  // =========================================================================
  
  function initPrismHighlight() {
    // Load Prism CSS
    const prismCSS = document.createElement('link');
    prismCSS.rel = 'stylesheet';
    prismCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/styles/atom-one-dark.min.css';
    document.head.appendChild(prismCSS);

    // Load highlight.js instead of Prism (simpler and better)
    const prismScript = document.createElement('script');
    prismScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.8.0/highlight.min.js';
    prismScript.onload = () => {
      // Highlight all code blocks
      document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
      });
    };
    document.head.appendChild(prismScript);
  }

  // =========================================================================
  // 5. Related Articles
  // =========================================================================
  
  function addRelatedArticles() {
    // Only add to article pages
    if (!document.getElementById('articleContent')) return;

    // Get current article categories
    const categories = Array.from(document.querySelectorAll('.article-category-tag'))
      .map(el => el.textContent.trim());

    if (categories.length === 0) return;

    // Try to fetch articles list from main.js data (if available)
    // For now, just create a placeholder that can be populated
    const relatedSection = document.createElement('div');
    relatedSection.id = 'relatedArticles';
    relatedSection.style.cssText = `
      margin-top: 3rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border);
    `;

    const heading = document.createElement('h3');
    heading.textContent = 'Связанные статьи';
    relatedSection.appendChild(heading);

    const list = document.createElement('div');
    list.id = 'relatedArticlesList';
    list.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-top: 1rem;
    `;
    relatedSection.appendChild(list);

    // Insert after article footer
    const footer = document.querySelector('.article-footer');
    if (footer) {
      footer.parentNode.insertBefore(relatedSection, footer.nextSibling);
    }

    // Try to populate from window.articles if available
    if (window.articles && Array.isArray(window.articles)) {
      populateRelatedArticles(categories);
    }
  }

  function populateRelatedArticles(currentCategories) {
    if (!window.articles) return;

    // Get current article URL
    const currentUrl = window.location.pathname;

    // Find related articles
    const related = window.articles
      .filter(article => article.url !== currentUrl) // Exclude current article
      .map(article => {
        const matchingCategories = (article.categories || [])
          .filter(cat => currentCategories.includes(cat)).length;
        return { ...article, matchScore: matchingCategories };
      })
      .filter(article => article.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);

    // Render related articles
    const list = document.getElementById('relatedArticlesList');
    if (list && related.length > 0) {
      list.innerHTML = related
        .map(article => `
          <a href="${article.url}" style="text-decoration: none; color: inherit; display: block; padding: 1rem; border: 1px solid var(--border); border-radius: 8px; transition: all 0.2s ease; hover:border-color: var(--accent);">
            <h4 style="margin: 0 0 0.5rem 0; font-size: 1rem;">${article.title}</h4>
            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">${article.categories?.join(', ') || ''}</p>
          </a>
        `)
        .join('');
    }
  }

  // =========================================================================
  // Initialize
  // =========================================================================
  
  document.addEventListener('DOMContentLoaded', () => {
    addPersonSchema();
    addArticleSchema();
    initProgressBar();
    initPrismHighlight();
    addRelatedArticles();
  });
})();
