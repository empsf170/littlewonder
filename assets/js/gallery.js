/* ============================================================
   LITTLEWONDER — gallery.js
   Category filter + lightbox for gallery page
   ============================================================ */

'use strict';

const GalleryApp = (() => {

  function initFilter() {
    const filterBtns = document.querySelectorAll('[data-gallery-filter]');
    const items = document.querySelectorAll('[data-gallery-cat]');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.galleryFilter;

        items.forEach(item => {
          if (cat === 'all' || item.dataset.galleryCat === cat) {
            item.style.display = '';
            requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = 'scale(1)'; });
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(.96)';
            setTimeout(() => { item.style.display = 'none'; }, 300);
          }
        });
      });
    });

    // Add transition to items
    items.forEach(item => {
      item.style.transition = 'opacity .3s ease, transform .3s ease';
    });
  }

  function init() {
    if (!document.querySelector('[data-gallery-filter]')) return;
    initFilter();
  }

  return { init };

})();

document.addEventListener('DOMContentLoaded', GalleryApp.init);
