var style = document.createElement('style');
style.textContent = '.contact_add-file { display: none; }';
document.head.appendChild(style);

document.addEventListener('click', function (e) {
  var toggle = e.target.closest('.tabs_nav-toggle');
  if (!toggle) return;

  var addWrap = document.querySelector('.contact_add-wrap');
  var addFile = document.querySelector('.contact_add-file');

  if (!addWrap || !addFile) return;

  var isActive = toggle.classList.toggle('is-active');
  addWrap.style.display = isActive ? 'none' : '';
  addFile.style.display = isActive ? 'block' : 'none';
});
