// Contact Form Handler with Formspree
(function() {
  const FORMSPREE_ID = 'xlgpeagn';
  const FORMSPREE_URL = `https://formspree.io/f/${FORMSPREE_ID}`;

  const contactFormBtn = document.getElementById('contactFormBtn');
  const suggestTopicBtn = document.getElementById('suggestTopicBtn');
  const contactModal = document.getElementById('contactModal');
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  const modalClose = contactModal.querySelector('.modal-close');

  // Helper: Open modal with specific context
  function openModal(title, placeholderText) {
    const heading = contactModal.querySelector('h2');
    const textareaPlaceholder = contactModal.querySelector('textarea[name="message"]');
    
    heading.textContent = title;
    if (textareaPlaceholder) {
      textareaPlaceholder.placeholder = placeholderText;
    }
    
    contactModal.style.display = 'flex';
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    document.getElementById('name')?.focus();
  }

  // Open modal for "Связаться"
  if (contactFormBtn) {
    contactFormBtn.addEventListener('click', () => {
      openModal(
        'Связаться со мной',
        'Напишите ваше сообщение...'
      );
    });
  }

  // Open modal for "Предложить тему"
  if (suggestTopicBtn) {
    suggestTopicBtn.addEventListener('click', () => {
      openModal(
        'Предложить тему',
        'Расскажи, какую тему, книгу или статью ты хочешь разобрать...'
      );
    });
  }

  // Close modal
  function closeModal() {
    contactModal.style.display = 'none';
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = 'auto';
    formStatus.style.display = 'none';
  }

  modalClose.addEventListener('click', closeModal);

  // Close on backdrop click
  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) {
      closeModal();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal.style.display !== 'none') {
      closeModal();
    }
  });

  // Handle form submission
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      _subject: `Новое сообщение от ${formData.get('name')}`,
    };

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляю...';
    formStatus.style.display = 'block';
    formStatus.textContent = 'Отправка сообщения...';
    formStatus.style.backgroundColor = 'rgba(100, 100, 150, 0.1)';
    formStatus.style.color = 'var(--text-secondary)';

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Success
        formStatus.textContent = '✅ Спасибо! Сообщение отправлено. Я свяжусь с вами вскоре!';
        formStatus.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
        formStatus.style.color = 'var(--text-primary)';
        submitBtn.textContent = 'Отправлено!';

        // Clear form
        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.textContent = 'Отправить';
          setTimeout(() => {
            closeModal();
          }, 1500);
        }, 1000);
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      // Error
      formStatus.textContent = '❌ Ошибка отправки. Пожалуйста, попробуйте снова.';
      formStatus.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
      formStatus.style.color = 'var(--text-primary)';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить';

      console.error('Form submission error:', error);
    }
  });
})();
