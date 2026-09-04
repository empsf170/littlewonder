/* ============================================================
   LITTLEWONDER — events.js
   Event filtering, sorting, grid/list toggle
   ============================================================ */

'use strict';

const EventsApp = (() => {

  // ── Sample Event Data (6 events = 2 lines of 3-column grid) ──
  const eventsData = [
    { id: 1, title: 'Magical Storytelling Circle', category: 'theatre', age: '4-6', price: 499, date: '2026-09-06', day: 'saturday', location: 'LittleWonder Studio', image: 'assets/images/event1.jpg', type: 'indoor', description: 'An enchanting afternoon of stories, songs and imagination.' },
    { id: 2, title: 'Junior Music Explorers', category: 'music', age: '4-6', price: 650, date: '2026-09-07', day: 'sunday', location: 'Creative Hub', image: 'assets/images/event2.jpg', type: 'indoor', description: 'Kids discover the joy of rhythm and melody.' },
    { id: 3, title: 'Outdoor Science Adventure', category: 'science', age: '7-10', price: 750, date: '2026-09-05', day: 'friday', location: 'Wonder Park', image: 'assets/images/event3.jpg', type: 'outdoor', description: 'Hands-on experiments in the open air.' },
    { id: 4, title: 'Ballet & Dance Beginners', category: 'sports', age: '4-6', price: 800, date: '2026-09-06', day: 'saturday', location: 'Dance Studio', image: 'assets/images/event4.jpg', type: 'indoor', description: 'First steps into the world of movement and dance.' },
    { id: 5, title: 'Nature Trail Walk', category: 'outdoor', age: 'family', price: 0, date: '2026-09-07', day: 'sunday', location: 'City Forest', image: 'assets/images/event5.jpg', type: 'outdoor', description: 'Family guided walk through nature.' },
    { id: 6, title: 'Children\'s Theatre Show', category: 'theatre', age: '7-10', price: 399, date: '2026-09-06', day: 'saturday', location: 'Family Theatre', image: 'assets/images/event6.jpg', type: 'indoor', description: 'A professional children\'s theatre performance.' }
  ];

  let filtered = [...eventsData];
  let currentView = 'grid';
  let activeFilters = {
    category: [],
    age: [],
    type: [],
    priceRange: '',
    date: '',
    search: ''
  };

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  function formatPrice(price) {
    return price === 0 ? 'Free' : `₹${price}`;
  }

  function createEventCard(event) {
    const d = new Date(event.date);
    const day = d.getDate();
    const mon = d.toLocaleDateString('en-IN', { month: 'short' }).toUpperCase();
    return `
      <div class="event-card" data-id="${event.id}">
        <div class="event-card-border"></div>
        <div class="event-card-img">
          <img src="${event.image}" alt="${event.title}" loading="lazy">
          <div class="event-date-badge">
            <span class="date-day">${day}</span>
            <span class="date-month">${mon}</span>
          </div>
          <button class="event-fav-btn" data-id="${event.id}" aria-label="Add to favourites">
            <i class="bi bi-heart${FavouritesApp?.isFav(event.id) ? '-fill active' : ''}"></i>
          </button>
        </div>
        <div class="event-card-body">
          <div class="event-category">
            <span class="event-badge badge-coral">${event.category.toUpperCase()}</span>
          </div>
          <h3 class="event-card-title">${event.title}</h3>
          <p class="event-card-desc">${event.description}</p>
          <div class="event-card-meta">
            <div class="event-meta-item"><i class="bi bi-calendar3"></i> ${formatDate(event.date)}</div>
            <div class="event-meta-item"><i class="bi bi-geo-alt"></i> ${event.location}</div>
            <div class="event-meta-item"><i class="bi bi-people"></i> Ages ${event.age}</div>
          </div>
          <div class="event-card-footer">
            <div class="event-price">${formatPrice(event.price)} <span>/ child</span></div>
            <a href="event-details.html" class="btn-view-event">View Event</a>
          </div>
        </div>
      </div>`;
  }

  function createEventListItem(event) {
    return `
      <div class="event-list-item d-flex gap-3 bg-white p-3 rounded-3 mb-3 align-items-center" style="border:1px solid rgba(23,42,70,.06);">
        <img src="${event.image}" alt="${event.title}" style="width:120px;height:90px;object-fit:cover;border-radius:12px;flex-shrink:0;" loading="lazy">
        <div class="flex-1" style="flex:1;min-width:0;">
          <span class="event-badge badge-coral mb-1">${event.category.toUpperCase()}</span>
          <h4 style="font-family:var(--font-head);font-weight:600;color:var(--navy);margin-bottom:4px;">${event.title}</h4>
          <div class="d-flex gap-3 flex-wrap" style="font-size:.82rem;color:#6b7a8d;">
            <span><i class="bi bi-calendar3 me-1" style="color:var(--coral);"></i>${formatDate(event.date)}</span>
            <span><i class="bi bi-geo-alt me-1" style="color:var(--coral);"></i>${event.location}</span>
            <span><i class="bi bi-people me-1" style="color:var(--coral);"></i>Ages ${event.age}</span>
          </div>
        </div>
        <div class="text-end" style="flex-shrink:0;">
          <div style="font-family:var(--font-head);font-size:1.3rem;font-weight:700;color:var(--navy);">${formatPrice(event.price)}</div>
          <a href="event-details.html" class="btn-view-event mt-2 d-inline-flex">View</a>
        </div>
      </div>`;
  }

  function applyFilters() {
    filtered = eventsData.filter(event => {
      if (activeFilters.category.length && !activeFilters.category.includes(event.category)) return false;
      if (activeFilters.age.length && !activeFilters.age.includes(event.age)) return false;
      if (activeFilters.type.length && !activeFilters.type.includes(event.type)) return false;
      if (activeFilters.priceRange) {
        const p = event.price;
        if (activeFilters.priceRange === 'free' && p !== 0) return false;
        if (activeFilters.priceRange === 'under500' && p >= 500) return false;
        if (activeFilters.priceRange === '500-1000' && (p < 500 || p > 1000)) return false;
        if (activeFilters.priceRange === '1000plus' && p < 1000) return false;
      }
      if (activeFilters.date) {
        const today = new Date();
        const eventDate = new Date(event.date);
        if (activeFilters.date === 'today') {
          if (eventDate.toDateString() !== today.toDateString()) return false;
        } else if (activeFilters.date === 'this-weekend') {
          const day = today.getDay();
          const fri = new Date(today); fri.setDate(today.getDate() + (5 - day + 7) % 7);
          const sun = new Date(fri); sun.setDate(fri.getDate() + 2);
          if (eventDate < fri || eventDate > sun) return false;
        }
      }
      if (activeFilters.search) {
        const q = activeFilters.search.toLowerCase();
        if (!event.title.toLowerCase().includes(q) && !event.category.toLowerCase().includes(q) && !event.location.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    render();
  }

  function applySorting(sort) {
    const sortMap = {
      'newest': (a, b) => new Date(b.date) - new Date(a.date),
      'price-low': (a, b) => a.price - b.price,
      'price-high': (a, b) => b.price - a.price,
      'date': (a, b) => new Date(a.date) - new Date(b.date),
      'recommended': () => 0
    };
    filtered.sort(sortMap[sort] || (() => 0));
    render();
  }

  function render() {
    const container = document.getElementById('events-container');
    const countEl = document.getElementById('results-count');
    if (!container) return;

    if (countEl) countEl.innerHTML = `Showing <strong>${filtered.length}</strong> events`;

    if (filtered.length === 0) {
      container.innerHTML = `<div class="text-center py-5" style="grid-column:1/-1;"><i class="bi bi-search" style="font-size:3rem;color:#c0c8d8;"></i><p class="mt-3" style="color:#8a9ab5;">No events match your filters. <button onclick="EventsApp.clearFilters()" style="color:var(--coral);font-weight:700;background:none;border:none;cursor:pointer;">Clear all</button></p></div>`;
      return;
    }

    if (currentView === 'grid') {
      container.className = 'events-grid';
      container.innerHTML = filtered.map(createEventCard).join('');
    } else {
      container.className = '';
      container.innerHTML = filtered.map(createEventListItem).join('');
    }

    // Re-attach fav buttons
    container.querySelectorAll('.event-fav-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        const id = parseInt(btn.dataset.id);
        FavouritesApp?.toggle(id);
        btn.querySelector('i').className = `bi bi-heart${FavouritesApp?.isFav(id) ? '-fill' : ''}`;
        btn.classList.toggle('active', FavouritesApp?.isFav(id));
      });
    });
  }

  function bindUI() {
    // Checkboxes
    document.querySelectorAll('[data-filter]').forEach(input => {
      input.addEventListener('change', () => {
        const type = input.dataset.filter;
        const val = input.value;
        if (input.type === 'checkbox') {
          if (input.checked) {
            if (!activeFilters[type]) activeFilters[type] = [];
            activeFilters[type].push(val);
          } else {
            activeFilters[type] = activeFilters[type].filter(v => v !== val);
          }
        } else if (input.type === 'radio') {
          activeFilters[type] = input.checked ? val : '';
        }
        applyFilters();
      });
    });

    // Sort
    document.getElementById('sort-select')?.addEventListener('change', e => {
      applySorting(e.target.value);
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentView = btn.dataset.view;
        render();
      });
    });

    // Search
    document.getElementById('event-search-input')?.addEventListener('input', e => {
      activeFilters.search = e.target.value.trim();
      applyFilters();
    });

    // Clear filters
    document.getElementById('clear-filters')?.addEventListener('click', clearFilters);
  }

  function clearFilters() {
    activeFilters = { category: [], age: [], type: [], priceRange: '', date: '', search: '' };
    document.querySelectorAll('[data-filter]').forEach(el => {
      if (el.type === 'checkbox' || el.type === 'radio') el.checked = false;
    });
    const searchInput = document.getElementById('event-search-input');
    if (searchInput) searchInput.value = '';
    filtered = [...eventsData];
    render();
  }

  function init() {
    if (!document.getElementById('events-container')) return;
    render();
    bindUI();
  }

  return { init, clearFilters, getData: () => eventsData };

})();

document.addEventListener('DOMContentLoaded', EventsApp.init);
