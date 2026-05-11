document.addEventListener('click', function (e) {
    var wrapper = e.target.closest('.vimeo_lazy-wrap');
    if (!wrapper || wrapper.classList.contains('vimeo_lazy-bg') || wrapper.querySelector('iframe')) return;

    var videoId = wrapper.getAttribute('data-vimeo-id');

    var iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://player.vimeo.com/video/' + videoId + '?autoplay=1&dnt=1');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');

    wrapper.appendChild(iframe);

    var play = wrapper.querySelector('.vimeo_lazy-play');
    if (play) play.style.display = 'none';

    iframe.addEventListener('load', function () {
        var poster = wrapper.querySelector('.vimeo_lazy-poster');
        if (poster) poster.style.opacity = '0';
    });
});

function loadBgVideo(el) {
    if (el.querySelector('iframe')) return;

    var videoId = el.getAttribute('data-vimeo-id');
    var iframe = document.createElement('iframe');
    iframe.setAttribute('src', 'https://player.vimeo.com/video/' + videoId + '?background=1&dnt=1');
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allow', 'autoplay');

    el.appendChild(iframe);

    iframe.addEventListener('load', function () {
        var poster = el.querySelector('.vimeo_lazy-poster');
        if (poster) poster.style.opacity = '0';
    });
}

document.querySelectorAll('.vimeo_lazy-bg').forEach(function (el) {
    ScrollTrigger.create({
        trigger: el,
        start: 'top bottom+=1500',
        once: true,
        onEnter: function () {
            loadBgVideo(el);
        }
    });
});