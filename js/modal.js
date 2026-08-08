// Digital Garden — Image Modal

class ImageModal {
  constructor() {
    this.modal = null;
    this.modalImage = null;
    this.modalClose = null;
    this.modalCaption = null;
    this.init();
  }

  init() {
    this.createModal();
    this.attachEventListeners();
  }

  createModal() {
    // Check if modal already exists
    const existing = document.getElementById('imageModal');
    if (existing) {
      this.modal = existing;
      this.modalImage = existing.querySelector('.modal-image');
      this.modalClose = existing.querySelector('.modal-close');
      this.modalCaption = existing.querySelector('.modal-caption');
      return;
    }

    // Create modal HTML
    const modalHTML = `
      <div id="imageModal" class="modal" style="display: none;">
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <button class="modal-close" aria-label="Close modal">&times;</button>
          <img class="modal-image" src="" alt="">
          <p class="modal-caption"></p>
        </div>
      </div>
    `;

    // Add to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Get references
    this.modal = document.getElementById('imageModal');
    this.modalImage = this.modal.querySelector('.modal-image');
    this.modalClose = this.modal.querySelector('.modal-close');
    this.modalCaption = this.modal.querySelector('.modal-caption');

    // Add modal styles
    this.addModalStyles();
  }

  addModalStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
      }

      .modal.active {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        cursor: pointer;
      }

      .modal-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        background: var(--bg-primary);
        border-radius: 8px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        animation: slideUp 0.3s ease;
      }

      .modal-image {
        max-width: 100%;
        max-height: calc(90vh - 60px);
        object-fit: contain;
      }

      .modal-caption {
        padding: 1rem;
        font-size: 0.95rem;
        color: var(--text-secondary);
        border-top: 1px solid var(--border);
        background: var(--bg-secondary);
      }

      .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 40px;
        height: 40px;
        padding: 0;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 2rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
        z-index: 1001;
      }

      .modal-close:hover {
        background: rgba(0, 0, 0, 0.8);
      }

      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes slideUp {
        from { transform: translateY(20px); }
        to { transform: translateY(0); }
      }

      @media (max-width: 768px) {
        .modal-content {
          max-width: 95vw;
          max-height: 85vh;
        }

        .modal-image {
          max-height: calc(85vh - 60px);
        }
      }
    `;
    document.head.appendChild(style);
  }

  attachEventListeners() {
    // Close on close button
    this.modalClose.addEventListener('click', () => this.close());

    // Close on overlay click
    this.modal.querySelector('.modal-overlay').addEventListener('click', () => this.close());

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal.classList.contains('active')) {
        this.close();
      }
    });

    // Image clicks in content
    this.attachArticleImages();
  }

  attachArticleImages() {
    // Attach to main content images
    const mainContent = document.querySelector('main, article');
    if (mainContent) {
      mainContent.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG' && !e.target.closest('.article-card-image')) {
          this.open(e.target.src, e.target.alt);
        }
      });
    }
  }

  open(src, alt = '') {
    this.modalImage.src = src;
    this.modalImage.alt = alt;
    this.modalCaption.textContent = alt || 'Image';
    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ImageModal();
  });
} else {
  new ImageModal();
}
