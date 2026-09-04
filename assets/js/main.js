/* ============================================================
   LITTLEWONDER — main.js
   Core interactions: header, mobile menu, scroll reveal,
   counters, back-to-top, lightbox, accordion, tabs
   ============================================================ */

'use strict';

/* ── Sticky Header ── */
const header = document.getElementById('site-header');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ── Mobile Menu ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.getElementById('mobile-menu-close');

function openMenu() {
  mobileMenu?.classList.add('open');
  hamburger?.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobileMenu?.classList.remove('open');
  hamburger?.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', () => {
  mobileMenu?.classList.contains('open') ? closeMenu() : openMenu();
});
mobileMenuClose?.addEventListener('click', closeMenu);
mobileMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* ── Scroll Reveal ── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* ── Number Counters ── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target || el.textContent);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const duration = 1800;
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const val = eased * target;
    el.textContent = prefix + (isDecimal ? val.toFixed(1) : Math.floor(val)) + suffix;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = prefix + target + suffix;
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-number, [data-counter]');
  if (!counters.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => {
    el.dataset.target = el.textContent.replace(/[^0-9.]/g, '');
    el.dataset.suffix = el.textContent.replace(/[0-9.]/g, '');
    obs.observe(el);
  });
}

/* ── Back To Top ── */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── Tabs (Day / Age) ── */
function initTabs(tabSelector, contentSelector) {
  const tabs = document.querySelectorAll(tabSelector);
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.tab;
      document.querySelectorAll(contentSelector).forEach(c => {
        c.classList.toggle('active', c.dataset.content === target);
      });
    });
  });
}

/* ── FAQ Accordion ── */
function initAccordion() {
  document.querySelectorAll('.accordion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.nextElementSibling;
      const isOpen = body?.classList.contains('open');
      // Close all
      document.querySelectorAll('.accordion-body.open').forEach(b => b.classList.remove('open'));
      document.querySelectorAll('.accordion-btn.active').forEach(b => b.classList.remove('active'));
      if (!isOpen && body) {
        body.classList.add('open');
        btn.classList.add('active');
      }
    });
  });

  // FAQ category filter
  document.querySelectorAll('.faq-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.faq-cat-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;
      document.querySelectorAll('.accordion-item').forEach(item => {
        item.style.display = (!cat || cat === 'all' || item.dataset.category === cat) ? '' : 'none';
      });
    });
  });
}

/* ── Gallery Lightbox ── */
let lightboxImages = [];
let lightboxIndex = 0;

function initLightbox() {
  const overlay = document.getElementById('lightbox-overlay');
  const img = document.getElementById('lightbox-img');
  const counter = document.getElementById('lightbox-counter');
  if (!overlay) return;

  lightboxImages = Array.from(document.querySelectorAll('.gallery-item img'));

  function show(i) {
    lightboxIndex = (i + lightboxImages.length) % lightboxImages.length;
    img.src = lightboxImages[lightboxIndex].src;
    img.alt = lightboxImages[lightboxIndex].alt;
    if (counter) counter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxImages.forEach((image, i) => {
    image.closest('.gallery-item')?.addEventListener('click', () => show(i));
  });

  document.getElementById('lightbox-close')?.addEventListener('click', close);
  document.getElementById('lightbox-prev')?.addEventListener('click', () => show(lightboxIndex - 1));
  document.getElementById('lightbox-next')?.addEventListener('click', () => show(lightboxIndex + 1));

  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'ArrowLeft') show(lightboxIndex - 1);
    if (e.key === 'ArrowRight') show(lightboxIndex + 1);
    if (e.key === 'Escape') close();
  });
}

/* ── Video Modal ── */
function initVideoModal() {
  const modal = document.getElementById('video-modal');
  if (!modal) return;
  const iframe = modal.querySelector('iframe');

  document.querySelectorAll('[data-video]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (iframe) iframe.src = btn.dataset.video + '?autoplay=1';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  modal.querySelector('.video-modal-close')?.addEventListener('click', () => {
    modal.classList.remove('open');
    if (iframe) iframe.src = '';
    document.body.style.overflow = '';
  });
  modal.addEventListener('click', e => {
    if (e.target === modal) {
      modal.classList.remove('open');
      if (iframe) iframe.src = '';
      document.body.style.overflow = '';
    }
  });
}

/* ── Location Selector ── */
function initLocationSelector() {
  const btns = document.querySelectorAll('.location-selector');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Simple inline city cycle for demo
      const cities = ['Chennai', 'Mumbai', 'Bengaluru', 'Delhi', 'Hyderabad'];
      const current = btn.querySelector('.location-name');
      if (!current) return;
      const idx = cities.indexOf(current.textContent);
      current.textContent = cities[(idx + 1) % cities.length];
    });
  });
}

/* ── Parallax ── */
function initParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }, { passive: true });
}

/* ── Hero image reveal ── */
function initHeroImages() {
  document.querySelectorAll('.hero-img').forEach(img => {
    if (img.complete) img.classList.add('loaded');
    else img.addEventListener('load', () => img.classList.add('loaded'));
  });
}

/* ── Lazy Images ── */
function initLazyImages() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });
  images.forEach(img => obs.observe(img));
}

/* ── Active Nav Link ── */
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a, .mobile-nav-list a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
}

/* ── Init All ── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initCounters();
  initBackToTop();
  initTabs('.day-tab', '.day-content');
  initTabs('.age-tab', '.age-content');
  initAccordion();
  initLightbox();
  initVideoModal();
  initLocationSelector();
  initParallax();
  initHeroImages();
  initLazyImages();
  setActiveNav();
});
