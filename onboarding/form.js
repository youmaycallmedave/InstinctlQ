const visibleEmail = document.querySelector('[data-form-visible-email]');
  const hiddenEmail = document.querySelector('[data-form-hidden-email]');
  const visibleBtn = document.querySelector('[data-form-visible-btn]');
  const hiddenBtn = document.querySelector('[data-form-hidden-btn]');
  const hiddenForm = document.querySelector('[data-form-hidden]');
  const successBlock = document.querySelector('.hero_join-form-success');

  visibleEmail.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      visibleBtn.click();
    }
  });

  const visibleForm = visibleEmail.closest('form');
  if (visibleForm) {
    visibleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();
    }, true);
  }

  document.addEventListener('submit', (e) => {
    if (e.target && e.target.contains(visibleEmail) && !e.target.contains(hiddenBtn)) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  visibleEmail.addEventListener('input', () => {
    hiddenEmail.value = visibleEmail.value;
  });

  let submitted = false;

  visibleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (submitted) return;

    const email = visibleEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!email || !emailRegex.test(email)) {
      visibleEmail.focus();
      visibleEmail.setCustomValidity('Please enter a valid email (e.g. name@example.com)');
      visibleEmail.reportValidity();
      visibleEmail.addEventListener('input', () => visibleEmail.setCustomValidity(''), { once: true });
      return;
    }

    submitted = true;
    visibleBtn.classList.add('is-green');
    visibleBtn.querySelector('.button_text').textContent = 'Joining';
    visibleBtn.querySelector('.button_bg-pixel-hover')?.remove();

    const bobr = document.querySelector('.hero_join-form1-btn-bobr');
    if (bobr) {
      bobr.animate([
        { offset: 0,   transform: 'translateY(0) rotate(0deg)',      easing: 'ease-in-out' },
        { offset: 1/3, transform: 'translateY(-2rem) rotate(0deg)',   easing: 'ease-in-out' },
        { offset: 1/2, transform: 'translateY(-2rem) rotate(25deg)',  easing: 'ease-in-out' },
        { offset: 2/3, transform: 'translateY(-2rem) rotate(-25deg)', easing: 'ease-in-out' },
        { offset: 1,   transform: 'translateY(0) rotate(0deg)' },
      ], { duration: 3000, fill: 'forwards' });
    }

    const iconStart = visibleBtn.querySelector('.button_ic-wrap.is-start');
    const iconEnd = visibleBtn.querySelector('.button_ic-wrap.is-end');
    const iconTransition = 'width 0.4s ease, overflow 0.4s ease';

    if (iconStart) {
      iconStart.style.transition = iconTransition;
      iconStart.style.overflow = 'hidden';
      iconStart.style.width = '0rem';
    }
    if (iconEnd) {
      iconEnd.style.overflow = 'hidden';
      iconEnd.style.width = '0rem';
      iconEnd.style.display = 'flex';
    }

    setTimeout(() => {
      if (iconEnd) {
        iconEnd.style.transition = iconTransition;
        iconEnd.style.width = '1.5rem';
      }
      visibleBtn.querySelector('.button_text').textContent = 'Joined Waitlist';
      visibleBtn.style.pointerEvents = 'none';
      visibleBtn.style.cursor = 'default';

      const fieldWrap = document.querySelector('.hero_join-form-field-wrap');
      if (fieldWrap) {
        const currentWidth = fieldWrap.getBoundingClientRect().width;
        fieldWrap.style.width = currentWidth + 'px';
        fieldWrap.style.overflow = 'hidden';
        requestAnimationFrame(() => {
          fieldWrap.style.transition = 'width 0.5s ease';
          fieldWrap.style.width = '0px';
        });
      }

      if (successBlock) {
        const skipLink = successBlock.querySelector('a');
        if (skipLink) {
          skipLink.href = 'https://typesafeai.typeform.com/waitlist#email=' + encodeURIComponent(email);
          skipLink.target = '_blank';
        }
        successBlock.style.transition = 'opacity 0.5s ease';
        successBlock.style.opacity = '1';
      }
    }, 3000);

    hiddenBtn.click();
  });
