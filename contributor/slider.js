
// Custom Carousel [START]
{
    const block = document.querySelector(".swiper-block.is-contributor");

    if (block) {
        const progressIn = block.querySelector(".slider_progress-in");
        const container = block.querySelector(".swiper");
        const track = block.querySelector(".swiper-wrapper");
        const nextBtn = block.querySelector("[data-swiper-next]");
        const prevBtn = block.querySelector("[data-swiper-prev]");

        const SPEED = 300;
        const AUTOPLAY_DELAY = 5000;
        const INITIAL_SLIDE = 2;
        const CLONE_SETS = 4; // clone buffer on each side

        const origSlides = Array.from(track.querySelectorAll(".swiper-slide"));
        const N = origSlides.length;

        const isDesktop = () => window.innerWidth >= 992;
        const getRem = () => parseFloat(getComputedStyle(document.documentElement).fontSize);
        const MOBILE_SLIDE_W = () => window.innerWidth * 0.9;
        const INACTIVE_W = () => isDesktop() ? getRem() * 24 : MOBILE_SLIDE_W();
        const ACTIVE_W   = () => isDesktop() ? getRem() * 37 : MOBILE_SLIDE_W();

        // Strip Swiper classes before cloning
        origSlides.forEach(s => {
            s.classList.remove("is-active", "swiper-slide-active", "swiper-slide-next", "swiper-slide-prev");
        });

        // Prepend CLONE_SETS copies (reverse-insert keeps correct order)
        for (let i = 0; i < CLONE_SETS; i++) {
            [...origSlides].reverse().forEach(s => {
                track.insertBefore(s.cloneNode(true), track.firstChild);
            });
        }
        // Append CLONE_SETS copies
        for (let i = 0; i < CLONE_SETS; i++) {
            origSlides.forEach(s => track.appendChild(s.cloneNode(true)));
        }

        const slides = Array.from(track.querySelectorAll(".swiper-slide"));
        // Layout: [CLONE_SETS*N prepended | N real | CLONE_SETS*N appended]
        const REAL_START = CLONE_SETS * N;

        // Normalize any cur value to its equivalent in the real zone
        function toReal(idx) {
            return REAL_START + ((idx - REAL_START) % N + N) % N;
        }

        let cur = REAL_START + INITIAL_SLIDE;
        let animating = false;
        let autoTimer = null;
        let animTimeout = null;

        function setActive(idx) {
            slides.forEach((s, i) => s.classList.toggle("is-active", i === idx));
        }

        function computeOffset(idx) {
            if (!isDesktop()) {
                const slideW = MOBILE_SLIDE_W();
                const targetLeft = (window.innerWidth - slideW) / 2;
                const containerLeft = container.getBoundingClientRect().left;
                return targetLeft - containerLeft - slides[idx].offsetLeft;
            }
            const iw = INACTIVE_W();
            const aw = ACTIVE_W();
            const cw = container.offsetWidth;
            return -(idx * iw - (cw - aw) / 2);
        }

        function moveTo(idx, animate) {
            setActive(idx);
            const offset = computeOffset(idx);
            track.style.transition = animate ? `transform ${SPEED}ms ease-in-out` : "none";
            track.style.transform = `translateX(${offset}px)`;
            cur = idx;
        }

        function silentJump(idx) {
            container.classList.add("no-transitions");
            moveTo(idx, false);
            void container.offsetWidth;
            container.classList.remove("no-transitions");
        }

        function resetProgress() {
            progressIn.classList.remove("is-animating");
            void progressIn.offsetWidth;
            progressIn.classList.add("is-animating");
        }

        function go(delta) {
            if (animating) return;
            animating = true;
            moveTo(cur + delta, true);
            resetProgress();
            clearTimeout(animTimeout);
            animTimeout = setTimeout(() => {
                const real = toReal(cur);
                if (real !== cur) silentJump(real);
                animating = false;
            }, SPEED);
        }

        function startAutoplay() {
            clearInterval(autoTimer);
            autoTimer = setInterval(() => go(1), AUTOPLAY_DELAY);
        }

        nextBtn?.addEventListener("click", () => { go(1); startAutoplay(); });
        prevBtn?.addEventListener("click", () => { go(-1); startAutoplay(); });

        // Touch swipe (mobile) — reliable touch events
        let touchStartX = 0;
        let touchStartY = 0;
        let touchLocked = false; // true = direction determined

        container.addEventListener("touchstart", (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchLocked = false;
            clearInterval(autoTimer);
        }, { passive: true });

        container.addEventListener("touchmove", (e) => {
            if (touchLocked) return;
            const dx = Math.abs(e.touches[0].clientX - touchStartX);
            const dy = Math.abs(e.touches[0].clientY - touchStartY);
            if (dx < 5 && dy < 5) return;
            touchLocked = true;
            if (dx > dy) e.preventDefault(); // horizontal — block scroll
        }, { passive: false });

        container.addEventListener("touchend", (e) => {
            const dx = e.changedTouches[0].clientX - touchStartX;
            const dy = e.changedTouches[0].clientY - touchStartY;
            // Only trigger if clearly horizontal
            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
                go(dx < 0 ? 1 : -1);
            }
            startAutoplay();
        }, { passive: true });

        // Mouse drag (desktop only)
        let mouseStartX = 0;
        let mouseStartOffset = 0;
        let mouseDown = false;

        function getLiveOffset() {
            return new DOMMatrix(getComputedStyle(track).transform).m41;
        }

        container.addEventListener("mousedown", (e) => {
            mouseDown = true;
            clearTimeout(animTimeout);
            cur = toReal(cur);
            setActive(cur);
            const frozen = getLiveOffset();
            track.style.transition = "none";
            track.style.transform = `translateX(${frozen}px)`;
            animating = false;
            mouseStartX = e.clientX;
            mouseStartOffset = frozen;
            clearInterval(autoTimer);
            e.preventDefault();
        });

        window.addEventListener("mousemove", (e) => {
            if (!mouseDown) return;
            track.style.transition = "none";
            track.style.transform = `translateX(${mouseStartOffset + e.clientX - mouseStartX}px)`;
        });

        window.addEventListener("mouseup", (e) => {
            if (!mouseDown) return;
            mouseDown = false;
            const dx = e.clientX - mouseStartX;
            if (Math.abs(dx) > 5) {
                go(dx < 0 ? 1 : -1);
            } else {
                moveTo(cur, true);
            }
            startAutoplay();
        });

        // Recalculate position on resize
        let resizeTimer = null;
        window.addEventListener("resize", () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => moveTo(cur, false), 100);
        });

        // Init
        moveTo(cur, false);
        resetProgress();
        startAutoplay();
    }
}
// Custom Carousel [END]
