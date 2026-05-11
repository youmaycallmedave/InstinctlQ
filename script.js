document.addEventListener('click', function(e) {
  var wrapper = e.target.closest('.vimeo-facade');
  if (!wrapper || wrapper.querySelector('iframe')) return;

  var videoId = wrapper.getAttribute('data-vimeo-id');

  var iframe = document.createElement('iframe');
  iframe.setAttribute('src', 'https://player.vimeo.com/video/' + videoId + '?autoplay=1&dnt=1');
  iframe.setAttribute('frameborder', '0');
  iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
  iframe.setAttribute('allowfullscreen', '');

  wrapper.innerHTML = '';
  wrapper.appendChild(iframe);
});