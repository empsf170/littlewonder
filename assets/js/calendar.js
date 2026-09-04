/* ============================================================
   LITTLEWONDER — calendar.js
   Visual mini-calendar with event highlighting
   ============================================================ */

'use strict';

const CalendarApp = (() => {

  const calendarEvents = {
    '2026-09-05': [{ time: '10:00 AM', name: 'Outdoor Science Adventure', loc: 'Wonder Park', age: '7-10' }],
    '2026-09-06': [
      { time: '11:00 AM', name: 'Magical Storytelling Circle', loc: 'LittleWonder Studio', age: '4-8' },
      { time: '02:00 PM', name: 'Ballet & Dance Beginners', loc: 'Dance Studio', age: '4-6' }
    ],
    '2026-09-07': [
      { time: '10:30 AM', name: 'Junior Music Explorers', loc: 'Creative Hub', age: '4-6' },
      { time: '03:00 PM', name: 'Nature Trail Walk', loc: 'City Forest', age: 'Family' }
    ],
    '2026-09-12': [{ time: '09:30 AM', name: 'Baby Sensory Class', loc: 'Creative Hub', age: '0-3' }],
    '2026-09-13': [{ time: '11:00 AM', name: 'Canvas Painting Workshop', loc: 'Creative Hub', age: '7-10' }],
    '2026-09-14': [{ time: '10:00 AM', name: 'Family Fitness Fun', loc: 'Adventure Arena', age: 'Family' }],
    '2026-09-19': [{ time: '02:00 PM', name: 'Teen Drama Workshop', loc: 'Family Theatre', age: '11-14' }],
    '2026-09-20': [{ time: '11:00 AM', name: 'Pottery for Kids', loc: 'LittleWonder Studio', age: '7-10' }],
    '2026-09-21': [{ time: '10:00 AM', name: 'Kids Festival Day', loc: 'Wonder Park', age: 'Family' }],
  };

  let currentYear = 2026;
  let currentMonth = 8; // September (0-indexed)
  let selectedDate = null;

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  function dateKey(y, m, d) {
    return `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }

  function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const monthYearEl = document.getElementById('calendar-month-year');
    if (!grid) return;

    monthYearEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrev = new Date(currentYear, currentMonth, 0).getDate();

    const today = new Date();
    const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

    let html = dayNames.map(d => `<div class="cal-day-name">${d}</div>`).join('');

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      html += `<button class="cal-day other-month" disabled>${daysInPrev - i}</button>`;
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      const key = dateKey(currentYear, currentMonth, d);
      const isToday = key === todayKey;
      const hasEvent = !!calendarEvents[key];
      const isSelected = key === selectedDate;
      let cls = 'cal-day';
      if (isToday) cls += ' today';
      if (hasEvent) cls += ' has-event';
      if (isSelected) cls += ' selected';
      html += `<button class="${cls}" data-date="${key}">${d}</button>`;
    }

    // Next month fill
    const total = firstDay + daysInMonth;
    const nextDays = total % 7 === 0 ? 0 : 7 - (total % 7);
    for (let d = 1; d <= nextDays; d++) {
      html += `<button class="cal-day other-month" disabled>${d}</button>`;
    }

    grid.innerHTML = html;

    // Click handlers
    grid.querySelectorAll('.cal-day:not(.other-month)').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedDate = btn.dataset.date;
        renderCalendar();
        renderEventList(selectedDate);
      });
    });

    // Show today's events by default if none selected
    if (!selectedDate) {
      renderEventList(todayKey);
    }
  }

  function renderEventList(dateKey) {
    const container = document.getElementById('calendar-events-list');
    if (!container) return;
    const events = calendarEvents[dateKey] || [];
    const d = new Date(dateKey + 'T00:00:00');
    const label = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

    if (events.length === 0) {
      container.innerHTML = `<p style="color:#8a9ab5;font-size:.9rem;text-align:center;padding:20px 0;">No events on ${label}</p>`;
      return;
    }

    container.innerHTML = `<p style="font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#8a9ab5;margin-bottom:12px;">${label}</p>` +
      events.map(ev => `
        <div class="cal-event-item">
          <span class="cal-event-time">${ev.time}</span>
          <span class="cal-event-dot"></span>
          <div class="cal-event-info">
            <div class="cal-event-name">${ev.name}</div>
            <div class="cal-event-loc"><i class="bi bi-geo-alt" style="color:var(--coral);margin-right:3px;"></i>${ev.loc} &nbsp;·&nbsp; Ages ${ev.age}</div>
          </div>
          <a href="event-details.html" style="font-size:.78rem;font-weight:700;color:var(--coral);white-space:nowrap;">Book →</a>
        </div>`).join('');
  }

  function bindNav() {
    document.getElementById('cal-prev')?.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
      selectedDate = null;
      renderCalendar();
    });
    document.getElementById('cal-next')?.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      selectedDate = null;
      renderCalendar();
    });
  }

  function init() {
    if (!document.getElementById('calendar-grid')) return;
    renderCalendar();
    bindNav();
  }

  return { init };

})();

document.addEventListener('DOMContentLoaded', CalendarApp.init);
