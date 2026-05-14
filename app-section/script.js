gsap.registerPlugin(ScrollTrigger);

document.querySelectorAll(".app_timeline-item-top").forEach((top) => {
  const existing = top.querySelectorAll(".app_timeline-item-line");
  existing.forEach((el) => el.remove());
  for (let i = 0; i < 50; i++) {
    const line = document.createElement("div");
    line.className = "app_timeline-item-line";
    top.appendChild(line);
  }
});

function smoothScrollTo(targetY, duration) {
  const startY = window.scrollY;
  const diff = targetY - startY;
  let startTime = null;

  function ease(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + diff * ease(progress));
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

const anchorIds = ["app-anchor-1", "app-anchor-2", "app-anchor-3"];

document.querySelectorAll(".app_timeline-item").forEach((item, i) => {
  item.addEventListener("click", () => {
    const target = document.getElementById(anchorIds[i]);
    if (!target) return;
    smoothScrollTo(target.getBoundingClientRect().top + window.scrollY, 3000);
  });
});

const anchorWrap = document.querySelector(".app_anchor-wrap");
const anchors = document.querySelectorAll(".app_anchor");
const timelineItems = document.querySelectorAll(".app_timeline-item");

gsap.set(".app_timeline-item-line", { opacity: 0.2 });

if (anchorWrap && anchors.length) {
  let currentAnchor = -1;

  ScrollTrigger.create({
    trigger: anchorWrap,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    markers: true,
    onUpdate: (self) => {
      const index = Math.min(
        Math.floor(self.progress * anchors.length),
        anchors.length - 1
      );
      if (index !== currentAnchor) {
        currentAnchor = index;
        console.log(`Мы сейчас в анкор ${index + 1}`);
      }
    },
  });
}

if (anchorWrap && timelineItems.length) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: anchorWrap,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
    },
  });

  timelineItems.forEach((item) => {
    const lines = item.querySelectorAll(".app_timeline-item-line");
    tl.to(lines, {
      opacity: 1,
      stagger: { each: 0.1, from: "start" },
      duration: 0.5,
    });
  });
}
