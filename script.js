const SELECTORS = {
  navbar: '.navbar',
  hamburger: '.hamburger',
  navMenu: '.nav-menu',
  navLinks: '.nav-link',
  sections: 'section',
  heroContent: '.hero-content',
  heroImage: '.hero-image',
  filterContainer: '.portfolio-filter',
  filterButton: '.filter-btn',
  projectCard: '.project-card',
  rippleButton: '.btn-primary, .btn-secondary, .btn-submit, .filter-btn',
  contactForm: '.contact-form',
  submitButton: '.btn-submit',
  schoolVideoCard: '.school-video-card',
  videoModal: '#videoModal',
  modalVideo: '#modalVideo',
  modalVideoTitle: '#modalVideoTitle',
  closeVideoModalButton: '#closeVideoModal',
  badgeNumber: '.badge-number',
  hoverLetter: '.hover-letter',
  tag: '.tag',
  contactDetails: '.contact-details',
  contactItem: '.contact-item'
};

const ANIMATION = {
  section: {
    opacity: '0',
    transform: 'translateY(30px)',
    transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
  },
  card: {
    opacity: '0',
    transform: 'translateY(24px)'
  }
};

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const getScrollMetrics = () => {
  const currentScroll = window.scrollY || window.pageYOffset || 0;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

  return { currentScroll, maxScroll };
};

const clampProgressValue = (value) => {
  const numericValue = Number.parseFloat(value);

  if (!Number.isFinite(numericValue)) {
    return '0%';
  }

  return `${Math.min(Math.max(numericValue, 0), 100)}%`;
};

const setHamburgerState = (isOpen) => {
  const hamburger = document.querySelector(SELECTORS.hamburger);

  if (!hamburger) {
    return;
  }

  hamburger.setAttribute('aria-expanded', String(isOpen));
  hamburger.querySelectorAll('span').forEach((span, index) => {
    if (!isOpen) {
      span.style.opacity = '';
      span.style.transform = '';
      return;
    }

    span.style.opacity = index === 1 ? '0' : '1';
    span.style.transform = index === 0
      ? 'rotate(45deg) translate(7px, 7px)'
      : index === 2
        ? 'rotate(-45deg) translate(7px, -7px)'
        : '';
  });
};

const closeMobileMenu = () => {
  const navMenu = document.querySelector(SELECTORS.navMenu);

  navMenu?.classList.remove('active');
  setHamburgerState(false);
};

const getCurrentSectionId = (currentScroll) => {
  let currentSectionId = '';

  document.querySelectorAll(SELECTORS.sections).forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.clientHeight;

    if (currentScroll >= sectionTop - 220 && currentScroll < sectionBottom - 220) {
      currentSectionId = section.id;
    }
  });

  return currentSectionId;
};

const updateNavbar = () => {
  const { currentScroll, maxScroll } = getScrollMetrics();
  const navbar = document.querySelector(SELECTORS.navbar);

  navbar?.classList.toggle('scrolled', currentScroll > 10);

  const currentSectionId = getCurrentSectionId(currentScroll);

  document.querySelectorAll(SELECTORS.navLinks).forEach((link) => {
    const href = link.getAttribute('href');
    const targetId = href?.startsWith('#') ? href.slice(1) : '';

    link.classList.toggle('active', targetId === currentSectionId);
  });

  const scrollProgress = maxScroll > 0 ? (currentScroll / maxScroll) * 100 : 0;
  document.documentElement.style.setProperty('--scroll-progress', `${scrollProgress}%`);

  const heroContent = document.querySelector(SELECTORS.heroContent);
  const heroImage = document.querySelector(SELECTORS.heroImage);

  if (heroContent && heroImage && currentScroll < window.innerHeight) {
    heroContent.style.transform = `translateY(${currentScroll * 0.04}px)`;
    heroImage.style.transform = `translateY(${currentScroll * 0.025}px)`;
  }
};

let isScrollUpdateQueued = false;

const requestNavbarUpdate = () => {
  if (isScrollUpdateQueued) {
    return;
  }

  isScrollUpdateQueued = true;

  window.requestAnimationFrame(() => {
    updateNavbar();
    isScrollUpdateQueued = false;
  });
};

const initMobileNavigation = () => {
  const hamburger = document.querySelector(SELECTORS.hamburger);
  const navMenu = document.querySelector(SELECTORS.navMenu);

  hamburger?.addEventListener('click', () => {
    if (!navMenu) {
      return;
    }

    const willOpen = !navMenu.classList.contains('active');
    navMenu.classList.toggle('active', willOpen);
    setHamburgerState(willOpen);
  });

  document.querySelectorAll(`${SELECTORS.navLinks}, a[href^="#"]`).forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });
};

const initSmoothAnchorNavigation = () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');

      if (!href || href === '#') {
        return;
      }

      const target = document.getElementById(href.slice(1));

      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start'
      });
      history.pushState(null, '', href);
      closeMobileMenu();
    });
  });
};

