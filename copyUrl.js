document.querySelectorAll('[data-copy-url]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.href);

    const banner = document.createElement('div');
    banner.textContent = 'URL copied to clipboard';
    banner.style.cssText = `
      position: absolute;
      background: #1a1a1a;
      color: #fff;
      font-size: 12px;
      font-weight: 500;
      padding: 6px 10px;
      border-radius: 6px;
      white-space: nowrap;
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.2s;
    `;

    document.body.appendChild(banner);

    const rect = el.getBoundingClientRect();
    banner.style.left = rect.left + window.scrollX + rect.width / 2 - banner.offsetWidth / 2 + 'px';
    banner.style.top = rect.top + window.scrollY - banner.offsetHeight - 8 + 'px';
    banner.style.opacity = '1';

    setTimeout(() => {
      banner.style.opacity = '0';
      setTimeout(() => banner.remove(), 200);
    }, 1500);
  });
});
