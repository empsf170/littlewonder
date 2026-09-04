/* ============================================================
   LITTLEWONDER — favorites.js
   Save / remove favourite events with localStorage
   ============================================================ */

'use strict';

const FavouritesApp = (() => {
  const KEY = 'lw_favourites';

  function getAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  }

  function save(favs) {
    localStorage.setItem(KEY, JSON.stringify(favs));
  }

  function isFav(id) { return getAll().includes(id); }

  function toggle(id) {
    const favs = getAll();
    const idx = favs.indexOf(id);
    if (idx === -1) favs.push(id);
    else favs.splice(idx, 1);
    save(favs);
    updateBadge();
    return idx === -1;
  }

  function updateBadge() {
    const count = getAll().length;
    document.querySelectorAll('.fav-count-badge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  function syncButtons() {
    document.querySelectorAll('.event-fav-btn').forEach(btn => {
      const id = parseInt(btn.dataset.id);
      const fav = isFav(id);
      const icon = btn.querySelector('i');
      if (icon) icon.className = `bi bi-heart${fav ? '-fill' : ''}`;
      btn.classList.toggle('active', fav);
    });
  }

  function init() {
    updateBadge();
    syncButtons();

    document.addEventListener('click', e => {
      const btn = e.target.closest('.event-fav-btn');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      const added = toggle(id);
      const icon = btn.querySelector('i');
      if (icon) icon.className = `bi bi-heart${added ? '-fill' : ''}`;
      btn.classList.toggle('active', added);

      // Toast
      showToast(added ? '❤️ Added to favourites' : 'Removed from favourites');
    });
  }

  function showToast(msg) {
    let toast = document.getElementById('fav-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'fav-toast';
      toast.style.cssText = 'position:fixed;bottom:90px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--navy);color:#fff;padding:10px 20px;border-radius:999px;font-size:.87rem;font-weight:700;z-index:9999;opacity:0;transition:all .3s ease;white-space:nowrap;pointer-events:none;';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2000);
  }

  return { init, toggle, isFav, getAll };

})();

document.addEventListener('DOMContentLoaded', FavouritesApp.init);