const initSectionAnimations = () => {
  if (!('IntersectionObserver' in window)) {
    return;
  }

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) {
        return;
      }

      window.setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        entry.target.classList.add('animate-in');
      }, index * 90);

      sectionObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -90px 0px'
  });

  document.querySelectorAll(SELECTORS.sections).forEach((section) => {
    section.style.opacity = ANIMATION.section.opacity;
    section.style.transform = ANIMATION.section.transform;
    section.style.transition = ANIMATION.section.transition;
    sectionObserver.observe(section);
  });
};

const initCardAnimations = () => {
  if (!('IntersectionObserver' in window)) {
    return;
  }

  const animatedCards = document.querySelectorAll('.skill-card, .about-skill, .stat, .service-card, .project-card, .contact-item');

  animatedCards.forEach((card, index) => {
    card.style.opacity = ANIMATION.card.opacity;
    card.style.transform = ANIMATION.card.transform;
    card.style.transition = `all 0.55s ease ${index * 0.035}s`;
  });

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      cardObserver.unobserve(entry.target);
    });
  }, { threshold: 0.16 });

  animatedCards.forEach((card) => cardObserver.observe(card));
};

const initSkillProgressAnimations = () => {
  if (!('IntersectionObserver' in window)) {
    return;
  }

  const skillCards = document.querySelectorAll('.skill-card, .about-skill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const progress = entry.target.querySelector('.skill-progress, .about-skill-track i');

      if (!progress) {
        skillObserver.unobserve(entry.target);
        return;
      }

const targetWidth = clampProgressValue(progress.dataset.width || progress.style.width || '0%');
       progress.style.width = '0%';
       progress.dataset.width = targetWidth;

       window.requestAnimationFrame(() => {
         progress.style.width = targetWidth;
       });

      skillObserver.unobserve(entry.target);
    });
  }, { threshold: 0.25 });

  skillCards.forEach((card) => skillObserver.observe(card));
};

const initProjectFiltering = () => {
  const filterContainer = document.querySelector(SELECTORS.filterContainer);

  if (!filterContainer) {
    return;
  }

  filterContainer.addEventListener('click', (event) => {
    const selectedButton = event.target.closest(SELECTORS.filterButton);

    if (!selectedButton) {
      return;
    }

    const selectedFilter = selectedButton.dataset.filter;

    filterContainer.querySelectorAll(SELECTORS.filterButton).forEach((button) => {
      const isActive = button === selectedButton;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });

    document.querySelectorAll('[data-category]').forEach((item) => {
      const categories = item.dataset.category || '';
      const matchesFilter = categories.includes(selectedFilter);
      item.hidden = !matchesFilter;
    });
  });
};

const initProjectIconHover = () => {
  document.querySelectorAll(SELECTORS.projectCard).forEach((card) => {
    const icon = card.querySelector('.project-image i');

    if (!icon) {
      return;
    }

    card.addEventListener('mouseenter', () => {
      icon.style.transform = 'scale(1.18) rotate(8deg)';
    });

    card.addEventListener('mouseleave', () => {
      icon.style.transform = '';
    });
  });
};

const initRippleEffects = () => {
  document.querySelectorAll(SELECTORS.rippleButton).forEach((button) => {
    button.addEventListener('click', (event) => {
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = (event.clientX || rect.left + rect.width / 2) - rect.left - size / 2;
      const y = (event.clientY || rect.top + rect.height / 2) - rect.top - size / 2;
      const ripple = document.createElement('span');

      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.position = 'absolute';
      ripple.style.borderRadius = '50%';
      ripple.style.background = 'hsl(var(--primary-foreground) / 0.45)';
      ripple.style.transform = 'scale(0)';
      ripple.style.animation = 'ripple 0.6s ease-out';
      ripple.style.pointerEvents = 'none';

      button.style.position = 'relative';
      button.style.overflow = 'hidden';
      button.appendChild(ripple);

      window.setTimeout(() => ripple.remove(), 650);
    });
  });
};

const initContactForm = () => {
  const contactForm = document.querySelector('#contact-form');

  if (!contactForm) {
    return;
  }

// Formspree endpoint - replace with your own if needed
   // Get one at: https://formspree.io/
   const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mojoeapd';

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = contactForm.querySelector(SELECTORS.submitButton);

    if (!submitButton || submitButton.disabled) {
      return;
    }

    const originalText = submitButton.textContent;

    // Disable button and show sending state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    submitButton.style.background = 'hsl(var(--primary))';

    try {
      // Prepare form data
      const formData = new FormData(contactForm);
      
      // Submit to Formspree
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success
        submitButton.textContent = 'Message Sent!';
      } else {
        // Error
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      // Error handling
      console.error('Error:', error);
      submitButton.textContent = 'Message Failed!';
    } finally {
      // Reset after delay
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        submitButton.style.background = '';
        contactForm.reset();
      }, 3000);
    }
  });
};

