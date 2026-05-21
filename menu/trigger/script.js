
if (window.innerWidth >= 992) {

  function measureInnerWidth(el) {
    el.style.maxWidth = 'none';
    el.style.overflow = 'visible';
    el.style.opacity = '0';
    const width = el.scrollWidth;
    el.style.maxWidth = '';
    el.style.overflow = '';
    el.style.opacity = '';
    return width;
  }

  const logo = document.querySelector('.navbar1_link-logo');
  const buttons = document.querySelector('.navbar1_menu-buttons.is-in');

  function updateWidths() {
    if (logo) logo.style.setProperty('--inner-width', measureInnerWidth(logo) + 'px');
    if (buttons) buttons.style.setProperty('--inner-width', measureInnerWidth(buttons) + 'px');
  }

  updateWidths();

  let resizeTimer;
  window.addEventListener('resize', () => {
    if (window.innerWidth < 992) return;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(updateWidths, 150);
  });

  ScrollTrigger.create({
    start: "150px top",
    onEnter: () => document.querySelector(".navbar1_component").classList.add("is-active"),
    onLeaveBack: () => document.querySelector(".navbar1_component").classList.remove("is-active"),
  });

}
