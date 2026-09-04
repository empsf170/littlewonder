/* ============================================================
   LITTLEWONDER — filters.js
   Mobile filter drawer + search panel logic
   ============================================================ */

'use strict';

const FiltersApp = (() => {

  function initFilterDrawer() {
    const openBtn  = document.getElementById('open-filter-drawer');
    const drawer   = document.getElementById('filter-drawer');
    const closeBtn = document.getElementById('close-filter-drawer');
    const overlay  = document.getElementById('filter-overlay');
    if (!drawer) return;

    function open() {
      drawer.classList.add('open');
      overlay?.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      drawer.classList.remove('open');
      overlay?.classList.remove('open');
      document.body.style.overflow = '';
    }

    openBtn?.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    overlay?.addEventListener('click', close);
  }

  function initSearchPanel() {
    const form = document.getElementById('hero-search-form');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      const location = form.querySelector('[name="location"]')?.value || '';
      const date = form.querySelector('[name="date"]')?.value || '';
      const age = form.querySelector('[name="age"]')?.value || '';
      const category = form.querySelector('[name="category"]')?.value || '';
      const params = new URLSearchParams({ location, date, age, category });
      window.location.href = `events.html?${params}`;
    });
  }

  function initPriceRange() {
    const range = document.getElementById('price-range');
    const display = document.getElementById('price-display');
    if (!range || !display) return;
    range.addEventListener('input', () => {
      display.textContent = `₹0 – ₹${range.value}`;
    });
  }

  function init() {
    initFilterDrawer();
    initSearchPanel();
    initPriceRange();
  }

  return { init };

})();

document.addEventListener('DOMContentLoaded', FiltersApp.init);
