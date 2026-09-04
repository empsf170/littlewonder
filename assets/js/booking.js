/* ============================================================
   LITTLEWONDER — booking.js
   Ticket quantity and order total calculator
   ============================================================ */

'use strict';

const BookingApp = (() => {

  const prices = {
    child: 499,
    adult: 349,
    family: 1199
  };

  const BOOKING_FEE = 39;
  let quantities = { child: 1, adult: 1, family: 0 };

  function updateDisplay() {
    // Update qty displays
    Object.keys(quantities).forEach(type => {
      const el = document.getElementById(`qty-${type}`);
      if (el) el.textContent = quantities[type];
    });

    // Calculate totals
    let subtotal = 0;
    Object.entries(quantities).forEach(([type, qty]) => {
      subtotal += prices[type] * qty;
    });

    const total = subtotal + (subtotal > 0 ? BOOKING_FEE : 0);

    const subtotalEl = document.getElementById('order-subtotal');
    const feeEl      = document.getElementById('order-fee');
    const totalEl    = document.getElementById('order-total');

    if (subtotalEl) subtotalEl.textContent = subtotal > 0 ? `₹${subtotal}` : '₹0';
    if (feeEl)      feeEl.textContent      = subtotal > 0 ? `₹${BOOKING_FEE}` : '₹0';
    if (totalEl)    totalEl.textContent    = subtotal > 0 ? `₹${total}` : '₹0';

    const ctaBtn = document.getElementById('booking-cta');
    if (ctaBtn) {
      ctaBtn.disabled = subtotal === 0;
      ctaBtn.textContent = subtotal > 0 ? `Continue — ₹${total}` : 'Select Tickets';
    }
  }

  function bindControls() {
    document.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.type;
        const action = btn.dataset.action;
        if (!type || !quantities.hasOwnProperty(type)) return;
        if (action === 'plus') {
          quantities[type] = Math.min(quantities[type] + 1, 10);
        } else if (action === 'minus') {
          quantities[type] = Math.max(quantities[type] - 1, 0);
        }
        updateDisplay();
      });
    });
  }

  // Date selector
  function bindDateSelector() {
    const dateBtns = document.querySelectorAll('.date-pick-btn');
    dateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        dateBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  }

  function init() {
    if (!document.getElementById('booking-widget') && !document.querySelector('.qty-btn')) return;
    updateDisplay();
    bindControls();
    bindDateSelector();
  }

  return { init };

})();

document.addEventListener('DOMContentLoaded', BookingApp.init);