const initVideoModal = () => {
  const videoModal = document.querySelector(SELECTORS.videoModal);
  const modalVideo = document.querySelector(SELECTORS.modalVideo);
  const modalVideoTitle = document.querySelector(SELECTORS.modalVideoTitle);
  const closeVideoModalButton = document.querySelector(SELECTORS.closeVideoModalButton);
  let previouslyFocusedElement = null;

  if (!videoModal || !modalVideo) {
    return;
  }

  const openVideoModal = (videoSrc, titleText) => {
    previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    modalVideo.src = videoSrc;
    modalVideo.muted = false;
    modalVideo.volume = 1.0;
    modalVideo.crossOrigin = 'anonymous';
    modalVideo.load();
    modalVideoTitle.textContent = titleText || 'School Project Video';
    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    window.setTimeout(() => {
      const playPromise = modalVideo.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay with sound was blocked, try muted then enable sound on interaction
          modalVideo.muted = true;
          modalVideo.play().then(() => {
            // Show a subtle hint that user can click to enable sound
            modalVideo.addEventListener('click', () => {
              modalVideo.muted = false;
            }, { once: true });
          }).catch(() => {});
        });
      }
      closeVideoModalButton?.focus();
    }, 120);
  };

  const closeVideoModal = () => {
    videoModal.classList.remove('open');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    modalVideo.pause();
    modalVideo.removeAttribute('src');
    modalVideo.load();

    if (previouslyFocusedElement instanceof HTMLElement) {
      previouslyFocusedElement.focus({ preventScroll: true });
    }
  };

  modalVideo.addEventListener('error', () => {
    const src = modalVideo.getAttribute('src');

    if (src) {
      window.open(src, '_blank', 'noopener,noreferrer');
    }
  });

  document.querySelectorAll(SELECTORS.schoolVideoCard).forEach((card) => {
    const previewVideo = card.querySelector('.project-video');
    const source = previewVideo?.querySelector('source');
    const title = card.querySelector('h3')?.textContent.trim() || 'School Project Video';
    const videoSrc = source?.getAttribute('src') || '';

    if (!videoSrc || !previewVideo) {
      return;
    }

    previewVideo.controls = false;

    previewVideo.addEventListener('play', (event) => {
      event.preventDefault();
      previewVideo.pause();
      openVideoModal(videoSrc, title);
    });

    card.querySelector('.video-wrapper')?.addEventListener('click', () => {
      openVideoModal(videoSrc, title);
    });
  });

  videoModal.addEventListener('click', (event) => {
    if (event.target.closest('[data-close-modal="true"]')) {
      closeVideoModal();
    }
  });

  closeVideoModalButton?.addEventListener('click', closeVideoModal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && videoModal.classList.contains('open')) {
      closeVideoModal();
    }
  });
};

const initBadgeCountUp = () => {
  const badgeNumber = document.querySelector(SELECTORS.badgeNumber);

  if (!badgeNumber) {
    return;
  }

  const target = Number.parseInt(badgeNumber.textContent, 10);

  if (!Number.isFinite(target)) {
    return;
  }

  let current = 0;
  const increment = target / 50;
  const timer = window.setInterval(() => {
    current += increment;

    if (current >= target) {
      badgeNumber.textContent = `${target}+`;
      window.clearInterval(timer);
      return;
    }

    badgeNumber.textContent = `${Math.floor(current)}+`;
  }, 30);
};

const initHoverLetterEffects = () => {
  document.querySelectorAll(SELECTORS.hoverLetter).forEach((letter) => {
    letter.addEventListener('mouseenter', () => {
      letter.style.textShadow = '0 0 20px hsl(var(--primary) / 0.55)';
    });

    letter.addEventListener('mouseleave', () => {
      letter.style.textShadow = '';
    });
  });
};

const initTagHoverEffects = () => {
  document.querySelectorAll(SELECTORS.tag).forEach((tag) => {
    tag.addEventListener('mouseenter', () => {
      tag.style.transform = 'scale(1.1) rotate(2deg)';
    });

    tag.addEventListener('mouseleave', () => {
      tag.style.transform = '';
    });
  });
};

const initContactItemStagger = () => {
  document.querySelectorAll(SELECTORS.contactDetails).forEach((container) => {
    container.querySelectorAll(SELECTORS.contactItem).forEach((item, index) => {
      item.style.transitionDelay = `${index * 0.05}s`;
    });
  });
};

const initResizeHandler = () => {
  let resizeTimer;

  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(updateNavbar, 250);
  });
};

const init = () => {
  initSmoothAnchorNavigation();
  initMobileNavigation();
  initSectionAnimations();
  initCardAnimations();
  initSkillProgressAnimations();
  initProjectFiltering();
  initProjectIconHover();
  initRippleEffects();
  initContactForm();
  initVideoModal();
  initHoverLetterEffects();
  initTagHoverEffects();
  initContactItemStagger();
  initBadgeCountUp();
  initResizeHandler();

  document.body.classList.add('loaded');
  updateNavbar();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
