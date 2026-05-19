gsap.registerPlugin(ScrollTrigger);

function getPositionedParent(el) {
  let p = el.parentElement;
  while (p) {
    if (getComputedStyle(p).position !== "static") return p;
    p = p.parentElement;
  }
  return document.documentElement;
}

let currentST = null;

function setup() {
  if (currentST) { currentST.kill(); currentST = null; }

  const navbar      = document.querySelector(".navbar1_component");
  const logoLink    = document.querySelector(".navbar1_logo-link");
  const logoText    = document.querySelector(".navbar_logo-text");
  const linkLogo    = document.querySelector(".navbar1_link-logo");
  const mainButtons = document.querySelector(".navbar1_menu-buttons.is-main");
  const inButtons   = document.querySelector(".navbar1_menu-buttons.is-in");

  if (!logoLink || !linkLogo || !mainButtons || !inButtons) return;

  // Reset to initial state before recalculating
  navbar.classList.remove("is-active");
  gsap.set([logoLink, mainButtons], { clearProps: "left,right,transform" });
  gsap.set([linkLogo, inButtons],   { maxWidth: 0, overflow: "hidden" });
  gsap.set(logoText,                { opacity: 1, scale: 1, clearProps: "transform" });

  const logoParent = getPositionedParent(logoLink);
  const btnParent  = getPositionedParent(mainButtons);

  const logoLeftFrom = logoLink.getBoundingClientRect().left    - logoParent.getBoundingClientRect().left;
  const btnRightFrom = btnParent.getBoundingClientRect().right  - mainButtons.getBoundingClientRect().right;

  // Temporarily expand inner elements (opacity 0, no flash) to measure target positions
  linkLogo.style.maxWidth  = "none";
  linkLogo.style.overflow  = "visible";
  inButtons.style.maxWidth = "none";
  inButtons.style.overflow = "visible";
  void linkLogo.offsetWidth;

  const logoLeftTo  = linkLogo.getBoundingClientRect().left    - logoParent.getBoundingClientRect().left;
  const btnRightTo  = btnParent.getBoundingClientRect().right  - inButtons.getBoundingClientRect().right;
  const linkLogoW   = linkLogo.offsetWidth;
  const inButtonsW  = inButtons.offsetWidth;

  linkLogo.style.maxWidth  = "";
  linkLogo.style.overflow  = "";
  inButtons.style.maxWidth = "";
  inButtons.style.overflow = "";
  gsap.set([linkLogo, inButtons], { maxWidth: 0, overflow: "hidden" });

  // If already scrolled past trigger — snap to active state without animation
  if (window.scrollY > 100) {
    navbar.classList.add("is-active");
    gsap.set(logoLink,    { left:     logoLeftTo  });
    gsap.set(mainButtons, { right:    btnRightTo  });
    gsap.set(linkLogo,    { maxWidth: linkLogoW   });
    gsap.set(inButtons,   { maxWidth: inButtonsW  });
    gsap.set(logoText,    { opacity: 0, scale: 0, transformOrigin: "left center" });
  }

  const dur  = 1;
  const ease = "power2.inOut";

  currentST = ScrollTrigger.create({
    start: "100px top",
    onEnter: () => {
      navbar.classList.add("is-active");
      gsap.timeline()
        .to(logoLink,    { left:     logoLeftTo,  duration: dur, ease }, 0)
        .to(mainButtons, { right:    btnRightTo,  duration: dur, ease }, 0)
        .to(linkLogo,    { maxWidth: linkLogoW,   duration: dur, ease }, 0)
        .to(inButtons,   { maxWidth: inButtonsW,  duration: dur, ease }, 0)
        .to(logoText,    { opacity: 0, scale: 0, transformOrigin: "left center", duration: 0.5, ease: "power1.inOut" }, 0);
    },
    onLeaveBack: () => {
      navbar.classList.remove("is-active");
      gsap.timeline()
        .to(logoLink,    { left:     logoLeftFrom, duration: dur, ease }, 0)
        .to(mainButtons, { right:    btnRightFrom, duration: dur, ease }, 0)
        .to(linkLogo,    { maxWidth: 0,            duration: dur, ease }, 0)
        .to(inButtons,   { maxWidth: 0,            duration: dur, ease }, 0)
        .to(logoText,    { opacity: 1, scale: 1, transformOrigin: "left center", duration: 0.5, ease: "power1.inOut" }, 0.4);
    },
  });
}

function init() {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 992px)", () => {
    setup();

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setup, 200);
    };
    window.addEventListener("resize", onResize);

    // Cleanup when below breakpoint
    return () => {
      window.removeEventListener("resize", onResize);
      if (currentST) { currentST.kill(); currentST = null; }

      const navbar      = document.querySelector(".navbar1_component");
      const logoLink    = document.querySelector(".navbar1_logo-link");
      const logoText    = document.querySelector(".navbar_logo-text");
      const linkLogo    = document.querySelector(".navbar1_link-logo");
      const mainButtons = document.querySelector(".navbar1_menu-buttons.is-main");
      const inButtons   = document.querySelector(".navbar1_menu-buttons.is-in");

      navbar.classList.remove("is-active");
      gsap.set([logoLink, mainButtons, linkLogo, inButtons, logoText], { clearProps: "all" });
    };
  });
}

if (document.readyState === "complete") {
  init();
} else {
  window.addEventListener("load", init);
}
