
// Swiper 1 [START]
{
    const swiperBlock = document.querySelector(".swiper-block.is-contributor");

    if (swiperBlock) {
        const progressIn = swiperBlock.querySelector(".slider_progress-in");
        const swiperEl = swiperBlock.querySelector(".swiper");

        function resetProgress() {
            progressIn.classList.remove("is-animating");
            void progressIn.offsetWidth;
            progressIn.classList.add("is-animating");
        }

        const swiper = new Swiper(swiperEl, {
            slidesPerView: "auto",
            followFinger: true,
            freeMode: false,
            slideToClickedSlide: false,
            centeredSlides: true,
            grabCursor: true,
            initialSlide: 2,
            speed: 500,
            loop: false,
            slideActiveClass: "is-active",

            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },

            mousewheel: {
                forceToAxis: true,
            },

            keyboard: {
                enabled: true,
                onlyInViewport: true,
            },

            navigation: {
                nextEl: swiperBlock.querySelector("[data-swiper-next]"),
                prevEl: swiperBlock.querySelector("[data-swiper-prev]"),
            },
        });

        swiper.on("slideChangeTransitionStart", resetProgress);
        resetProgress();
    }
}
// Swiper 1 [END]
