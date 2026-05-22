function animateCounter(el, from, to, duration) {
  var startTime = null;
  var fromNum = parseInt(from, 10);
  var toNum = parseInt(to, 10);
  if (isNaN(fromNum) || isNaN(toNum)) return;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(fromNum + (toNum - fromNum) * eased);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function initPriceCards() {
  document.querySelectorAll('[data-price-card]').forEach(function (card) {
    var monthEl = card.querySelector('[data-price-month]');
    var yearEl = card.querySelector('[data-price-year]');
    if (!monthEl || !yearEl) return;

    card.setAttribute('data-month-val', monthEl.textContent.trim());
    card.setAttribute('data-year-val', yearEl.textContent.trim());
    yearEl.style.display = 'none';
  });

  document.querySelectorAll('.tabs_nav-toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function () {
      var isYearly = toggle.classList.toggle('is-active');

      var wrap = toggle.closest('.tabs_wrap');
      var cards = wrap
        ? wrap.querySelectorAll('[data-price-card]')
        : document.querySelectorAll('[data-price-card]');

      cards.forEach(function (card) {
        var monthEl = card.querySelector('[data-price-month]');
        if (!monthEl) return;

        var from = monthEl.textContent.trim();
        var to = isYearly
          ? card.getAttribute('data-year-val')
          : card.getAttribute('data-month-val');

        animateCounter(monthEl, from, to, 700);
      });
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPriceCards);
} else {
  initPriceCards();
}
