(function() {
  function getPlayers() {
    return Array.from(document.querySelectorAll('[data-video-wrap]')).filter(wrapper => {
      return wrapper.querySelector('source[data-src]');
    });
  }

  function shouldAutoplay(video) {
    return video.hasAttribute('autoplay') || video.hasAttribute('data-autoplay');
  }

  function playWhenReady(video) {
    if (!shouldAutoplay(video)) return;

    const startPlayback = () => {
      video.play().catch(() => {});
    };

    if (video.readyState >= 2) {
      startPlayback();
      return;
    }

    video.addEventListener('canplay', startPlayback, { once: true });
  }

  function setupPlayPauseBtn(wrapper, video) {
    const playBtn = wrapper.querySelector('[data-video-play]');
    const pauseBtn = wrapper.querySelector('[data-video-pause]');

    if (!playBtn || !pauseBtn) return;

    pauseBtn.style.display = 'none';

    playBtn.addEventListener('click', () => {
      video.play().catch(() => {});
      playBtn.style.display = 'none';
      pauseBtn.style.display = '';
    });

    pauseBtn.addEventListener('click', () => {
      video.pause();
      pauseBtn.style.display = 'none';
      playBtn.style.display = '';
    });

    video.addEventListener('ended', () => {
      pauseBtn.style.display = 'none';
      playBtn.style.display = '';
    });
  }

  function loadVideo(wrapper) {
    if (wrapper.dataset.initialized === 'true') return;

    const video = wrapper.querySelector('video');
    if (!video) return;

    const sources = video.querySelectorAll('source');
    if (!sources.length) return;

    let hasAny = false;
    sources.forEach(source => {
      const videoUrl = source.getAttribute('data-src');

      if (videoUrl) {
        source.src = videoUrl;
        hasAny = true;
      } else {
        source.removeAttribute('src');
      }
    });

    if (!hasAny) return;

    wrapper.dataset.initialized = 'true';
    video.load();
    setupPlayPauseBtn(wrapper, video);
    playWhenReady(video);
  }

  function loadByPriority(players, index) {
    if (index >= players.length) return;

    const wrapper = players[index];
    const video = wrapper.querySelector('video');

    let advanced = false;
    function next() {
      if (advanced) return;
      advanced = true;
      loadByPriority(players, index + 1);
    }

    if (video) video.addEventListener('loadeddata', next, { once: true });
    setTimeout(next, 5000);

    loadVideo(wrapper);

    if (wrapper.dataset.initialized !== 'true') {
      next();
    }
  }

  function init() {
    loadByPriority(getPlayers(), 0);
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
