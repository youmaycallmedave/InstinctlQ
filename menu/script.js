
ScrollTrigger.create({
  start: "100px top",
  onEnter: () => document.querySelector(".navbar1_component").classList.add("is-active"),
});

ScrollTrigger.create({
  start: "400px top",
  onLeaveBack: () => document.querySelector(".navbar1_component").classList.remove("is-active"),
});
