document.addEventListener('click', function (e) {
    var wrapper = e.target.closest('.vimeo_lazy-wrap');
    if (!wrapper) return;
    if (wrapper.classList.contains('vimeo_lazy-bg') || wrapper.classList.contains('vimeo_eager-bg')) return;
    if (wrapper.querySelector('.vimeo_main-iframe')) return;

    var videoId = wrapper.getAttribute('data-vimeo-play-id') || wrapper.getAttribute('data-vimeo-id');
    if (!videoId) return;

    var iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://player.vimeo.com/video/' + videoId + '?autoplay=1&dnt=1');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.classList.add('vimeo_main-iframe');

    wrapper.appendChild(iframe);

    var play = wrapper.querySelector('.vimeo_lazy-play');
    if (play) play.style.display = 'none';

    iframe.addEventListener('load', function () {
        iframe.style.opacity = '1';
    });
});

function loadBgVideo(el) {
    if (el.querySelector('iframe')) return;

    var videoId = el.getAttribute('data-vimeo-id');
    if (!videoId) return;

    var iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://player.vimeo.com/video/' + videoId + '?background=1&loop=1&dnt=1');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'autoplay');

    el.appendChild(iframe);

    iframe.addEventListener('load', function () {
        iframe.style.opacity = '1';
    });
}

// обычные фоновые видео
document.querySelectorAll('.vimeo_eager-bg').forEach(function (el) {
    loadBgVideo(el);
});

// превью-видео внутри постера
document.querySelectorAll('.vimeo_lazy-poster-video[data-vimeo-id]').forEach(function (el) {
    loadBgVideo(el);
});

document.querySelectorAll('.vimeo_lazy-bg').forEach(function (el) {
    ScrollTrigger.create({
        trigger: el,
        start: 'top bottom+=2500',
        once: true,
        onEnter: function () {
            loadBgVideo(el);
        }
    });
});
