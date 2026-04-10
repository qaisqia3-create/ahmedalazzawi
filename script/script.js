// Mobile navigation toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

menuToggle?.addEventListener('click', () => {
  const opened = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(opened));
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

// Reveal elements on scroll
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('show');
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
revealElements.forEach((el) => revealObserver.observe(el));

// Animated counters for stats
const counters = document.querySelectorAll('[data-counter]');

function animateCounter(element) {
  const target = Number(element.dataset.counter || 0);
  const duration = 1200;
  const start = performance.now();

  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(target * eased));
    if (progress < 1) requestAnimationFrame(update);
  };

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.6 }
);

counters.forEach((counter) => counterObserver.observe(counter));

// Active navigation link while scrolling
const sections = document.querySelectorAll('main section[id]');
const navAnchors = navLinks?.querySelectorAll('a') || [];

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((a) => a.classList.remove('active'));
      const active = navLinks?.querySelector(`a[href="#${entry.target.id}"]`);
      active?.classList.add('active');
    });
  },
  { threshold: 0.45 }
);
sections.forEach((section) => sectionObserver.observe(section));

// Scroll progress and back to top behavior
const progressBar = document.getElementById('scrollProgress');
const toTopButton = document.getElementById('toTop');

function handleScrollUI() {
  const top = document.documentElement.scrollTop || document.body.scrollTop;
  const max = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const percent = max > 0 ? (top / max) * 100 : 0;

  if (progressBar) progressBar.style.width = `${percent}%`;
  toTopButton?.classList.toggle('show', top > 450);
}

window.addEventListener('scroll', handleScrollUI, { passive: true });
handleScrollUI();

toTopButton?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Lightbox for medals gallery
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

function openLightbox(src, caption = '') {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;
  lightboxImage.src = src;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox || !lightboxImage || !lightboxCaption) return;
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImage.src = '';
  lightboxCaption.textContent = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-lightbox-src]').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    openLightbox(trigger.dataset.lightboxSrc, trigger.dataset.caption || '');
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

// Tilt effect for premium cards
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach((card) => {
  card.addEventListener('mousemove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Championship filtering (year/type)
const filterButtons = document.querySelectorAll('.filter-btn');
const championshipCards = document.querySelectorAll('.champ-card');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.dataset.filter;
    championshipCards.forEach((card) => {
      const tags = card.dataset.tags || '';
      const visible = filter === 'all' || tags.includes(filter);
      card.style.display = visible ? '' : 'none';
    });
  });
});

// Contact form validation
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('formSuccess');

const validationRules = {
  name: {
    check: (value) => value.trim().length >= 2,
    message: 'الاسم يجب أن يحتوي على حرفين على الأقل.'
  },
  email: {
    check: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: 'يرجى إدخال بريد إلكتروني صحيح.'
  },
  message: {
    check: (value) => value.trim().length >= 10,
    message: 'الرسالة يجب أن تكون 10 أحرف على الأقل.'
  }
};

function setError(fieldName, text = '') {
  const errorEl = document.getElementById(`${fieldName}Error`);
  if (errorEl) errorEl.textContent = text;
}

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (successMessage) successMessage.textContent = '';

  let isValid = true;

  Object.keys(validationRules).forEach((fieldName) => {
    const value = String(contactForm.elements[fieldName]?.value || '');
    const { check, message } = validationRules[fieldName];

    if (!check(value)) {
      setError(fieldName, message);
      isValid = false;
    } else {
      setError(fieldName, '');
    }
  });

  if (!isValid) return;

  if (successMessage) {
    successMessage.textContent = 'تم إرسال رسالتك بنجاح. سيتم التواصل معك قريبًا.';
  }
  contactForm.reset();
});